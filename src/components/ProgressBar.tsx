import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type ProgressBarProps = {
  /** 0–1. */
  value: number;
  label?: string;
};

/** A rounded, accessible progress indicator for tier progression. */
export function ProgressBar({ value, label }: ProgressBarProps) {
  const theme = useTheme();
  const pct = Math.min(1, Math.max(0, value));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      style={[
        styles.track,
        { backgroundColor: theme.colors.border, borderRadius: theme.radius.pill },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${pct * 100}%`,
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.pill,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 14, width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
});
