import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { SegmentedChoice } from '@/components/SegmentedChoice';
import { StepProgress } from '@/components/StepProgress';
import { TextField } from '@/components/TextField';
import { useTheme } from '@/theme/ThemeProvider';
import { Country } from '@/types';
import { useOnboardingDraft } from './_layout';

const COUNTRY_OPTIONS = [
  { value: 'NZ' as Country, label: 'New Zealand', icon: '🇳🇿' },
  { value: 'AU' as Country, label: 'Australia', icon: '🇦🇺' },
];

export default function AboutYouScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { draft, update } = useOnboardingDraft();
  const [showError, setShowError] = useState(false);

  const nameValid = draft.displayName.trim().length > 0;

  const onContinue = () => {
    if (!nameValid) {
      setShowError(true);
      return;
    }
    router.push('/(onboarding)/preferences');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen scroll edges={['top', 'left', 'right']}>
        <StepProgress total={3} current={1} />

        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="title" weight="bold">
            About you
          </AppText>
          <AppText variant="body" color={theme.colors.textSecondary}>
            This is how we’ll greet you and set up your membership card.
          </AppText>
        </View>

        <TextField
          label="Your name"
          hint="The name you’d like Aroha to use"
          value={draft.displayName}
          onChangeText={(displayName) => update({ displayName })}
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
          error={showError && !nameValid ? 'Please enter your name' : undefined}
        />

        <TextField
          label="Email (optional)"
          hint="Only used to help you recover your account"
          value={draft.email}
          onChangeText={(email) => update({ email })}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <SegmentedChoice
          label="Where do you call home?"
          options={COUNTRY_OPTIONS}
          value={draft.homeCountry}
          onChange={(homeCountry) => update({ homeCountry })}
        />

        <View style={{ marginTop: theme.spacing.md }}>
          <PrimaryButton label="Continue" onPress={onContinue} />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
