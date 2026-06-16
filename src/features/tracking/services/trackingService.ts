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
import type { LogEntry, MonthLog, UserProfile } from '../../../domain/models';

/** Persists the onboarding baseline and flags the profile complete. */
export function saveProfile(uid: string, profilePatch: Partial<UserProfile>): Promise<void> {
  return trackingRepo.saveProfile(uid, profilePatch);
}

/** Updates editable profile fields (Profile page) without touching logs. */
export function updateProfileFields(uid: string, patch: Partial<UserProfile>): Promise<void> {
  return trackingRepo.updateProfileFields(uid, patch);
}

/** Appends one log entry to the current month's aggregate document. */
export function appendLog(uid: string, entry: LogEntry): Promise<string> {
  return trackingRepo.appendLog(uid, currentMonthKey(), entry);
}

/** Reads a single month's aggregate document (or a safe empty default). */
export function getMonthLog(uid: string, monthKey: string = currentMonthKey()): Promise<MonthLog> {
  return trackingRepo.getMonthLog(uid, monthKey);
}
