// ─────────────────────────────────────────────────────────────────────
// InsightsPage — AI coaching view. Loads cached insights, lets the user
// spend one Gemini request to refresh, and renders the JSON recommendations
// as styled cards.
// ─────────────────────────────────────────────────────────────────────
import { useFootprintData } from '../features/tracking/hooks/useFootprintData';
import { useInsights } from '../features/insights/hooks/useInsights';
import { formatLogTime } from '../utils/dateUtils';
import Button from '../components/Button';
import Card from '../components/Card';
import { PageLoader } from '../components/Spinner';
import InsightCard from '../features/insights/components/InsightCard';

export default function InsightsPage() {
  const { monthLog, loading: dataLoading } = useFootprintData();
  const { insights, generatedAt, source, loading, error, geminiReady, refresh } =
    useInsights(monthLog);

  if (dataLoading) return <PageLoader />;

  const hasActions = (monthLog?.count ?? 0) > 0;
  const engineLabel = source === 'rules' ? 'EcoTrace coach engine' : 'Gemini 2.5 Flash';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title">
            <span aria-hidden="true">✨</span> Sustainability coach
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Personalised, locally-aware recommendations
            {insights.length > 0 && ` from ${engineLabel}`}.
            {generatedAt && ` · Updated ${formatLogTime(generatedAt)}`}
          </p>
        </div>
        <Button onClick={refresh} loading={loading} disabled={!hasActions}>
          {insights.length ? 'Regenerate' : 'Generate insights'}
        </Button>
      </div>

      {!geminiReady && (
        <Card>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Live AI insights aren’t configured, so the coach uses EcoTrace’s built-in context-aware
            engine — you still get tailored, quantified advice. To enable Gemini, add{' '}
            <code>VITE_GEMINI_API_KEY</code> to <code>.env</code> (see <code>DEPLOYMENT.md</code>).
          </p>
        </Card>
      )}

      {!hasActions && (
        <Card>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Log a few green actions on your dashboard first — the coach analyses your real activity
            to give relevant advice. 🌱
          </p>
        </Card>
      )}

      {error && (
        <p className="text-sm text-[var(--color-warning)]" role="alert">
          {error}
        </p>
      )}

      {insights.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up">
          {insights.map((insight, i) => (
            <InsightCard key={`${insight.title}-${i}`} insight={insight} />
          ))}
        </div>
      )}

      {hasActions && insights.length === 0 && !loading && !error && (
        <Card>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Tap <strong>Generate insights</strong> to get 3 tailored recommendations based on this
            month’s activity.
          </p>
        </Card>
      )}
    </div>
  );
}
