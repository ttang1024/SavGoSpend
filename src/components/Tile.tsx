import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';

type TileProps = {
  title: string;
  subtitle?: string;
  /** Single emoji or short glyph stands in until brand iconography is bundled. */
  icon?: string;
  onPress: () => void;
  accessibilityHint?: string;
};

/**
 * Large, high-contrast home tile. One of the three primary home actions
 * (Nearby Retailers, What's On, Good to Know).
 */
export function Tile({ title, subtitle, icon, onPress, accessibilityHint }: TileProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint ?? subtitle}
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.xl,
          minHeight: theme.touchTarget.min * 2,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.row, { gap: theme.spacing.lg }]}>
        {icon ? (
          <View
            style={[
              styles.iconBubble,
              {
                backgroundColor: theme.colors.primary,
                borderRadius: theme.radius.md,
              },
            ]}
          >
            <AppText variant="title" color={theme.colors.primaryText}>
              {icon}
            </AppText>
          </View>
        ) : null}
        <View style={styles.textCol}>
          <AppText variant="heading" weight="bold">
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="label" color={theme.colors.textSecondary}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderWidth: 1,
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBubble: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1, gap: 4 },
});
