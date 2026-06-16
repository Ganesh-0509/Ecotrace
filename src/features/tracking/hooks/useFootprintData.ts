// ─────────────────────────────────────────────────────────────────────
// useFootprintData — Application-layer hook bridging the tracking service
// and the dashboard UI. Loads the current month once, exposes derived
// stats, and optimistically updates local state when a new action is
// logged (so the UI feels instant without an extra read).
// ─────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import { appendLog, getMonthLog } from '../services/trackingService';
import { createLogEntry, type LogEntry, type MonthLog } from '../../../domain/models';
import { ACTION_INDEX } from '../../../utils/emissionFactors';
import { currentMonthKey } from '../../../utils/dateUtils';
import {
  estimateSaving,
  ecoScore,
  savingsByCategory,
  toEquivalents,
  footprintContext,
} from '../../../utils/carbonCalculator';

export function useFootprintData() {
  const { user, profile } = useAuthContext();
  const [monthLog, setMonthLog] = useState<MonthLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getMonthLog(user.uid);
        if (active) setMonthLog(data);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const logAction = useCallback(
    async (actionId: string, note = ''): Promise<LogEntry | undefined> => {
      if (!user) return;
      const action = ACTION_INDEX[actionId];
      if (!action) return;

      setLogging(true);
      try {
        const co2SavedKg = estimateSaving(actionId, profile || {});
        const entry = createLogEntry({
          actionId,
          label: action.label,
          category: action.category,
          co2SavedKg,
          note,
        });
        await appendLog(user.uid, entry);
        // Optimistic local update — avoids a second Firestore read.
        setMonthLog((prev): MonthLog => {
          const base: MonthLog = prev ?? {
            month: currentMonthKey(),
            entries: [],
            totalSaved: 0,
            count: 0,
          };
          return {
            ...base,
            entries: [...base.entries, entry],
            totalSaved: Number((base.totalSaved + co2SavedKg).toFixed(2)),
            count: base.count + 1,
          };
        });
        return entry;
      } finally {
        setLogging(false);
      }
    },
    [user, profile]
  );

  // Derived stats computed without effects (rerender-derived-state best practice).
  const stats = useMemo(() => {
    const entries = monthLog?.entries ?? [];
    const totalSaved = monthLog?.totalSaved ?? 0;
    return {
      totalSaved,
      count: entries.length,
      score: ecoScore(totalSaved),
      byCategory: savingsByCategory(entries),
      equivalents: toEquivalents(totalSaved),
      context: footprintContext(totalSaved),
      recent: [...entries].reverse().slice(0, 8),
    };
  }, [monthLog]);

  return { monthLog, stats, loading, logging, logAction };
}
