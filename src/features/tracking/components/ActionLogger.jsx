// ─────────────────────────────────────────────────────────────────────
// ActionLogger (Presentation) — grid of one-tap micro-action buttons,
// grouped by category. Logging a card shows its personalised CO2 saving.
// ─────────────────────────────────────────────────────────────────────
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { MICRO_ACTIONS, ACTION_CATEGORIES } from '../../../utils/emissionFactors';

const CATEGORY_LABELS = {
  [ACTION_CATEGORIES.TRANSPORT]: 'Transport',
  [ACTION_CATEGORIES.FOOD]: 'Food',
  [ACTION_CATEGORIES.ENERGY]: 'Energy',
  [ACTION_CATEGORIES.WASTE]: 'Waste',
  [ACTION_CATEGORIES.WATER]: 'Water',
};

export default function ActionLogger({ onLog, logging }) {
  const [pendingId, setPendingId] = useState(null);

  // Group once; the catalogue is static so this never recomputes.
  const grouped = useMemo(() => {
    const map = {};
    for (const action of MICRO_ACTIONS) {
      (map[action.category] ||= []).push(action);
    }
    return map;
  }, []);

  const handleLog = async (action) => {
    setPendingId(action.id);
    try {
      const entry = await onLog(action.id);
      if (entry) toast.success(`+${entry.co2SavedKg} kg CO₂ saved · ${action.label}`);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(grouped).map(([category, actions]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-3">
            {CATEGORY_LABELS[category] || category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {actions.map((action) => {
              const isPending = logging && pendingId === action.id;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleLog(action)}
                  disabled={logging}
                  className="glass-card flex items-center gap-3 p-3.5 text-left disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="text-2xl shrink-0" aria-hidden="true">
                    {action.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {action.label}
                    </span>
                    <span className="block text-xs text-[var(--color-text-muted)]">
                      ~{action.baseSaving} kg · {action.unit}
                    </span>
                  </span>
                  {isPending ? (
                    <span className="w-4 h-4 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" />
                  ) : (
                    <span
                      className="text-[var(--color-primary)] text-lg font-bold"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
