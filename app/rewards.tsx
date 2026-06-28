import { Alert, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { TierBadge } from '@/components/TierBadge';
import { SAMPLE_REWARDS } from '@/constants/sampleData';
import { TIERS, tierIndex, tierProgress } from '@/lib/rewards';
import { useMember } from '@/providers/MemberProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { PointsActivity, RedeemableReward } from '@/types';

export default function RewardsScreen() {
  const theme = useTheme();
  const { member, redeemPoints } = useMember();
  if (!member) return null;

  // Tier progress is driven by lifetime points; the big number is the
  // spendable balance the member can redeem right now.
  const { current, next, progress, pointsToNext } = tierProgress(member.lifetimePoints);
  const currentIndex = tierIndex(current.tier);

  const onRedeem = (reward: RedeemableReward) => {
    if (member.points < reward.cost) {
      const short = reward.cost - member.points;
      Alert.alert(
        'Not enough points yet',
        `You need ${short} more point${short === 1 ? '' : 's'} for ${reward.title}.`,
      );
      return;
    }
    Alert.alert('Redeem reward?', `Use ${reward.cost} points for ${reward.title}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: `Redeem ${reward.cost} pts`,
        onPress: async () => {
          const result = await redeemPoints({
            cost: reward.cost,
            reason: `Redeemed: ${reward.title}`,
          });
          if (result.redeemed) {
            Alert.alert(
              '🎉 Redeemed!',
              `${reward.title}. Show this to staff with your membership card. You have ${result.balance} points left.`,
            );
          } else if (result.insufficient) {
            Alert.alert('Not enough points yet', `You need more points for ${reward.title}.`);
          }
        },
      },
    ]);
  };

  return (
    <Screen scroll>
      {/* Spendable balance + current tier */}
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
          Points to spend
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

      {/* Redeem */}
      <AppText variant="heading" weight="bold">
        Redeem your points
      </AppText>
      <View style={{ gap: theme.spacing.sm }}>
        {SAMPLE_REWARDS.map((reward) => {
          const affordable = member.points >= reward.cost;
          return (
            <View
              key={reward.id}
              style={[
                styles.reward,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing.lg,
                  gap: theme.spacing.sm,
                },
              ]}
            >
              <View style={styles.rewardHeader}>
                <AppText variant="label" weight="bold" style={styles.rewardTitle}>
                  {reward.icon ? `${reward.icon} ` : ''}
                  {reward.title}
                </AppText>
                <AppText variant="caption" weight="bold" color={theme.colors.accent}>
                  {reward.cost} pts
                </AppText>
              </View>
              {reward.description ? (
                <AppText variant="caption" color={theme.colors.textMuted}>
                  {reward.description}
                </AppText>
              ) : null}
              <PrimaryButton
                label={
                  affordable
                    ? `Redeem · ${reward.cost} pts`
                    : `Need ${reward.cost - member.points} more`
                }
                tone={affordable ? 'primary' : 'neutral'}
                disabled={!affordable}
                onPress={() => onRedeem(reward)}
                accessibilityHint={`Spend ${reward.cost} points on ${reward.title}`}
              />
            </View>
          );
        })}
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
  const earned = activity.points >= 0;
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
      <AppText
        variant="label"
        weight="bold"
        color={earned ? theme.colors.primary : theme.colors.textSecondary}
      >
        {earned ? `+${activity.points}` : `−${Math.abs(activity.points)}`}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderWidth: 1 },
  reward: { borderWidth: 1 },
  rewardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  rewardTitle: { flex: 1 },
  tierRow: { borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  activity: { borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
});
