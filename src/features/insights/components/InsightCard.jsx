// Presentational card rendering a single AI recommendation.
import Card from '../../../components/Card';

const CATEGORY_ICONS = {
  transport: '🚲',
  food: '🥗',
  energy: '⚡',
  waste: '♻️',
  water: '💧',
};

export default function InsightCard({ insight }) {
  return (
    <Card interactive className="flex flex-col gap-2 h-full">
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl" aria-hidden="true">
          {CATEGORY_ICONS[insight.category] || '🌍'}
        </span>
        <span className="ai-badge ai-badge-cloud whitespace-nowrap">{insight.impact}</span>
      </div>
      <h4 className="text-base font-bold text-[var(--color-text-primary)]">{insight.title}</h4>
      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{insight.detail}</p>
    </Card>
  );
}
