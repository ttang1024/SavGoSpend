import { Tabs } from 'expo-router';
import { ColorValue, Text } from 'react-native';

import { SosButton } from '@/components/SosButton';
import { useTheme } from '@/theme/ThemeProvider';

/** Emoji tab icons stand in until brand iconography from the Visual Identity Guide is bundled. */
function TabIcon({ glyph, color }: { glyph: string; color: ColorValue }) {
  return <Text style={{ fontSize: 24, color }}>{glyph}</Text>;
}

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.primaryText,
        headerTitleStyle: { fontWeight: '700', fontSize: Math.round(18 * theme.textScale) },
        headerRight: () => <SosButton />,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          // Grow the bar with the text scale so larger labels aren't clipped.
          height: Math.round(68 * theme.textScale),
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: Math.round(13 * theme.textScale), fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon glyph="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          title: 'Card',
          tabBarIcon: ({ color }) => <TabIcon glyph="🪪" color={color} />,
        }}
      />
      <Tabs.Screen
        name="aroha"
        options={{
          title: 'Aroha',
          tabBarIcon: ({ color }) => <TabIcon glyph="💬" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon glyph="⚙️" color={color} />,
        }}
      />
    </Tabs>
  );
}
