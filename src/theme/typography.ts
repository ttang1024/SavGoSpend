/**
 * Typography scale for SGO.
 *
 * Base sizes are intentionally large for readability by members 65+. The
 * "Larger Text" accessibility setting multiplies every size via `scale`.
 */

export const baseFontSizes = {
  display: 34,
  title: 28,
  heading: 22,
  body: 18, // larger-than-typical default for legibility
  label: 16,
  caption: 14,
} as const;

export type FontSizeKey = keyof typeof baseFontSizes;

/** Returns font sizes scaled by the user's "Larger Text" preference. */
export function scaledFontSizes(scale: number) {
  return Object.fromEntries(
    Object.entries(baseFontSizes).map(([key, size]) => [key, Math.round(size * scale)]),
  ) as Record<FontSizeKey, number>;
}

export const lineHeights: Record<FontSizeKey, number> = {
  display: 1.2,
  title: 1.25,
  heading: 1.3,
  body: 1.5, // generous leading aids reading
  label: 1.4,
  caption: 1.4,
};

export const fontWeights = {
  regular: '400',
  medium: '600',
  bold: '700',
} as const;
