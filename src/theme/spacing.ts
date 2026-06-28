/**
 * Spacing, radius, and touch-target tokens.
 *
 * `touchTarget.min` (56) exceeds the WCAG / platform 44–48px minimum so that
 * controls are comfortable for members with reduced dexterity or vision.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const touchTarget = {
  min: 56,
} as const;
