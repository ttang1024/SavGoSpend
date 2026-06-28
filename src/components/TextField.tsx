import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';

type TextFieldProps = TextInputProps & {
  label: string;
  hint?: string;
  error?: string;
};

/** Labelled, large-target text input that honours the theme and a11y settings. */
export function TextField({ label, hint, error, style, ...rest }: TextFieldProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <AppText variant="label" weight="bold">
        {label}
      </AppText>
      {hint ? (
        <AppText variant="caption" color={theme.colors.textMuted}>
          {hint}
        </AppText>
      ) : null}
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.textMuted}
        maxFontSizeMultiplier={1.6}
        style={[
          styles.input,
          {
            color: theme.colors.textPrimary,
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.danger : theme.colors.border,
            borderRadius: theme.radius.md,
            minHeight: theme.touchTarget.min,
            paddingHorizontal: theme.spacing.lg,
            fontSize: theme.fontSizes.body,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <AppText variant="caption" color={theme.colors.danger}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
  },
});
