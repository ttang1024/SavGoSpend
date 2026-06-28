import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { TierBadge } from '@/components/TierBadge';
import { TIERS, tierIndex, tierProgress } from '@/lib/rewards';
import { useMember } from '@/providers/MemberProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { PointsActivity } from '@/types';

export default function RewardsScreen() {
  const theme = useTheme();
  const { member } = useMember();
  if (!member) return null;

  const { current, next, progress, pointsToNext } = tierProgress(member.points);
  const currentIndex = tierIndex(current.tier);

  return (
    <Screen scroll>
      {/* Points + current tier */}
      <View
        style={[
          styles.hero,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.xl,
            gap: theme.spacing.sm,
          },
        ]}
      >
        <AppText variant="label" color={theme.colors.textSecondary}>
          Your Smart Rewards
        </AppText>
        <AppText variant="display" weight="bold" color={theme.colors.primary}>
          {member.points} pts
        </AppText>
        <TierBadge tier={current.tier} />

        <View style={{ gap: theme.spacing.xs, marginTop: theme.spacing.sm }}>
          <ProgressBar
            value={progress}
            label={next ? `Progress to ${next.tier}` : 'Top tier reached'}
          />
          <AppText variant="caption" color={theme.colors.textMuted}>
            {next
              ? `${pointsToNext} point${pointsToNext === 1 ? '' : 's'} to ${next.tier}`
              : 'You’ve reached the highest tier — ka pai!'}
          </AppText>
        </View>
      </View>

      {/* Tier ladder */}
      <AppText variant="heading" weight="bold">
        Membership tiers
      </AppText>
      <View style={{ gap: theme.spacing.sm }}>
        {TIERS.map((t, i) => {
          const reached = i <= currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <View
              key={t.tier}
              style={[
                styles.tierRow,
                {
                  backgroundColor: isCurrent ? theme.colors.primary : theme.colors.surface,
                  borderColor: isCurrent ? theme.colors.primary : theme.colors.border,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing.lg,
                  gap: theme.spacing.md,
                  opacity: reached || isCurrent ? 1 : 0.7,
                },
              ]}
            >
              <AppText variant="title">{reached ? t.icon : '🔒'}</AppText>
              <View style={{ flex: 1, gap: 2 }}>
                <AppText
                  variant="label"
                  weight="bold"
                  color={isCurrent ? theme.colors.primaryText : theme.colors.textPrimary}
                >
                  {t.tier}
                </AppText>
                <AppText
                  variant="caption"
                  color={isCurrent ? theme.colors.primaryText : theme.colors.textMuted}
                >
                  {t.minPoints === 0 ? 'Starting tier' : `${t.minPoints} points`} · {t.blurb}
                </AppText>
              </View>
              {isCurrent ? (
                <AppText variant="caption" weight="bold" color={theme.colors.primaryText}>
                  YOU
                </AppText>
              ) : null}
            </View>
          );
        })}
      </View>

      {/* Recent activity */}
      <AppText variant="heading" weight="bold">
        Recent activity
      </AppText>
      {member.pointsHistory.length === 0 ? (
        <AppText variant="body" color={theme.colors.textSecondary}>
          No points yet. Check in at a participating retailer to start earning.
        </AppText>
      ) : (
        <View style={{ gap: theme.spacing.sm }}>
          {member.pointsHistory.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </View>
      )}
    </Screen>
  );
}

function ActivityRow({ activity }: { activity: PointsActivity }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.activity,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: theme.spacing.lg,
        },
      ]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="label" weight="bold">
          {activity.reason}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {new Date(activity.createdAt).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </AppText>
      </View>
      <AppText variant="label" weight="bold" color={theme.colors.primary}>
        +{activity.points}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderWidth: 1 },
  tierRow: { borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  activity: { borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
});
