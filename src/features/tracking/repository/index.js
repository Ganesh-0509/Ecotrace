// ─────────────────────────────────────────────────────────────────────
// Tracking repository selection (Dependency Inversion).
// ─────────────────────────────────────────────────────────────────────
// The service layer imports `trackingRepo` from here and never knows which
// backend it is talking to. Production wires in Firestore; tests construct
// an in-memory repo via `createMemoryTrackingRepo`. To add a new backend
// (e.g. REST, IndexedDB) you implement the same interface and swap it here —
// nothing above this module changes.
//
// Repository interface:
//   saveProfile(uid, patch)            -> Promise<void>
//   updateProfileFields(uid, patch)    -> Promise<void>
//   getProfile(uid)                    -> Promise<object|null>
//   getMonthLog(uid, monthKey)         -> Promise<monthLog>
//   appendLog(uid, monthKey, entry)    -> Promise<monthKey>
// ─────────────────────────────────────────────────────────────────────
import { firestoreTrackingRepo } from './firestoreTrackingRepo';

export { createMemoryTrackingRepo } from './memoryTrackingRepo';

export const trackingRepo = firestoreTrackingRepo;
