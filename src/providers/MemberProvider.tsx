import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { endSession, ensureSignedIn, observeUid } from '@/lib/authSession';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { deleteMemberDoc, saveMemberDoc, subscribeMemberDoc } from '@/lib/firestore';
import { tierForPoints } from '@/lib/rewards';
import { MembershipTier, MemberProfile, OptInSettings } from '@/types';

const STORAGE_KEY = 'sgo.member.v1';

export type OnboardingInput = {
  displayName: string;
  homeCountry: MemberProfile['homeCountry'];
  email?: string;
  optIns: OptInSettings;
};

export type AwardPointsInput = {
  points: number;
  reason: string;
  retailerId?: string;
};

export type AwardResult = {
  awarded: boolean;
  tierChanged: boolean;
  newTier: MembershipTier;
};

type MemberContextValue = {
  member: MemberProfile | null;
  /** True once the cached profile has been read (or confirmed absent). */
  ready: boolean;
  /** A member exists, so onboarding is complete. */
  onboarded: boolean;
  /** Whether profiles sync to the cloud (Firebase configured) vs local only. */
  syncEnabled: boolean;
  completeOnboarding: (input: OnboardingInput) => Promise<void>;
  /** Awards Smart Rewards points, recomputes the tier, and records the activity. */
  awardPoints: (input: AwardPointsInput) => Promise<AwardResult>;
  updateOptIns: (optIns: OptInSettings) => Promise<void>;
  /** Clears the profile (local + cloud) — used for testing and "start over". */
  resetMember: () => Promise<void>;
};

const MemberContext = createContext<MemberContextValue | undefined>(undefined);

/** Generates a friendly, human-readable membership number: SGO-1234-5678. */
function generateMembershipNumber(): string {
  const block = () => Math.floor(1000 + Math.random() * 9000);
  return `SGO-${block()}-${block()}`;
}

/**
 * Offline-first member store. AsyncStorage is the local cache (so the membership
 * card works with no connection), and Firestore is the cloud mirror when
 * Firebase is configured. Mutations update the cache immediately, then sync.
 */
export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [ready, setReady] = useState(false);
  // Mirror of the latest member so stable callbacks and the snapshot listener
  // can read current state without re-subscribing.
  const memberRef = useRef<MemberProfile | null>(null);

  const persist = useCallback(async (next: MemberProfile | null) => {
    memberRef.current = next;
    setMember(next);
    try {
      if (next) await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // A failed cache write is non-fatal; in-memory state is still correct.
    }
  }, []);

  // Boot: load the local cache for instant/offline availability, then (if
  // configured) attach the cloud listener which refines it when online.
  useEffect(() => {
    let active = true;
    let unsubAuth: (() => void) | undefined;
    let unsubSnap: (() => void) | undefined;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && raw) {
          const cached = JSON.parse(raw) as MemberProfile;
          memberRef.current = cached;
          setMember(cached);
        }
      } catch {
        // Ignore corrupt cache; onboarding will run again.
      } finally {
        if (active) setReady(true);
      }
    })();

    if (isFirebaseConfigured) {
      unsubAuth = observeUid((uid) => {
        unsubSnap?.();
        unsubSnap = undefined;
        if (!uid) return;
        unsubSnap = subscribeMemberDoc(
          uid,
          (remote) => {
            // Only overwrite when the cloud has data, so a transient empty
            // snapshot never wipes the offline cache.
            if (active && remote) {
              memberRef.current = remote;
              setMember(remote);
              AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remote)).catch(() => {});
            }
          },
          () => {},
        );
      });
    }

    return () => {
      active = false;
      unsubSnap?.();
      unsubAuth?.();
    };
  }, []);

  const syncCloud = useCallback((next: MemberProfile) => {
    if (isFirebaseConfigured && auth.currentUser) {
      saveMemberDoc(next).catch(() => {
        // Best-effort: the local cache already holds the change; a later
        // mutation (or app restart while online) re-syncs.
      });
    }
  }, []);

  const completeOnboarding = useCallback(
    async (input: OnboardingInput) => {
      // Anonymous auth gives a stable uid that keys the Firestore profile and
      // backs the security rules; fall back to a local id during development.
      let id = `local-${Date.now()}`;
      if (isFirebaseConfigured) {
        try {
          id = await ensureSignedIn();
        } catch {
          // Offline or misconfigured: keep the local id, sync later.
        }
      }

      const profile: MemberProfile = {
        id,
        displayName: input.displayName.trim(),
        email: input.email?.trim() || undefined,
        membershipNumber: generateMembershipNumber(),
        joinedAt: new Date().toISOString(),
        tier: 'Explorer',
        points: 0,
        homeCountry: input.homeCountry,
        optIns: input.optIns,
        pointsHistory: [],
      };
      await persist(profile);
      if (isFirebaseConfigured) {
        try {
          await saveMemberDoc(profile);
        } catch {
          // Created offline; the next sync writes it.
        }
      }
    },
    [persist],
  );

  const awardPoints = useCallback(
    async ({ points, reason, retailerId }: AwardPointsInput): Promise<AwardResult> => {
      const current = memberRef.current;
      if (!current || points <= 0) {
        return { awarded: false, tierChanged: false, newTier: current?.tier ?? 'Explorer' };
      }
      const newPoints = current.points + points;
      const newTier = tierForPoints(newPoints);
      const activity = {
        id: `pa-${Date.now()}`,
        points,
        reason,
        retailerId,
        createdAt: new Date().toISOString(),
      };
      const next: MemberProfile = {
        ...current,
        points: newPoints,
        tier: newTier,
        // Keep the cached ledger bounded; the full history lives in Firestore.
        pointsHistory: [activity, ...current.pointsHistory].slice(0, 50),
      };
      await persist(next);
      syncCloud(next);
      return { awarded: true, tierChanged: newTier !== current.tier, newTier };
    },
    [persist, syncCloud],
  );

  const updateOptIns = useCallback(
    async (optIns: OptInSettings) => {
      const current = memberRef.current;
      if (!current) return;
      const next = { ...current, optIns };
      await persist(next);
      syncCloud(next);
    },
    [persist, syncCloud],
  );

  const resetMember = useCallback(async () => {
    const current = memberRef.current;
    await persist(null);
    if (isFirebaseConfigured) {
      try {
        if (current && auth.currentUser) await deleteMemberDoc(auth.currentUser.uid);
        await endSession();
      } catch {
        // Best-effort cleanup.
      }
    }
  }, [persist]);

  const value = useMemo<MemberContextValue>(
    () => ({
      member,
      ready,
      onboarded: member !== null,
      syncEnabled: isFirebaseConfigured,
      completeOnboarding,
      awardPoints,
      updateOptIns,
      resetMember,
    }),
    [member, ready, completeOnboarding, awardPoints, updateOptIns, resetMember],
  );

  return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>;
}

export function useMember(): MemberContextValue {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error('useMember must be used within a MemberProvider');
  return ctx;
}
