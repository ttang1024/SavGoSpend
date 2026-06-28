/** Core domain models for SGO. These mirror the planned Firestore collections. */

export type Country = 'NZ' | 'AU';

/** Five-tier Smart Rewards progression (names are placeholders pending brief). */
export type MembershipTier = 'Explorer' | 'Wayfarer' | 'Voyager' | 'Pathfinder' | 'Kaumatua';

export type Member = {
  id: string;
  displayName: string;
  membershipNumber: string;
  joinedAt: string; // ISO date
  tier: MembershipTier;
  /** Spendable balance — points available to redeem right now. */
  points: number;
  /**
   * Total points ever earned. Drives the membership tier and never decreases,
   * so redeeming points never demotes a member — a deliberate, dignity-first
   * choice (a Kaumatua stays a Kaumatua).
   */
  lifetimePoints: number;
  homeCountry: Country;
};

/**
 * Privacy Act 2020 opt-ins. Every field defaults to `false` — consent is
 * explicit and opt-IN, never assumed.
 */
export type OptInSettings = {
  location: boolean;
  notifications: boolean;
  shareUsageData: boolean;
};

export const DEFAULT_OPT_INS: OptInSettings = {
  location: false,
  notifications: false,
  shareUsageData: false,
};

/**
 * A single entry in the member's Smart Rewards points ledger. `points` is
 * positive when earned and negative when redeemed.
 */
export type PointsActivity = {
  id: string;
  points: number;
  reason: string;
  retailerId?: string;
  createdAt: string; // ISO date-time
};

/** A reward a member can redeem their spendable points balance for. */
export type RedeemableReward = {
  id: string;
  title: string;
  description?: string;
  cost: number;
  icon?: string;
};

/** The locally persisted member profile, including opt-ins and optional email. */
export type MemberProfile = Member & {
  email?: string;
  optIns: OptInSettings;
  pointsHistory: PointsActivity[];
};

export type Retailer = {
  id: string;
  name: string;
  category: string;
  description?: string;
  address: string;
  country: Country;
  latitude: number;
  longitude: number;
  pointsPerVisit?: number;
  phone?: string;
};

export type WhatsOnEvent = {
  id: string;
  title: string;
  summary: string;
  startsAt: string; // ISO date-time
  location?: string;
  country: Country;
};

export type GoodToKnowArticle = {
  id: string;
  title: string;
  body: string;
  category: string;
};
