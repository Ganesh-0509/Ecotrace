// ─────────────────────────────────────────────────────────────────────
// DashboardPage — the core tracking view: headline stats, the one-tap
// micro-action logger, and a recent-activity feed.
// ─────────────────────────────────────────────────────────────────────
import { useFootprintData } from '../features/tracking/hooks/useFootprintData';
import { useAuthContext } from '../context/AuthContext';
import { formatMonthLabel, currentMonthKey } from '../utils/dateUtils';
import Card from '../components/Card';
import { PageLoader } from '../components/Spinner';
import StatCard from '../features/tracking/components/StatCard';
import EcoScoreRing from '../features/tracking/components/EcoScoreRing';
import ActionLogger from '../features/tracking/components/ActionLogger';
import LogList from '../features/tracking/components/LogList';

export default function DashboardPage() {
  const { profile } = useAuthContext();
  const { stats, loading, logging, logAction } = useFootprintData();

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-extrabold">
            Hi{profile?.displayName ? `, ${profile.displayName}` : ''} 👋
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {formatMonthLabel(currentMonthKey())}
            {profile?.city ? ` · ${profile.city}` : ''}
          </p>
        </div>
      </div>

      {/* Score + stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1 flex items-center justify-center py-6">
          <EcoScoreRing score={stats.score} />
        </Card>
        <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon="🌍"
            label="CO₂ saved this month"
            value={`${stats.totalSaved} kg`}
            accent
          />
          <StatCard icon="✅" label="Actions logged" value={stats.count} />
          <StatCard
            icon="🌳"
            label="Equivalent tree-days"
            value={stats.equivalents.treeDays}
            sub={`≈ ${stats.equivalents.carKm} km not driven`}
          />
        </div>
      </div>

      {/* Goal progress + real-world context */}
      <Card className="flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
            Monthly goal · {stats.totalSaved} / {stats.context.targetKg} kg CO₂ saved
          </h2>
          <span className="text-xs text-[var(--color-text-muted)]">
            ≈ {stats.context.shareOfAveragePct}% of an average person’s monthly footprint
          </span>
        </div>
        <div
          className="h-2.5 w-full rounded-full bg-[var(--color-border)] overflow-hidden"
          role="progressbar"
          aria-valuenow={stats.context.progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress toward ${stats.context.targetKg} kg monthly saving goal`}
        >
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-500"
            style={{ width: `${stats.context.progressPct}%` }}
          />
        </div>
      </Card>

      {/* Logger + feed */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="log-heading">
          <h2 id="log-heading" className="section-title mb-4">
            <span aria-hidden="true">⚡</span> Log a green action
          </h2>
          <ActionLogger onLog={logAction} logging={logging} />
        </section>

        <section aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="section-title mb-4">
            <span aria-hidden="true">🕑</span> Recent activity
          </h2>
          <Card>
            <LogList entries={stats.recent} />
          </Card>
        </section>
      </div>
    </div>
  );
}
