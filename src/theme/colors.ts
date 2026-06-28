/**
 * SGO colour tokens.
 *
 * NOTE: These are accessible, dignity-first placeholder values. They MUST be
 * reconciled against Holly Riley's "UI Visual Identity Guide" (DSIGN350, 2026)
 * before launch. All foreground/background pairs below target WCAG 2.1 AA
 * contrast (4.5:1 for body text) so the app stays legible for members 65+.
 */

export const palette = {
  // Brand
  harakeke: '#1F6B4C', // deep NZ green — primary actions
  harakekeDark: '#12503A',
  pohutukawa: '#C0392B', // warm red — SOS / alerts only
  kowhai: '#E8A317', // golden accent — rewards / highlights
  sky: '#2D6CB5', // info / links

  // Neutrals
  ink: '#1A1A1A', // primary text
  slate: '#4A4A4A', // secondary text
  mist: '#6E6E6E', // tertiary / captions
  line: '#D9D9D9', // borders / dividers
  cloud: '#F2F4F3', // app background
  surface: '#FFFFFF', // cards / tiles
  white: '#FFFFFF',
  black: '#000000',

  // States
  success: '#1F6B4C',
  warning: '#E8A317',
  danger: '#C0392B',
} as const;

export type ColorScheme = {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryText: string;
  accent: string;
  info: string;
  danger: string;
  focusRing: string;
};

export const lightScheme: ColorScheme = {
  background: palette.cloud,
  surface: palette.surface,
  textPrimary: palette.ink,
  textSecondary: palette.slate,
  textMuted: palette.mist,
  border: palette.line,
  primary: palette.harakeke,
  primaryText: palette.white,
  accent: palette.kowhai,
  info: palette.sky,
  danger: palette.pohutukawa,
  focusRing: palette.sky,
};

/**
 * High-contrast scheme toggled by the "High Contrast" accessibility setting.
 * Pure black-on-white with bolder brand tones for maximum legibility.
 */
export const highContrastScheme: ColorScheme = {
  background: palette.white,
  surface: palette.white,
  textPrimary: palette.black,
  textSecondary: palette.black,
  textMuted: '#2A2A2A',
  border: palette.black,
  primary: palette.harakekeDark,
  primaryText: palette.white,
  accent: '#9A6A00',
  info: '#0B3D7A',
  danger: '#8E1B0F',
  focusRing: palette.black,
};
