/**
 * Aroha — the SGO in-app companion. Content is kept here so copy can be tuned
 * (and later translated via Google Translate / DeepL) without touching UI code.
 * "Aroha" is te reo Māori for love, compassion, and care.
 */

export const AROHA = {
  name: 'Aroha',
  /** First-encounter pronunciation guide, shown once on first meeting. */
  pronunciation: {
    phonetic: 'uh-ROH-huh',
    meaning: 'Aroha means love, compassion, and care in te reo Māori.',
  },
  greeting:
    'Kia ora, I’m Aroha. I’m here to help you travel with confidence. Take your time — I’ll explain things in plain, friendly language whenever you need.',
  quickHelp: [
    {
      id: 'card',
      question: 'Where is my membership card?',
      answer:
        'Your digital membership card lives in the Card tab. It’s always there, even without internet, and it never expires.',
    },
    {
      id: 'retailers',
      question: 'How do I find nearby shops?',
      answer:
        'Tap “Nearby Retailers” on the home screen to see participating shops on a map and learn what each one offers.',
    },
    {
      id: 'points',
      question: 'How do I earn rewards?',
      answer:
        'You collect Smart Rewards points when you visit participating retailers. As your points grow, you move up through the membership tiers.',
    },
  ],
} as const;
