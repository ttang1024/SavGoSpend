import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { StepProgress } from '@/components/StepProgress';
import { ToggleRow } from '@/components/ToggleRow';
import { useTheme } from '@/theme/ThemeProvider';
import { OptInSettings } from '@/types';
import { useOnboardingDraft } from './_layout';

const OPT_INS: { key: keyof OptInSettings; label: string; hint: string }[] = [
  {
    key: 'location',
    label: 'Use my location',
    hint: 'So we can show participating retailers near you. You can change this anytime.',
  },
  {
    key: 'notifications',
    label: 'Send me notifications',
    hint: 'Gentle reminders about local events and rewards.',
  },
  {
    key: 'shareUsageData',
    label: 'Share anonymous usage data',
    hint: 'Helps us improve SGO. No personal information is ever shared.',
  },
];

export default function PreferencesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { draft, update } = useOnboardingDraft();

  const setOptIn = (key: keyof OptInSettings, value: boolean) =>
    update({ optIns: { ...draft.optIns, [key]: value } });

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <StepProgress total={3} current={2} />

      <View style={{ gap: theme.spacing.xs }}>
        <AppText variant="title" weight="bold">
          Your choices
        </AppText>
        <AppText variant="body" color={theme.colors.textSecondary}>
          You’re in control. Everything below is off until you turn it on, and you can change
          your mind whenever you like.
        </AppText>
      </View>

      {OPT_INS.map((item) => (
        <ToggleRow
          key={item.key}
          label={item.label}
          hint={item.hint}
          value={draft.optIns[item.key]}
          onValueChange={(v) => setOptIn(item.key, v)}
        />
      ))}

      <AppText variant="caption" color={theme.colors.textMuted}>
        SGO protects your information under the New Zealand Privacy Act 2020.
      </AppText>

      <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
        <PrimaryButton label="Continue" onPress={() => router.push('/(onboarding)/all-set')} />
        <PrimaryButton
          label="Back"
          tone="neutral"
          onPress={() => router.back()}
          accessibilityHint="Return to the previous step"
        />
      </View>
    </Screen>
  );
}
