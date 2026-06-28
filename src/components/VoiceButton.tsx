import { useSegments } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from './AppText';
import { useVoice } from '@/providers/VoiceProvider';
import { useAccessibility, useTheme } from '@/theme';

/**
 * Floating voice-command control, available app-wide once a member opts in via
 * the "Voice Commands" accessibility setting. Tap to listen, tap again to stop;
 * the pill above mirrors what was heard and the spoken confirmation so the
 * feature works for members who can't rely on audio alone.
 */
export function VoiceButton() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const { settings } = useAccessibility();
  const { available, status, transcript, message, startListening, stopListening } = useVoice();

  // Honour the opt-in, require device support, and stay out of the onboarding flow.
  if (!settings.voiceCommands || !available || segments[0] === '(onboarding)') return null;

  const listening = status === 'listening';
  const pillText = message ?? (transcript ? `“${transcript}”` : null);

  // Clear the tab bar (≈68px scaled + bottom inset) so the button never overlaps it.
  const bottom = insets.bottom + Math.round(72 * theme.textScale) + theme.spacing.sm;

  return (
    <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, styles.layer]}>
      {pillText ? (
        <View
          style={[
            styles.pill,
            {
              bottom: bottom + theme.touchTarget.min + theme.spacing.sm,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.lg,
              paddingVertical: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
            },
          ]}
          accessibilityLiveRegion="polite"
          accessible
        >
          <AppText variant="label" numberOfLines={2}>
            {pillText}
          </AppText>
        </View>
      ) : null}

      <Pressable
        onPress={listening ? stopListening : startListening}
        accessibilityRole="button"
        accessibilityLabel={listening ? 'Stop listening' : 'Voice commands'}
        accessibilityHint={
          listening
            ? 'Stops listening for a voice command'
            : 'Listens for a spoken command, such as “open my card”'
        }
        accessibilityState={{ busy: listening }}
        hitSlop={8}
        style={({ pressed }) => [
          styles.fab,
          {
            bottom,
            right: theme.spacing.lg,
            width: theme.touchTarget.min,
            height: theme.touchTarget.min,
            borderRadius: theme.radius.pill,
            backgroundColor: listening ? theme.colors.danger : theme.colors.primary,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <AppText variant="heading" color={theme.colors.primaryText}>
          {listening ? '◉' : '🎤'}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { zIndex: 50 },
  fab: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pill: {
    position: 'absolute',
    right: 16,
    left: 16,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
});
