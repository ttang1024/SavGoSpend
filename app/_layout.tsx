import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SosButton } from '@/components/SosButton';
import { VoiceButton } from '@/components/VoiceButton';
import { MemberProvider, useMember } from '@/providers/MemberProvider';
import { VoiceProvider } from '@/providers/VoiceProvider';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

// Keep the native splash visible until we know whether the member is onboarded,
// so they never see a flash of the wrong screen.
SplashScreen.preventAutoHideAsync().catch(() => {});

/** Redirects between the onboarding flow and the main app based on member status. */
function useOnboardingGuard(ready: boolean, onboarded: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const inOnboarding = segments[0] === '(onboarding)';
    if (!onboarded && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    } else if (onboarded && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [ready, onboarded, segments, router]);
}

function RootNavigator() {
  const theme = useTheme();
  const { ready, onboarded } = useMember();

  useOnboardingGuard(ready, onboarded);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.primaryText,
          headerTitleStyle: { fontWeight: '700', fontSize: Math.round(18 * theme.textScale) },
          contentStyle: { backgroundColor: theme.colors.background },
          // Show only the back chevron, never the previous screen's route name
          // (e.g. "(tabs)") as the back-button label.
          headerBackButtonDisplayMode: 'minimal',
          headerRight: () => <SosButton />,
        }}
      >
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="rewards" options={{ title: 'Smart Rewards' }} />
        <Stack.Screen name="retailers" options={{ title: 'Nearby Retailers' }} />
        <Stack.Screen name="whats-on" options={{ title: "What's On" }} />
        <Stack.Screen name="good-to-know" options={{ title: 'Good to Know' }} />
      </Stack>
      {/* App-wide voice overlay; renders itself only when the member opts in. */}
      <VoiceButton />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MemberProvider>
          <VoiceProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </VoiceProvider>
        </MemberProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
