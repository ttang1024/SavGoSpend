import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
// @ts-expect-error — getReactNativePersistence ships in firebase/auth but is
// omitted from the bundled web typings.
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase config is sourced from EXPO_PUBLIC_* env vars (see .env.example).
 * These web API keys are not secrets — security is enforced by Firebase
 * Security Rules and the NZ Privacy Act 2020 controls, not key obscurity.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Persist auth in AsyncStorage so the session — and the digital membership
// card — survive app restarts and remain available offline.
export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // initializeAuth throws if called twice (e.g. Fast Refresh); reuse instance.
    return getAuth(app);
  }
})();

export const db = getFirestore(app);
export { app };
