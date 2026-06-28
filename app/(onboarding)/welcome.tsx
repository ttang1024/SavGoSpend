import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { AROHA } from '@/constants/aroha';
import { useTheme } from '@/theme/ThemeProvider';

const VALUE_PROPS = [
  { icon: '📍', text: 'Find participating retailers wherever you travel' },
  { icon: '🪪', text: 'A membership card that works offline and never expires' },
  { icon: '🎁', text: 'Earn Smart Rewards as you go' },
];

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
        <AppText variant="display" weight="bold">
          Kia ora 👋
        </AppText>
        <AppText variant="title" weight="bold" color={theme.colors.primary}>
          Welcome to SavGoSpend
        </AppText>
        <AppText variant="body" color={theme.colors.textSecondary}>
          Travel with confidence, dignity, and a sense of belonging — wherever you go.
        </AppText>
      </View>

      <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.md }}>
        {VALUE_PROPS.map((item) => (
          <View key={item.text} style={[styles.prop, { gap: theme.spacing.md }]}>
            <AppText variant="title">{item.icon}</AppText>
            <AppText variant="body" style={{ flex: 1 }}>
              {item.text}
            </AppText>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.aroha,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.accent,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.lg,
            gap: theme.spacing.xs,
          },
        ]}
      >
        <AppText variant="label" weight="bold">
          {AROHA.name} · “{AROHA.pronunciation.phonetic}”
        </AppText>
        <AppText variant="body" color={theme.colors.textSecondary}>
          Your friendly companion. {AROHA.pronunciation.meaning}
        </AppText>
      </View>

      <View style={{ marginTop: theme.spacing.md }}>
        <PrimaryButton
          label="Let's get started"
          onPress={() => router.push('/(onboarding)/about-you')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  prop: { flexDirection: 'row', alignItems: 'center' },
  aroha: { borderWidth: 2, marginTop: 8 },
});
