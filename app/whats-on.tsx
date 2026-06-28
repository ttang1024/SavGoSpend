import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { SAMPLE_EVENTS } from '@/constants/sampleData';
import { useTheme } from '@/theme/ThemeProvider';

function formatWhen(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function WhatsOnScreen() {
  const theme = useTheme();
  return (
    <Screen scroll>
      <AppText variant="label" color={theme.colors.textSecondary}>
        Events and happenings near you.
      </AppText>
      {SAMPLE_EVENTS.map((event) => (
        <View
          key={event.id}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing.lg,
              gap: theme.spacing.xs,
            },
          ]}
        >
          <AppText variant="heading" weight="bold">
            {event.title}
          </AppText>
          <AppText variant="caption" weight="bold" color={theme.colors.primary}>
            {formatWhen(event.startsAt)}
          </AppText>
          {event.location ? (
            <AppText variant="caption" color={theme.colors.textMuted}>
              {event.location}
            </AppText>
          ) : null}
          <AppText variant="body" color={theme.colors.textSecondary}>
            {event.summary}
          </AppText>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1 },
});
