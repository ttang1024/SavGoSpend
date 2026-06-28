import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Barcode } from '@/components/Barcode';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { tierProgress } from '@/lib/rewards';
import { useMember } from '@/providers/MemberProvider';
import { palette } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';

function formatJoined(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
}

/** Render the membership number with wide letter spacing, like the digits
 *  printed beneath a real barcode. */
function formatBarcodeText(value: string): string {
  return value.split('').join(' ');
}

export default function CardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { member } = useMember();

  // The onboarding guard guarantees a member exists once inside the tabs.
  if (!member) return null;

  const { next, progress, pointsToNext } = tierProgress(member.lifetimePoints);

  return (
    <Screen scroll>
      <View
        accessible
        accessibilityLabel={`SavGoSpend membership card for ${member.displayName}. Membership number ${member.membershipNumber}. ${member.tier} tier.`}
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.xl,
            padding: theme.spacing.xl,
            gap: theme.spacing.lg,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <AppText variant="heading" weight="bold" color={theme.colors.primaryText}>
            SavGoSpend
          </AppText>
          <View
            style={[
              styles.tierChip,
              { borderColor: theme.colors.accent, borderRadius: theme.radius.pill },
            ]}
          >
            <AppText variant="caption" weight="bold" color={theme.colors.accent}>
              {member.tier}
            </AppText>
          </View>
        </View>

        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="caption" color={theme.colors.primaryText}>
            Member
          </AppText>
          <AppText variant="title" weight="bold" color={theme.colors.primaryText}>
            {member.displayName}
          </AppText>
        </View>

        {/* Scan panel — the focal point. White so retail scanners read the bars. */}
        <View
          style={[
            styles.scanPanel,
            {
              backgroundColor: palette.white,
              borderRadius: theme.radius.lg,
              paddingVertical: theme.spacing.lg,
              paddingHorizontal: theme.spacing.lg,
              gap: theme.spacing.sm,
            },
          ]}
        >
          <Barcode value={member.membershipNumber} color={palette.ink} />
          <AppText
            variant="label"
            weight="bold"
            color={palette.ink}
            center
            style={styles.barcodeText}
          >
            {formatBarcodeText(member.membershipNumber)}
          </AppText>
        </View>

        <View style={styles.cardFooter}>
          <AppText variant="caption" color={theme.colors.primaryText}>
            Scan at checkout to earn & redeem
          </AppText>
          <AppText variant="caption" color={theme.colors.primaryText}>
            Never expires
          </AppText>
        </View>
      </View>

      <Pressable
        onPress={() => router.push('/rewards')}
        accessibilityRole="button"
        accessibilityLabel="View your Smart Rewards"
        accessibilityHint="Opens points, tiers, and recent activity"
        style={({ pressed }) => [
          styles.points,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.xl,
            gap: theme.spacing.sm,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <View style={styles.pointsHeader}>
          <AppText variant="label" color={theme.colors.textSecondary}>
            Smart Rewards points
          </AppText>
          <AppText variant="label" weight="bold" color={theme.colors.primary}>
            View ›
          </AppText>
        </View>
        <AppText variant="display" weight="bold" color={theme.colors.primary}>
          {member.points}
        </AppText>
        <ProgressBar
          value={progress}
          label={next ? `Progress to ${next.tier}` : 'Top tier reached'}
        />
        <AppText variant="caption" color={theme.colors.textMuted}>
          {next ? `${pointsToNext} points to ${next.tier}` : 'You’ve reached the highest tier.'}
        </AppText>
      </Pressable>

      <AppText variant="caption" color={theme.colors.textMuted} center>
        Member since {formatJoined(member.joinedAt)} · always available, even offline.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tierChip: { borderWidth: 1.5, paddingVertical: 4, paddingHorizontal: 12 },
  scanPanel: { alignItems: 'center', overflow: 'hidden' },
  barcodeText: { letterSpacing: 2 },
  points: { borderWidth: 1 },
  pointsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
