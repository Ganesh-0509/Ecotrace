// Recent activity feed for the dashboard.
import { ACTION_INDEX } from '../../../utils/emissionFactors';
import { formatLogTime } from '../../../utils/dateUtils';

export default function LogList({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">
        No actions logged yet. Tap a card on the left to start tracking your impact. 🌱
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry, i) => {
        const icon = ACTION_INDEX[entry.actionId]?.icon ?? '✅';
        return (
          <li
            key={`${entry.loggedAt}-${i}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)]"
          >
            <span className="text-xl" aria-hidden="true">
              {icon}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm text-[var(--color-text-primary)] truncate">
                {entry.label}
              </span>
              <span className="block text-xs text-[var(--color-text-muted)]">
                {formatLogTime(entry.loggedAt)}
              </span>
            </span>
            <span className="text-sm font-bold text-[var(--color-secondary)] whitespace-nowrap">
              +{entry.co2SavedKg} kg
            </span>
          </li>
        );
      })}
    </ul>
  );
}
