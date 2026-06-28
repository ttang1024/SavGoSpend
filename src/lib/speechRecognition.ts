import { requireOptionalNativeModule } from 'expo';

/**
 * Whether the native ExpoSpeechRecognition module is linked into the running
 * binary — true only in a dev/production build, false in Expo Go.
 *
 * `expo-speech-recognition` calls the throwing `requireNativeModule` at import
 * time, so we must *not* import the package to probe for it. The optional probe
 * here returns `null` instead of throwing, letting the app degrade gracefully
 * (the Voice Commands toggle disables itself) rather than red-screen on launch.
 */
export const SPEECH_RECOGNITION_AVAILABLE =
  requireOptionalNativeModule('ExpoSpeechRecognition') != null;
