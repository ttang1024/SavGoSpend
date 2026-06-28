import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { SAMPLE_ARTICLES } from '@/constants/sampleData';
import { useTheme } from '@/theme/ThemeProvider';

export default function GoodToKnowScreen() {
  const theme = useTheme();
  return (
    <Screen scroll>
      <AppText variant="label" color={theme.colors.textSecondary}>
        Helpful information for travelling with confidence.
      </AppText>
      {SAMPLE_ARTICLES.map((article) => (
        <View
          key={article.id}
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
          <AppText variant="caption" weight="bold" color={theme.colors.accent}>
            {article.category.toUpperCase()}
          </AppText>
          <AppText variant="heading" weight="bold">
            {article.title}
          </AppText>
          <AppText variant="body" color={theme.colors.textSecondary}>
            {article.body}
          </AppText>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1 },
});
