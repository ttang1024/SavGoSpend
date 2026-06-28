import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { ToggleRow } from '@/components/ToggleRow';
import { useMember } from '@/providers/MemberProvider';
import { useVoice } from '@/providers/VoiceProvider';
import { TEXT_SCALES, TextScaleKey, useAccessibility, useTheme } from '@/theme';

const TEXT_OPTIONS: { key: TextScaleKey; label: string }[] = [
  { key: 'default', label: 'Default' },
  { key: 'large', label: 'Large' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, setTextScale, setHighContrast, setVoiceCommands } = useAccessibility();
  const { member, resetMember, syncEnabled } = useMember();
  const { available: voiceAvailable, speakHelp } = useVoice();

  const onStartOver = () => {
    Alert.alert(
      'Start over?',
      'This clears your profile on this device and returns you to the welcome screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start over', style: 'destructive', onPress: () => resetMember() },
      ],
    );
  };

  return (
    <Screen scroll>
      <AppText variant="heading" weight="bold">
        Accessibility
      </AppText>

      <Section title="Larger Text">
        <View style={[styles.row, { gap: theme.spacing.sm }]}>
          {TEXT_OPTIONS.map((opt) => {
            const active = settings.textScale === opt.key;
            return (
              <View key={opt.key} style={{ flex: 1 }}>
                <PrimaryButton
                  label={opt.label}
                  tone={active ? 'primary' : 'neutral'}
                  onPress={() => setTextScale(opt.key)}
                  accessibilityHint={`Set text size to ${opt.label.toLowerCase()}`}
                />
              </View>
            );
          })}
        </View>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Preview scale: {Math.round(TEXT_SCALES[settings.textScale] * 100)}%
        </AppText>
      </Section>

      <ToggleRow
        label="High Contrast"
        hint="Increases colour contrast for easier reading"
        value={settings.highContrast}
        onValueChange={setHighContrast}
      />

      <ToggleRow
        label="Voice Commands"
        hint={
          voiceAvailable
            ? 'Show a microphone button to move around the app by speaking'
            : 'Voice control is not available on this device'
        }
        value={settings.voiceCommands}
        onValueChange={setVoiceCommands}
        disabled={!voiceAvailable}
      />
      {settings.voiceCommands && voiceAvailable ? (
        <View style={{ marginTop: -theme.spacing.sm }}>
          <PrimaryButton
            label="What can I say?"
            tone="neutral"
            onPress={speakHelp}
            accessibilityHint="Reads out the list of voice commands you can use"
          />
        </View>
      ) : null}

      <AppText variant="heading" weight="bold" style={{ marginTop: theme.spacing.md }}>
        Account
      </AppText>
      <Section title="Signed in as">
        <AppText variant="body">{member?.displayName ?? '—'}</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {member?.membershipNumber}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {syncEnabled
            ? '☁️ Synced to your SGO account'
            : '📱 Stored on this device'}
        </AppText>
        <View style={{ marginTop: theme.spacing.sm }}>
          <PrimaryButton
            label="Start over"
            tone="danger"
            onPress={onStartOver}
            accessibilityHint="Clears your profile and restarts onboarding"
          />
        </View>
      </Section>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.lg,
          gap: theme.spacing.md,
        },
      ]}
    >
      <AppText variant="label" weight="bold">
        {title}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { borderWidth: 1 },
  row: { flexDirection: 'row' },
});
