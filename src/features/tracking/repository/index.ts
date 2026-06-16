// ─────────────────────────────────────────────────────────────────────
// Tracking repository selection (Dependency Inversion).
// ─────────────────────────────────────────────────────────────────────
// The service layer imports `trackingRepo` from here and never knows which
// backend it is talking to. Production wires in Firestore; tests construct
// an in-memory repo via `createMemoryTrackingRepo`. To add a new backend
// (e.g. REST, IndexedDB) you implement the `TrackingRepo` interface and swap
// it here — nothing above this module changes.
// ─────────────────────────────────────────────────────────────────────
import type { LogEntry, MonthLog, UserProfile } from '../../../domain/models';
import { firestoreTrackingRepo } from './firestoreTrackingRepo';

/** The persistence contract every tracking backend implements. */
export interface TrackingRepo {
  saveProfile(uid: string, patch: Partial<UserProfile>): Promise<void>;
  updateProfileFields(uid: string, patch: Partial<UserProfile>): Promise<void>;
  getProfile(uid: string): Promise<UserProfile | null>;
  getMonthLog(uid: string, monthKey: string): Promise<MonthLog>;
  appendLog(uid: string, monthKey: string, entry: LogEntry): Promise<string>;
}

export { createMemoryTrackingRepo } from './memoryTrackingRepo';

export const trackingRepo: TrackingRepo = firestoreTrackingRepo;
