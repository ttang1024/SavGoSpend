import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { Tile } from '@/components/Tile';
import { useTheme } from '@/theme/ThemeProvider';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Screen scroll>
      <View style={{ gap: theme.spacing.xs }}>
        <AppText variant="title" weight="bold">
          Kia ora 👋
        </AppText>
        <AppText variant="label" color={theme.colors.textSecondary}>
          Welcome to SavGoSpend. Where would you like to go today?
        </AppText>
      </View>

      <Tile
        title="Nearby Retailers"
        subtitle="Find participating shops near you"
        icon="📍"
        onPress={() => router.push('/retailers')}
        accessibilityHint="Opens a map of nearby participating retailers"
      />
      <Tile
        title="What's On"
        subtitle="Local events and travel happenings"
        icon="📅"
        onPress={() => router.push('/whats-on')}
        accessibilityHint="Opens a list of local events"
      />
      <Tile
        title="Good to Know"
        subtitle="Helpful local travel information"
        icon="💡"
        onPress={() => router.push('/good-to-know')}
        accessibilityHint="Opens helpful local information articles"
      />
    </Screen>
  );
}
