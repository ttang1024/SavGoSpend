import { Alert, Platform, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { SAMPLE_RETAILERS } from '@/constants/sampleData';
import { useMember } from '@/providers/MemberProvider';
import { tierInfo } from '@/lib/rewards';
import { useTheme } from '@/theme/ThemeProvider';
import { PointsActivity, Retailer } from '@/types';

/** A retailer check-in is allowed once per calendar day. */
function checkedInToday(history: PointsActivity[], retailerId: string): boolean {
  const today = new Date().toDateString();
  return history.some(
    (a) => a.retailerId === retailerId && new Date(a.createdAt).toDateString() === today,
  );
}

// react-native-maps has no real web implementation; only load it on native so
// web bundling/preview keeps working. The list below is the universal fallback.
let MapView: typeof import('react-native-maps').default | null = null;
let Marker: typeof import('react-native-maps').Marker | null = null;
if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
}

const INITIAL_REGION = {
  latitude: -37.787,
  longitude: 175.283,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export default function RetailersScreen() {
  const theme = useTheme();

  return (
    <Screen scroll>
      {MapView && Marker ? (
        <View style={[styles.mapWrap, { borderRadius: theme.radius.lg }]}>
          <MapView style={styles.map} initialRegion={INITIAL_REGION}>
            {SAMPLE_RETAILERS.map((r) => (
              <Marker
                key={r.id}
                coordinate={{ latitude: r.latitude, longitude: r.longitude }}
                title={r.name}
                description={r.category}
              />
            ))}
          </MapView>
        </View>
      ) : (
        <View
          style={[
            styles.mapFallback,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius.lg },
          ]}
        >
          <AppText variant="label" color={theme.colors.textMuted} center>
            🗺️ The interactive map is available in the iOS and Android app.
          </AppText>
        </View>
      )}

      <AppText variant="heading" weight="bold">
        Participating retailers
      </AppText>

      {SAMPLE_RETAILERS.map((retailer) => (
        <RetailerCard key={retailer.id} retailer={retailer} />
      ))}
    </Screen>
  );
}

function RetailerCard({ retailer }: { retailer: Retailer }) {
  const theme = useTheme();
  const { member, awardPoints } = useMember();

  const points = retailer.pointsPerVisit ?? 0;
  const alreadyToday = member ? checkedInToday(member.pointsHistory, retailer.id) : false;

  const onCheckIn = async () => {
    if (alreadyToday) {
      Alert.alert('Already checked in', `You’ve already checked in at ${retailer.name} today.`);
      return;
    }
    const result = await awardPoints({
      points,
      reason: `Visited ${retailer.name}`,
      retailerId: retailer.id,
    });
    if (!result.awarded) return;
    if (result.tierChanged) {
      const info = tierInfo(result.newTier);
      Alert.alert(
        `${info.icon} You reached ${info.tier}!`,
        `You earned ${points} points and moved up a tier. ${info.blurb}`,
      );
    } else {
      Alert.alert('Points earned', `You earned ${points} points at ${retailer.name}.`);
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: theme.spacing.lg,
          gap: theme.spacing.sm,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <AppText variant="label" weight="bold">
          {retailer.name}
        </AppText>
        {points > 0 ? (
          <AppText variant="caption" weight="bold" color={theme.colors.accent}>
            +{points} pts
          </AppText>
        ) : null}
      </View>
      <AppText variant="caption" color={theme.colors.textMuted}>
        {retailer.category} · {retailer.address}
      </AppText>
      {retailer.description ? (
        <AppText variant="body" color={theme.colors.textSecondary}>
          {retailer.description}
        </AppText>
      ) : null}
      {points > 0 ? (
        <PrimaryButton
          label={alreadyToday ? 'Checked in today ✓' : `Check in · +${points} pts`}
          tone={alreadyToday ? 'neutral' : 'primary'}
          disabled={alreadyToday}
          onPress={onCheckIn}
          accessibilityHint={`Earn ${points} Smart Rewards points for visiting ${retailer.name}`}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: { height: 240, overflow: 'hidden' },
  map: { flex: 1 },
  mapFallback: { height: 140, borderWidth: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
