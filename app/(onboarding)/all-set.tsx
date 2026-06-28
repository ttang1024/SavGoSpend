import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { StepProgress } from '@/components/StepProgress';
import { useMember } from '@/providers/MemberProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { useOnboardingDraft } from './_layout';

export default function AllSetScreen() {
  const theme = useTheme();
  const { draft } = useOnboardingDraft();
  const { completeOnboarding } = useMember();
  const [submitting, setSubmitting] = useState(false);

  // On success the member is created, `onboarded` flips true, and the root
  // guard redirects to the home tabs — no manual navigation needed here.
  const onFinish = async () => {
    setSubmitting(true);
    try {
      await completeOnboarding({
        displayName: draft.displayName,
        email: draft.email,
        homeCountry: draft.homeCountry,
        optIns: draft.optIns,
      });
    } catch {
      setSubmitting(false);
    }
  };

  const enabledOptIns = Object.entries(draft.optIns)
    .filter(([, on]) => on)
    .map(([key]) => key);

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <StepProgress total={3} current={3} />

      <View style={{ alignItems: 'center', gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
        <AppText variant="display">🎉</AppText>
        <AppText variant="title" weight="bold" center>
          You’re all set, {draft.displayName.trim() || 'friend'}!
        </AppText>
        <AppText variant="body" color={theme.colors.textSecondary} center>
          We’ll create your digital membership card now. It works offline and never expires.
        </AppText>
      </View>

      <View
        style={[
          styles.summary,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.lg,
            gap: theme.spacing.sm,
          },
        ]}
      >
        <SummaryRow label="Name" value={draft.displayName.trim() || '—'} />
        <SummaryRow label="Home" value={draft.homeCountry === 'NZ' ? 'New Zealand' : 'Australia'} />
        <SummaryRow
          label="You turned on"
          value={enabledOptIns.length ? `${enabledOptIns.length} preference(s)` : 'Nothing yet'}
        />
      </View>

      <View style={{ marginTop: theme.spacing.md }}>
        <PrimaryButton
          label="Create my card"
          onPress={onFinish}
          loading={submitting}
          accessibilityHint="Finishes setup and opens the app"
        />
      </View>
    </Screen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <AppText variant="label" color={theme.colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant="label" weight="bold">
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { borderWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
