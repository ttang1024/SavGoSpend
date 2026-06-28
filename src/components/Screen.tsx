import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';

type ScreenProps = ViewProps & {
  scroll?: boolean;
  edges?: readonly Edge[];
};

/**
 * Standard screen container: safe-area aware, themed background, optional scroll.
 *
 * `top` is omitted by default because screens are rendered inside a navigator
 * header that already clears the status bar — adding the top inset here too
 * leaves a large gap. Header-less screens (e.g. onboarding) opt back in via
 * `edges={['top', 'left', 'right']}`.
 */
export function Screen({
  children,
  scroll = false,
  edges = ['left', 'right'],
  style,
  ...rest
}: ScreenProps) {
  const theme = useTheme();
  const Body = scroll ? ScrollView : View;

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.fill, { backgroundColor: theme.colors.background }]}
    >
      <Body
        style={scroll ? undefined : [styles.fill, style]}
        contentContainerStyle={
          scroll ? [{ padding: theme.spacing.lg, gap: theme.spacing.lg }, style] : undefined
        }
        {...rest}
      >
        {children}
      </Body>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
