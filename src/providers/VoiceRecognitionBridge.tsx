import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { useEffect } from 'react';

import { VOICE_CONTEXTUAL_STRINGS } from '@/lib/voiceCommands';

/** New Zealand English so place/brand pronunciations resolve sensibly. */
const RECOGNITION_LANG = 'en-NZ';

/** Imperative controls the provider drives once the bridge has mounted. */
export type RecognitionControls = {
  start: () => Promise<void>;
  stop: () => void;
};

/** Callbacks the bridge invokes as native recognition events arrive. */
export type RecognitionHandlers = {
  onStart: () => void;
  onEnd: () => void;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (code: string) => void;
  onPermissionDenied: () => void;
};

/**
 * Isolates every `expo-speech-recognition` import behind a lazy boundary.
 *
 * The package requires its native module at import time (throwing if absent),
 * so the {@link VoiceProvider} only `React.lazy`-loads this bridge after probing
 * {@link SPEECH_RECOGNITION_AVAILABLE}. Mounting it both subscribes to the native
 * events and hands the provider start/stop controls; unmounting tears capture down.
 */
export default function VoiceRecognitionBridge({
  handlers,
  registerControls,
}: {
  handlers: RecognitionHandlers;
  registerControls: (controls: RecognitionControls | null) => void;
}) {
  useSpeechRecognitionEvent('start', handlers.onStart);
  useSpeechRecognitionEvent('end', handlers.onEnd);
  useSpeechRecognitionEvent('result', (event) => {
    handlers.onResult(event.results[0]?.transcript ?? '', event.isFinal);
  });
  useSpeechRecognitionEvent('error', (event) => handlers.onError(event.error));

  useEffect(() => {
    registerControls({
      start: async () => {
        const perms = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!perms.granted) {
          handlers.onPermissionDenied();
          return;
        }
        ExpoSpeechRecognitionModule.start({
          lang: RECOGNITION_LANG,
          interimResults: true,
          continuous: false,
          contextualStrings: VOICE_CONTEXTUAL_STRINGS,
        });
      },
      stop: () => {
        try {
          ExpoSpeechRecognitionModule.stop();
        } catch {
          // Nothing to stop.
        }
      },
    });
    return () => {
      // Opting out / unmounting must immediately tear down any live capture.
      try {
        ExpoSpeechRecognitionModule.abort();
      } catch {
        // No active session.
      }
      registerControls(null);
    };
  }, [handlers, registerControls]);

  return null;
}
