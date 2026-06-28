/**
 * Thin wrapper over Firebase Auth. SGO uses anonymous authentication so members
 * 65+ aren't burdened with passwords up front; the anonymous uid keys their
 * Firestore profile and can later be upgraded to email/password if desired.
 *
 * Callers must only invoke these when `isFirebaseConfigured` is true.
 */
import { onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';

import { auth } from './firebase';

/** Subscribe to the signed-in uid (null when signed out). Returns an unsubscribe fn. */
export function observeUid(callback: (uid: string | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => callback(user?.uid ?? null));
}

/** Ensures there is a session, creating an anonymous one if needed. Returns the uid. */
export async function ensureSignedIn(): Promise<string> {
  if (auth.currentUser) return auth.currentUser.uid;
  const cred = await signInAnonymously(auth);
  return cred.user.uid;
}

export async function endSession(): Promise<void> {
  await signOut(auth);
}
