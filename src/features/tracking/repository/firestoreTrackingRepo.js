// ─────────────────────────────────────────────────────────────────────
// Firestore Tracking Repository — the production implementation.
// ─────────────────────────────────────────────────────────────────────
// SPARK-PLAN OPTIMISATION: every micro-action for a month lives inside ONE
// document at users/{uid}/monthly_logs/{YYYY-MM}, with entries held in an
// `entries` array and `totalSaved` denormalised. Rendering a month is one
// document read; appending a log is one write (arrayUnion + increment) —
// keeping the app comfortably under the free-tier read/write/egress quotas.
//
// Implements the same shape as the in-memory repository so the two are
// interchangeable behind the service layer.
// ─────────────────────────────────────────────────────────────────────
import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const monthDocRef = (uid, monthKey) => doc(db, 'users', uid, 'monthly_logs', monthKey);
const emptyMonth = (monthKey) => ({ month: monthKey, entries: [], totalSaved: 0, count: 0 });

export const firestoreTrackingRepo = {
  async saveProfile(uid, patch) {
    await setDoc(doc(db, 'users', uid), { ...patch, profileCompleted: true }, { merge: true });
  },

  async updateProfileFields(uid, patch) {
    await updateDoc(doc(db, 'users', uid), patch);
  },

  async getProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  },

  async getMonthLog(uid, monthKey) {
    const snap = await getDoc(monthDocRef(uid, monthKey));
    return snap.exists() ? snap.data() : emptyMonth(monthKey);
  },

  async appendLog(uid, monthKey, entry) {
    const ref = monthDocRef(uid, monthKey);
    const snap = await getDoc(ref);
    const now = new Date().toISOString();

    if (snap.exists()) {
      await updateDoc(ref, {
        entries: arrayUnion(entry),
        totalSaved: increment(entry.co2SavedKg),
        count: increment(1),
        updatedAt: now,
      });
    } else {
      await setDoc(ref, {
        month: monthKey,
        entries: [entry],
        totalSaved: entry.co2SavedKg,
        count: 1,
        createdAt: now,
        updatedAt: now,
      });
    }
    return monthKey;
  },
};
