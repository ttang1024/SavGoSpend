import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';

type ToggleRowProps = {
  label: string;
  hint?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

/** A labelled switch row with an explanation. Shared by Settings and onboarding opt-ins. */
export function ToggleRow({ label, hint, value, onValueChange, disabled }: ToggleRowProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.lg,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View style={{ flex: 1, gap: 2, paddingRight: theme.spacing.md }}>
        <AppText variant="label" weight="bold">
          {label}
        </AppText>
        {hint ? (
          <AppText variant="caption" color={theme.colors.textMuted}>
            {hint}
          </AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={label}
        accessibilityState={{ disabled: !!disabled }}
        trackColor={{ true: theme.colors.primary }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
