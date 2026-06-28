/**
 * Smart Rewards tier logic. Pure and side-effect free so it can be unit tested
 * and reused on the (future) server.
 *
 * Tier names, thresholds, and icons are placeholders pending SGO's Build Brief
 * and Holly Riley's Visual Identity Guide. "Kaumatua" (respected elder) is used
 * as the highest tier as a mark of honour.
 */
import { MembershipTier } from '@/types';

export type TierInfo = {
  tier: MembershipTier;
  /** Minimum lifetime points to reach this tier. */
  minPoints: number;
  icon: string;
  blurb: string;
};

/** Ordered lowest → highest. The first tier must start at 0 points. */
export const TIERS: TierInfo[] = [
  { tier: 'Explorer', minPoints: 0, icon: '🌱', blurb: 'Welcome aboard — your journey begins.' },
  { tier: 'Wayfarer', minPoints: 100, icon: '🧭', blurb: 'Finding your way with confidence.' },
  { tier: 'Voyager', minPoints: 250, icon: '⛵', blurb: 'A seasoned traveller now.' },
  { tier: 'Pathfinder', minPoints: 500, icon: '🗺️', blurb: 'You know the lay of the land.' },
  { tier: 'Kaumatua', minPoints: 1000, icon: '🌟', blurb: 'Our most honoured members.' },
];

export function tierInfo(tier: MembershipTier): TierInfo {
  return TIERS.find((t) => t.tier === tier) ?? TIERS[0];
}

export function tierIndex(tier: MembershipTier): number {
  return Math.max(0, TIERS.findIndex((t) => t.tier === tier));
}

/** The highest tier whose threshold the given points have reached. */
export function tierForPoints(points: number): MembershipTier {
  let current = TIERS[0].tier;
  for (const t of TIERS) {
    if (points >= t.minPoints) current = t.tier;
    else break;
  }
  return current;
}

export type TierProgress = {
  current: TierInfo;
  next: TierInfo | null;
  /** Fraction toward the next tier, 0–1. 1 when already at the top tier. */
  progress: number;
  /** Points still needed to reach the next tier. 0 at the top tier. */
  pointsToNext: number;
};

export function tierProgress(points: number): TierProgress {
  const current = tierInfo(tierForPoints(points));
  const next = TIERS[tierIndex(current.tier) + 1] ?? null;

  if (!next) {
    return { current, next: null, progress: 1, pointsToNext: 0 };
  }

  const span = next.minPoints - current.minPoints;
  const into = points - current.minPoints;
  const progress = span > 0 ? Math.min(1, Math.max(0, into / span)) : 0;
  return { current, next, progress, pointsToNext: Math.max(0, next.minPoints - points) };
}
