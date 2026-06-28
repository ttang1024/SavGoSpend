import type { Href } from 'expo-router';

/**
 * Voice Commands — the spoken control surface for members 65+.
 *
 * This module is intentionally pure (no React Native / native imports) so the
 * vocabulary and matching can be reasoned about and unit-tested in isolation.
 * The runtime that captures speech and executes these lives in
 * `providers/VoiceProvider`.
 */

export type VoiceAction =
  | { kind: 'navigate'; href: Href }
  | { kind: 'emergency' }
  | { kind: 'help' };

export type VoiceCommand = {
  id: string;
  /** Friendly name shown in the "what can I say" list and the status pill. */
  label: string;
  /** Lower-case phrases that trigger the command; the longest match wins. */
  phrases: string[];
  action: VoiceAction;
  /** Spoken + shown confirmation when the command runs. */
  confirmation: string;
};

/**
 * Phrase order is logical, not priority — matching prefers the longest phrase,
 * so "nearby retailers" beats a stray "nearby" elsewhere in the utterance.
 * Each command lists natural variants an older member might actually say.
 */
export const VOICE_COMMANDS: VoiceCommand[] = [
  {
    id: 'home',
    label: 'Home',
    phrases: ['home', 'go home', 'main menu', 'start screen'],
    action: { kind: 'navigate', href: '/' },
    confirmation: 'Going to the home screen.',
  },
  {
    id: 'card',
    label: 'My card',
    phrases: ['my card', 'membership card', 'show my card', 'show card', 'card'],
    action: { kind: 'navigate', href: '/card' },
    confirmation: 'Opening your membership card.',
  },
  {
    id: 'rewards',
    label: 'Smart Rewards',
    phrases: ['smart rewards', 'my rewards', 'rewards', 'my points', 'points'],
    action: { kind: 'navigate', href: '/rewards' },
    confirmation: 'Opening Smart Rewards.',
  },
  {
    id: 'retailers',
    label: 'Nearby retailers',
    phrases: ['nearby retailers', 'nearby shops', 'find shops', 'shops near me', 'retailers', 'nearby'],
    action: { kind: 'navigate', href: '/retailers' },
    confirmation: 'Finding retailers near you.',
  },
  {
    id: 'whats-on',
    label: "What's on",
    phrases: ['what is on', 'what s on', 'whats on', 'local events', 'events'],
    action: { kind: 'navigate', href: '/whats-on' },
    confirmation: "Opening What's On.",
  },
  {
    id: 'good-to-know',
    label: 'Good to know',
    phrases: ['good to know', 'travel information', 'information', 'helpful tips', 'tips'],
    action: { kind: 'navigate', href: '/good-to-know' },
    confirmation: 'Opening Good to Know.',
  },
  {
    id: 'aroha',
    label: 'Aroha support',
    phrases: ['aroha', 'help and support', 'talk to someone', 'support'],
    action: { kind: 'navigate', href: '/aroha' },
    confirmation: 'Opening Aroha support.',
  },
  {
    id: 'settings',
    label: 'Settings',
    phrases: ['accessibility settings', 'accessibility', 'settings', 'options'],
    action: { kind: 'navigate', href: '/settings' },
    confirmation: 'Opening Settings.',
  },
  {
    id: 'emergency',
    label: 'Emergency call',
    phrases: ['emergency', 'sos', 'call for help', 'help me', 'call triple one', 'triple one', 'one one one'],
    action: { kind: 'emergency' },
    confirmation: 'Opening the emergency call.',
  },
  {
    id: 'help',
    label: 'What can I say',
    phrases: ['what can i say', 'what can you do', 'voice help', 'list commands', 'help with voice'],
    action: { kind: 'help' },
    confirmation: '',
  },
];

/** Short app-specific terms fed to the recogniser to bias it toward our vocabulary. */
export const VOICE_CONTEXTUAL_STRINGS = ['Aroha', 'SavGoSpend', 'retailers', 'rewards'];

const NON_WORD = /[^\p{L}\p{N}\s]/gu;

/** Lower-cases, strips punctuation, and collapses whitespace to bare words. */
export function normalizeTranscript(raw: string): string {
  return raw.toLowerCase().replace(NON_WORD, ' ').replace(/\s+/g, ' ').trim();
}

/** True when `phraseWords` appears as a contiguous run inside `textWords`. */
function containsPhrase(textWords: string[], phraseWords: string[]): boolean {
  if (phraseWords.length === 0 || phraseWords.length > textWords.length) return false;
  for (let i = 0; i + phraseWords.length <= textWords.length; i++) {
    let matched = true;
    for (let j = 0; j < phraseWords.length; j++) {
      if (textWords[i + j] !== phraseWords[j]) {
        matched = false;
        break;
      }
    }
    if (matched) return true;
  }
  return false;
}

/**
 * Resolves a spoken transcript to a command, or `null` if nothing matched.
 *
 * Matching is whole-word (so "card" won't fire on "discard") and prefers the
 * longest matching phrase, so a specific request wins over a generic keyword
 * that happens to also appear in the sentence.
 */
export function matchVoiceCommand(raw: string): VoiceCommand | null {
  const textWords = normalizeTranscript(raw).split(' ').filter(Boolean);
  if (textWords.length === 0) return null;

  let best: { command: VoiceCommand; score: number } | null = null;
  for (const command of VOICE_COMMANDS) {
    for (const phrase of command.phrases) {
      const phraseWords = normalizeTranscript(phrase).split(' ').filter(Boolean);
      if (!containsPhrase(textWords, phraseWords)) continue;
      const score = phraseWords.join(' ').length;
      if (!best || score > best.score) best = { command, score };
    }
  }
  return best?.command ?? null;
}

/** Builds the spoken/visible "what can I say" prompt from the live vocabulary. */
export function buildHelpSpeech(): string {
  const examples = VOICE_COMMANDS.filter((c) => c.action.kind !== 'help').map((c) => c.label);
  return `You can say: ${examples.join(', ')}. Tap the microphone, then speak.`;
}
