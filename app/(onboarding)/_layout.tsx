import { Stack } from 'expo-router';
import { createContext, useContext, useMemo, useState } from 'react';

import { useTheme } from '@/theme/ThemeProvider';
import { Country, DEFAULT_OPT_INS, OptInSettings } from '@/types';

/** Draft answers collected across onboarding steps before the member is created. */
type OnboardingDraft = {
  displayName: string;
  email: string;
  homeCountry: Country;
  optIns: OptInSettings;
};

type DraftContextValue = {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
};

const initialDraft: OnboardingDraft = {
  displayName: '',
  email: '',
  homeCountry: 'NZ',
  optIns: { ...DEFAULT_OPT_INS },
};

const DraftContext = createContext<DraftContextValue | undefined>(undefined);

export function useOnboardingDraft(): DraftContextValue {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error('useOnboardingDraft must be used within the onboarding layout');
  return ctx;
}

export default function OnboardingLayout() {
  const theme = useTheme();
  const [draft, setDraft] = useState<OnboardingDraft>(initialDraft);

  const value = useMemo<DraftContextValue>(
    () => ({ draft, update: (patch) => setDraft((d) => ({ ...d, ...patch })) }),
    [draft],
  );

  return (
    <DraftContext.Provider value={value}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          // Disable swipe-back so members complete steps in order.
          gestureEnabled: false,
        }}
      />
    </DraftContext.Provider>
  );
}
