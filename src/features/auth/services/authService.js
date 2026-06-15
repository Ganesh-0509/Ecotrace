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
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { createUserProfile } from '../../../domain/models';

/** Maps Firebase error codes to friendly, user-facing messages. */
const ERROR_MESSAGES = {
  'auth/email-already-in-use': 'That email is already registered. Try signing in.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'No account found for that email.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and retry.',
};

export function friendlyAuthError(error) {
  return ERROR_MESSAGES[error?.code] || 'Something went wrong. Please try again.';
}

/** Registers a new user and seeds an (incomplete) profile document. */
export async function registerWithEmail(email, password, displayName) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(user, { displayName });
  }
  const profile = createUserProfile({ displayName });
  await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
  return user;
}

/** Signs an existing user in. */
export async function loginWithEmail(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

/** Signs the current user out. */
export function logout() {
  return signOut(auth);
}

/** Subscribes to auth-state changes. Returns an unsubscribe fn. */
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

/** Fetches the Firestore profile document for a uid (or null). */
export async function fetchProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}
