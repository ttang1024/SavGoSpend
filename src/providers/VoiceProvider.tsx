import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, {
  createContext,
  Suspense,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { confirmEmergencyCall } from '@/lib/emergency';
import { SPEECH_RECOGNITION_AVAILABLE } from '@/lib/speechRecognition';
import { buildHelpSpeech, matchVoiceCommand, type VoiceCommand } from '@/lib/voiceCommands';
import { useAccessibility } from '@/theme';
import type {
  RecognitionControls,
  RecognitionHandlers,
} from '@/providers/VoiceRecognitionBridge';

// Loaded only when the native module is present (see VoiceRecognitionBridge), so
// Expo Go / unsupported binaries never evaluate `expo-speech-recognition`.
const VoiceRecognitionBridge = lazy(() => import('@/providers/VoiceRecognitionBridge'));

/** Gentle pace + warm pitch suit spoken feedback for members 65+. */
const SPEECH_OPTIONS: Speech.SpeechOptions = { language: 'en-NZ', rate: 0.95, pitch: 1.0 };

/**
 * The OS otherwise falls back to a low-quality "compact" voice that sounds
 * robotic. Pick the most natural English voice once, preferring an Enhanced
 * (neural) voice and the closest locale to en-NZ. Resolves to `undefined` when
 * nothing better than the default is installed, so we simply fall back to it.
 */
const LOCALE_PREFERENCE = ['en-nz', 'en-au', 'en-gb', 'en-ie', 'en-us', 'en'];

function rankVoice(voice: Speech.Voice): number {
  const lang = voice.language?.toLowerCase() ?? '';
  const localeIndex = LOCALE_PREFERENCE.findIndex((code) => lang.startsWith(code));
  if (localeIndex === -1) return -1; // Not English — never use it.
  const enhanced = voice.quality === Speech.VoiceQuality.Enhanced ? 100 : 0;
  // Earlier locales score higher; Enhanced quality dominates the ranking.
  return enhanced + (LOCALE_PREFERENCE.length - localeIndex);
}

let naturalVoicePromise: Promise<string | undefined> | undefined;
function getNaturalVoiceId(): Promise<string | undefined> {
  naturalVoicePromise ??= Speech.getAvailableVoicesAsync()
    .then((voices) => {
      let best: Speech.Voice | undefined;
      let bestScore = 0;
      for (const voice of voices) {
        const score = rankVoice(voice);
        if (score > bestScore) {
          best = voice;
          bestScore = score;
        }
      }
      return best?.identifier;
    })
    .catch(() => undefined);
  return naturalVoicePromise;
}
/** How long a confirmation/transcript lingers in the status pill before clearing. */
const MESSAGE_TIMEOUT_MS = 5000;

const MIC_PERMISSION_MESSAGE =
  'I need microphone access to listen. You can turn it on in your device settings.';

export type VoiceStatus = 'idle' | 'listening' | 'processing' | 'unsupported';

type VoiceContextValue = {
  /** Speech recognition is present on this device (false in Expo Go / web fallback). */
  available: boolean;
  /** The member has opted in via the "Voice Commands" accessibility setting. */
  enabled: boolean;
  status: VoiceStatus;
  /** What the recogniser is currently hearing (interim or final). */
  transcript: string;
  /** Last spoken feedback line, mirrored on screen for members who can't hear it. */
  message: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  /** Speaks/shows the list of available commands. */
  speakHelp: () => void;
};

const VoiceContext = createContext<VoiceContextValue | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { settings } = useAccessibility();
  const enabled = settings.voiceCommands;
  const available = SPEECH_RECOGNITION_AVAILABLE;

  const [status, setStatus] = useState<VoiceStatus>(available ? 'idle' : 'unsupported');
  const [transcript, setTranscript] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // Imperative start/stop handed up by the bridge while it is mounted.
  const controlsRef = useRef<RecognitionControls | null>(null);
  const registerControls = useCallback((controls: RecognitionControls | null) => {
    controlsRef.current = controls;
  }, []);

  // Resolved once: the most natural installed voice, applied to all feedback.
  const voiceIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    getNaturalVoiceId().then((id) => {
      if (!cancelled) voiceIdRef.current = id;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Speak + surface a line of feedback, then auto-clear it from the pill.
  const messageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedback = useCallback((text: string, spoken = true) => {
    setMessage(text);
    if (spoken) {
      Speech.stop().catch(() => {});
      try {
        Speech.speak(text, { ...SPEECH_OPTIONS, voice: voiceIdRef.current });
      } catch {
        // TTS is best-effort; the on-screen message still conveys the result.
      }
    }
    if (messageTimer.current) clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setMessage(null), MESSAGE_TIMEOUT_MS);
  }, []);

  const speakHelp = useCallback(() => feedback(buildHelpSpeech()), [feedback]);

  const runCommand = useCallback(
    (command: VoiceCommand) => {
      const { action } = command;
      switch (action.kind) {
        case 'navigate':
          feedback(command.confirmation);
          router.navigate(action.href);
          break;
        case 'emergency':
          feedback(command.confirmation);
          confirmEmergencyCall();
          break;
        case 'help':
          speakHelp();
          break;
      }
    },
    [feedback, router, speakHelp],
  );

  const handleFinalTranscript = useCallback(
    (text: string) => {
      const command = matchVoiceCommand(text);
      if (command) {
        runCommand(command);
      } else {
        feedback("Sorry, I didn't catch a command. Say ‘what can I say’ for a list.");
      }
      setStatus('idle');
    },
    [feedback, runCommand],
  );

  // Stable handlers for the bridge; identity matters so it doesn't re-subscribe.
  const handlers = useMemo<RecognitionHandlers>(
    () => ({
      onStart: () => setStatus('listening'),
      onEnd: () => setStatus((prev) => (prev === 'listening' ? 'idle' : prev)),
      onResult: (heard, isFinal) => {
        setTranscript(heard);
        if (isFinal && heard.trim()) {
          setStatus('processing');
          handleFinalTranscript(heard);
        }
      },
      onError: (code) => {
        setStatus('idle');
        // "no-speech" is routine (the member paused) — stay quiet on that one.
        if (code === 'no-speech') {
          setMessage(null);
          return;
        }
        feedback(
          code === 'not-allowed' || code === 'service-not-allowed'
            ? MIC_PERMISSION_MESSAGE
            : "Sorry, I couldn't hear you. Please try again.",
        );
      },
      onPermissionDenied: () => feedback(MIC_PERMISSION_MESSAGE),
    }),
    [feedback, handleFinalTranscript],
  );

  const startListening = useCallback(async () => {
    if (!available || !controlsRef.current) {
      feedback('Voice commands are not available on this device.');
      return;
    }
    try {
      setTranscript('');
      setMessage(null);
      Speech.stop().catch(() => {});
      await controlsRef.current.start();
    } catch {
      setStatus('idle');
      feedback('Sorry, I could not start listening. Please try again.');
    }
  }, [available, feedback]);

  const stopListening = useCallback(() => {
    controlsRef.current?.stop();
    setStatus((prev) => (prev === 'listening' ? 'idle' : prev));
  }, []);

  // Silence any in-flight speech when the member opts out.
  useEffect(() => {
    if (!enabled) Speech.stop().catch(() => {});
  }, [enabled]);

  useEffect(
    () => () => {
      if (messageTimer.current) clearTimeout(messageTimer.current);
      Speech.stop().catch(() => {});
    },
    [],
  );

  const value = useMemo<VoiceContextValue>(
    () => ({
      available,
      enabled,
      status,
      transcript,
      message,
      startListening,
      stopListening,
      speakHelp,
    }),
    [available, enabled, status, transcript, message, startListening, stopListening, speakHelp],
  );

  return (
    <VoiceContext.Provider value={value}>
      {children}
      {/* Mount the native bridge only when supported and opted in. */}
      {available && enabled ? (
        <Suspense fallback={null}>
          <VoiceRecognitionBridge handlers={handlers} registerControls={registerControls} />
        </Suspense>
      ) : null}
    </VoiceContext.Provider>
  );
}

export function useVoice(): VoiceContextValue {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error('useVoice must be used within a VoiceProvider');
  return ctx;
}
