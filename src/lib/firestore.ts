/**
 * Firestore access for the member profile. The document id is the member's
 * Firebase Auth uid, so security rules can scope access to the owner only
 * (see firestore.rules) — a core NZ Privacy Act 2020 control.
 *
 * Callers must only invoke these when `isFirebaseConfigured` is true.
 *
 * NOTE: The Firebase JS SDK has no Firestore offline persistence on React
 * Native, so AsyncStorage (in MemberProvider) is the offline cache and
 * Firestore is the cloud mirror.
 */
import { deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';

import { db } from './firebase';
import { MemberProfile } from '@/types';

const COLLECTION = 'members';

export function memberDocRef(uid: string) {
  return doc(db, COLLECTION, uid);
}

/** Live-subscribe to a member document. Returns an unsubscribe fn. */
export function subscribeMemberDoc(
  uid: string,
  onData: (member: MemberProfile | null) => void,
  onError?: (error: unknown) => void,
): () => void {
  return onSnapshot(
    memberDocRef(uid),
    (snap) => onData(snap.exists() ? (snap.data() as MemberProfile) : null),
    (error) => onError?.(error),
  );
}

export async function saveMemberDoc(member: MemberProfile): Promise<void> {
  await setDoc(memberDocRef(member.id), member, { merge: true });
}

export async function deleteMemberDoc(uid: string): Promise<void> {
  await deleteDoc(memberDocRef(uid));
}
