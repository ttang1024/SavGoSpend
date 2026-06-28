import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { SAMPLE_EVENTS } from '@/constants/sampleData';
import { formatEventWhen, relativeDay, upcomingEvents } from '@/lib/events';
import { useTheme } from '@/theme/ThemeProvider';

export default function WhatsOnScreen() {
  const theme = useTheme();
  const events = upcomingEvents(SAMPLE_EVENTS);

  return (
    <Screen scroll>
      <AppText variant="label" color={theme.colors.textSecondary}>
        Events and happenings near you.
      </AppText>

      {events.length === 0 ? (
        <AppText variant="body" color={theme.colors.textSecondary}>
          No upcoming events right now. Check back soon.
        </AppText>
      ) : (
        events.map((event) => {
          const soon = relativeDay(event.startsAt);
          return (
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
              {soon ? (
                <AppText variant="caption" weight="bold" color={theme.colors.accent}>
                  {soon.toUpperCase()}
                </AppText>
              ) : null}
              <AppText variant="heading" weight="bold">
                {event.title}
              </AppText>
              <AppText variant="caption" weight="bold" color={theme.colors.primary}>
                {formatEventWhen(event.startsAt)}
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
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1 },
});
