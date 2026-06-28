import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type StepProgressProps = {
  total: number;
  current: number; // 1-based
};

/** Dots showing progress through the onboarding flow. */
export function StepProgress({ total, current }: StepProgressProps) {
  const theme = useTheme();
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${current} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const active = i < current;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: i === current - 1 ? 28 : 10,
                backgroundColor: active ? theme.colors.primary : theme.colors.border,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { height: 10, borderRadius: 999 },
});
