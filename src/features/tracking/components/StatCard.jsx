// Small presentational stat tile for the dashboard header row.
import Card from '../../../components/Card';

export default function StatCard({ icon, label, value, sub, accent = false }) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>
      <span
        className={`text-2xl font-extrabold ${
          accent ? 'gradient-text' : 'text-[var(--color-text-primary)]'
        }`}
      >
        {value}
      </span>
      <span className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</span>
      {sub && <span className="text-xs text-[var(--color-text-muted)]">{sub}</span>}
    </Card>
  );
}
