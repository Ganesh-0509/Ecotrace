// ─────────────────────────────────────────────────────────────────────
// Tracking Service (Application Layer) — Firestore reads/writes for the
// telemetry domain, plus profile persistence used by onboarding.
//
// SPARK-PLAN OPTIMISATION: every micro-action for a month lives inside a
// SINGLE document at users/{uid}/monthly_logs/{YYYY-MM}, with entries held
// in an `entries` array and `totalSaved` denormalised. Rendering a month's
// dashboard is therefore ONE document read instead of ~30, and appending a
// log is ONE write (arrayUnion + increment) — keeping us comfortably under
// the free-tier read/write/egress quotas.
// ─────────────────────────────────────────────────────────────────────
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  increment,
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { currentMonthKey } from '../../../utils/dateUtils';

const monthDocRef = (uid, monthKey) =>
  doc(db, 'users', uid, 'monthly_logs', monthKey);

/** Persists the onboarding baseline and flags the profile complete. */
export async function saveProfile(uid, profilePatch) {
  await setDoc(
    doc(db, 'users', uid),
    { ...profilePatch, profileCompleted: true },
    { merge: true }
  );
}

/** Updates editable profile fields (Profile page) without touching logs. */
export async function updateProfileFields(uid, patch) {
  await updateDoc(doc(db, 'users', uid), patch);
}

/**
 * Appends one log entry to the current month's aggregate document.
 * Creates the document on the first log of the month.
 */
export async function appendLog(uid, entry) {
  const monthKey = currentMonthKey();
  const ref = monthDocRef(uid, monthKey);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      entries: arrayUnion(entry),
      totalSaved: increment(entry.co2SavedKg),
      count: increment(1),
      updatedAt: new Date().toISOString(),
    });
  } else {
    await setDoc(ref, {
      month: monthKey,
      entries: [entry],
      totalSaved: entry.co2SavedKg,
      count: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return monthKey;
}

/** Reads a single month's aggregate document (or a safe empty default). */
export async function getMonthLog(uid, monthKey = currentMonthKey()) {
  const snap = await getDoc(monthDocRef(uid, monthKey));
  if (!snap.exists()) {
    return { month: monthKey, entries: [], totalSaved: 0, count: 0 };
  }
  return snap.data();
}
