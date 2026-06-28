import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';

export type ChoiceOption<T extends string> = {
  value: T;
  label: string;
  icon?: string;
};

type SegmentedChoiceProps<T extends string> = {
  label?: string;
  options: ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
};

/** Large, equal-width segmented selector. Used for single-choice fields like home country. */
export function SegmentedChoice<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedChoiceProps<T>) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      {label ? (
        <AppText variant="label" weight="bold">
          {label}
        </AppText>
      ) : null}
      <View style={[styles.row, { gap: theme.spacing.sm }]}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={opt.label}
              style={[
                styles.segment,
                {
                  backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                  borderColor: active ? theme.colors.primary : theme.colors.border,
                  borderRadius: theme.radius.md,
                  minHeight: theme.touchTarget.min,
                  gap: theme.spacing.sm,
                },
              ]}
            >
              {opt.icon ? <AppText variant="heading">{opt.icon}</AppText> : null}
              <AppText
                variant="label"
                weight="bold"
                color={active ? theme.colors.primaryText : theme.colors.textPrimary}
              >
                {opt.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
  },
});
