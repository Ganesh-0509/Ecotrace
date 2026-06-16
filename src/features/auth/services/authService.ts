// ─────────────────────────────────────────────────────────────────────
// Auth Service (Application Layer) — wraps Firebase Auth + the user's
// profile document. The UI never imports Firebase directly; it goes
// through these functions, keeping the presentation layer framework-clean.
// ─────────────────────────────────────────────────────────────────────
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { createUserProfile, type UserProfile } from '../../../domain/models';

/** Maps Firebase error codes to friendly, user-facing messages. */
const ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'That email is already registered. Try signing in.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'No account found for that email.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and retry.',
};

export function friendlyAuthError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  return (code && ERROR_MESSAGES[code]) || 'Something went wrong. Please try again.';
}

/** Registers a new user and seeds an (incomplete) profile document. */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(user, { displayName });
  }
  // Seed the doc WITHOUT `profileCompleted`. This write can land after the
  // onboarding write (auth-state re-fires re-read the doc), and because writes
  // merge with last-value-wins, including `profileCompleted: false` here would
  // reset the flag onboarding set to true — stranding the user on /onboarding.
  // Omitting it means an absent flag (read as "not completed") until onboarding
  // sets it true, and a late seed write can never clobber that true.
  const { profileCompleted, ...seed } = createUserProfile({ displayName });
  void profileCompleted;
  await setDoc(doc(db, 'users', user.uid), seed, { merge: true });
  return user;
}

/** Signs an existing user in. */
export async function loginWithEmail(email: string, password: string): Promise<User> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

/** Signs the current user out. */
export function logout(): Promise<void> {
  return signOut(auth);
}

/** Subscribes to auth-state changes. Returns an unsubscribe fn. */
export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/** Fetches the Firestore profile document for a uid (or null). */
export async function fetchProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}
