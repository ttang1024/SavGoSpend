import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { useTheme } from '@/theme/ThemeProvider';
import { tierInfo } from '@/lib/rewards';
import { MembershipTier } from '@/types';

type TierBadgeProps = {
  tier: MembershipTier;
  /** 'solid' for the active tier, 'soft' for inline use on coloured surfaces. */
  variant?: 'solid' | 'soft';
};

/** A pill showing a tier's icon and name. */
export function TierBadge({ tier, variant = 'solid' }: TierBadgeProps) {
  const theme = useTheme();
  const info = tierInfo(tier);
  const solid = variant === 'solid';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: solid ? theme.colors.primary : 'transparent',
          borderColor: theme.colors.primary,
          borderWidth: solid ? 0 : 1,
          borderRadius: theme.radius.pill,
        },
      ]}
    >
      <AppText variant="label">{info.icon}</AppText>
      <AppText
        variant="label"
        weight="bold"
        color={solid ? theme.colors.primaryText : theme.colors.textPrimary}
      >
        {info.tier}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
});
