// ─────────────────────────────────────────────────────────────────────
// Date Utilities — pure helpers for the monthly-aggregation data model.
// ─────────────────────────────────────────────────────────────────────
// The Firestore schema stores ONE document per month (id = "YYYY-MM") to
// keep read/write operations far below Spark-plan limits. These helpers
// produce and format those period keys consistently.
// ─────────────────────────────────────────────────────────────────────

/** Returns the current month key, e.g. "2026-06". */
export function currentMonthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/** Returns today's ISO date, e.g. "2026-06-15". */
export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** Human-friendly month label, e.g. "June 2026". */
export function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

/** Short time-of-day label for a log entry's ISO timestamp. */
export function formatLogTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** True if the ISO timestamp falls on today's date. */
export function isToday(isoString) {
  return isoString.slice(0, 10) === todayKey();
}
