import { Alert, Linking } from 'react-native';

/**
 * Confirms intent, then dials NZ emergency services (111).
 *
 * Shared by the header {@link SosButton} and the "emergency" voice command so
 * both paths behave identically — we never auto-dial without an explicit tap.
 * `onResolve` reports the outcome so the voice flow can announce what happened.
 */
export function confirmEmergencyCall(opts?: { onResolve?: (called: boolean) => void }) {
  Alert.alert(
    'Emergency SOS',
    'Do you want to call emergency services (111)?',
    [
      { text: 'Cancel', style: 'cancel', onPress: () => opts?.onResolve?.(false) },
      {
        text: 'Call 111',
        style: 'destructive',
        onPress: () => {
          opts?.onResolve?.(true);
          Linking.openURL('tel:111').catch(() => {});
        },
      },
    ],
    { cancelable: true, onDismiss: () => opts?.onResolve?.(false) },
  );
}
