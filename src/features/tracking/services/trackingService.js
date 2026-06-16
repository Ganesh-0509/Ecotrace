// ─────────────────────────────────────────────────────────────────────
// Tracking Service (Application Layer) — the tracking domain's use-cases.
// ─────────────────────────────────────────────────────────────────────
// Thin orchestration over the tracking repository: it resolves the current
// month key and delegates persistence to whichever backend is wired in
// (Firestore in production, in-memory in tests). The UI imports these
// functions and stays unaware of Firestore entirely — dependencies point at
// the repository interface, not at a concrete database.
// ─────────────────────────────────────────────────────────────────────
import { currentMonthKey } from '../../../utils/dateUtils';
import { trackingRepo } from '../repository';

/** Persists the onboarding baseline and flags the profile complete. */
export function saveProfile(uid, profilePatch) {
  return trackingRepo.saveProfile(uid, profilePatch);
}

/** Updates editable profile fields (Profile page) without touching logs. */
export function updateProfileFields(uid, patch) {
  return trackingRepo.updateProfileFields(uid, patch);
}

/** Appends one log entry to the current month's aggregate document. */
export function appendLog(uid, entry) {
  return trackingRepo.appendLog(uid, currentMonthKey(), entry);
}

/** Reads a single month's aggregate document (or a safe empty default). */
export function getMonthLog(uid, monthKey = currentMonthKey()) {
  return trackingRepo.getMonthLog(uid, monthKey);
}
