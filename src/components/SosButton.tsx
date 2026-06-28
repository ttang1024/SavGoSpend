import { Pressable, StyleSheet } from 'react-native';

import { AppText } from './AppText';
import { confirmEmergencyCall } from '@/lib/emergency';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Emergency SOS control. Placed in the header so it is reachable from every
 * screen. For now it confirms intent then dials NZ emergency services (111).
 * A future iteration will share location and notify an emergency contact.
 */
export function SosButton() {
  const theme = useTheme();

  const onPress = () => confirmEmergencyCall();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Emergency SOS"
      accessibilityHint="Opens a prompt to call emergency services"
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.colors.danger,
          borderRadius: theme.radius.pill,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <AppText variant="caption" weight="bold" color={theme.colors.primaryText}>
        SOS
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 56,
    height: 40,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
