import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';

type Tone = 'primary' | 'danger' | 'neutral';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  tone?: Tone;
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
};

/** Full-width, large touch-target button used for primary screen actions. */
export function PrimaryButton({
  label,
  onPress,
  tone = 'primary',
  disabled,
  loading,
  accessibilityHint,
}: PrimaryButtonProps) {
  const theme = useTheme();
  const bg =
    tone === 'danger'
      ? theme.colors.danger
      : tone === 'neutral'
        ? theme.colors.surface
        : theme.colors.primary;
  const fg = tone === 'neutral' ? theme.colors.textPrimary : theme.colors.primaryText;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          borderRadius: theme.radius.md,
          minHeight: theme.touchTarget.min,
          paddingHorizontal: theme.spacing.xl,
          borderWidth: tone === 'neutral' ? 1 : 0,
          borderColor: theme.colors.border,
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <AppText variant="label" weight="bold" color={fg}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
