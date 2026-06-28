import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { AROHA } from '@/constants/aroha';
import { useTheme } from '@/theme/ThemeProvider';

const SEEN_KEY = 'sgo.aroha.pronunciationSeen.v1';

export default function ArohaScreen() {
  const theme = useTheme();
  const [showPronunciation, setShowPronunciation] = useState(false);

  // Show the pronunciation guide only on the first encounter.
  useEffect(() => {
    AsyncStorage.getItem(SEEN_KEY)
      .then((seen) => setShowPronunciation(!seen))
      .catch(() => setShowPronunciation(true));
  }, []);

  const dismissPronunciation = () => {
    setShowPronunciation(false);
    AsyncStorage.setItem(SEEN_KEY, '1').catch(() => {});
  };

  return (
    <Screen scroll>
      {showPronunciation ? (
        <View
          style={[
            styles.guide,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.accent,
              borderRadius: theme.radius.lg,
              padding: theme.spacing.xl,
              gap: theme.spacing.sm,
            },
          ]}
        >
          <AppText variant="caption" weight="bold" color={theme.colors.accent}>
            MEET AROHA
          </AppText>
          <AppText variant="heading" weight="bold">
            {AROHA.name} · “{AROHA.pronunciation.phonetic}”
          </AppText>
          <AppText variant="label" color={theme.colors.textSecondary}>
            {AROHA.pronunciation.meaning}
          </AppText>
          <View style={{ marginTop: theme.spacing.sm }}>
            <PrimaryButton label="Kia ora, Aroha" onPress={dismissPronunciation} />
          </View>
        </View>
      ) : null}

      <View
        style={[
          styles.bubble,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.xl,
          },
        ]}
      >
        <AppText variant="body">{AROHA.greeting}</AppText>
      </View>

      <AppText variant="label" weight="bold">
        I can help with…
      </AppText>

      {AROHA.quickHelp.map((item) => (
        <View
          key={item.id}
          style={[
            styles.help,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              gap: theme.spacing.xs,
            },
          ]}
        >
          <AppText variant="label" weight="bold">
            {item.question}
          </AppText>
          <AppText variant="body" color={theme.colors.textSecondary}>
            {item.answer}
          </AppText>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  guide: { borderWidth: 2 },
  bubble: { borderWidth: 1 },
  help: { borderWidth: 1 },
});
