// ─────────────────────────────────────────────────────────────────────
// In-Memory Tracking Repository — the dependency-free implementation.
// ─────────────────────────────────────────────────────────────────────
// Mirrors the exact semantics of the Firestore repository (one aggregate
// document per user-month) but holds everything in plain Maps. This lets the
// tracking logic be exercised in tests — and run as a zero-config local
// backend — with no network, credentials, or Firebase SDK involved.
//
// The service layer depends on the repository *interface*, never on a
// concrete backend, so swapping this in for tests changes nothing above it.
// ─────────────────────────────────────────────────────────────────────

/**
 * Creates an isolated in-memory tracking repository.
 * @param {{ profiles?: Record<string, object> }} [seed] optional initial data
 */
export function createMemoryTrackingRepo(seed = {}) {
  const profiles = new Map(Object.entries(seed.profiles ?? {}));
  const logs = new Map(); // `${uid}/${monthKey}` -> monthLog

  const key = (uid, monthKey) => `${uid}/${monthKey}`;
  const emptyMonth = (monthKey) => ({ month: monthKey, entries: [], totalSaved: 0, count: 0 });

  return {
    async saveProfile(uid, patch) {
      profiles.set(uid, { ...(profiles.get(uid) ?? {}), ...patch, profileCompleted: true });
    },

    async updateProfileFields(uid, patch) {
      profiles.set(uid, { ...(profiles.get(uid) ?? {}), ...patch });
    },

    async getProfile(uid) {
      return profiles.get(uid) ?? null;
    },

    async getMonthLog(uid, monthKey) {
      return logs.get(key(uid, monthKey)) ?? emptyMonth(monthKey);
    },

    async appendLog(uid, monthKey, entry) {
      const existing = logs.get(key(uid, monthKey));
      if (existing) {
        existing.entries.push(entry);
        existing.totalSaved = Number((existing.totalSaved + entry.co2SavedKg).toFixed(2));
        existing.count += 1;
        existing.updatedAt = entry.loggedAt;
      } else {
        logs.set(key(uid, monthKey), {
          month: monthKey,
          entries: [entry],
          totalSaved: entry.co2SavedKg,
          count: 1,
          createdAt: entry.loggedAt,
          updatedAt: entry.loggedAt,
        });
      }
      return monthKey;
    },
  };
}
