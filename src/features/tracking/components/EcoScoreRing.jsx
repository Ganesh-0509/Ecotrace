// SVG progress ring visualising the monthly eco score (0-100).
export default function EcoScoreRing({ score }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true">
        <circle className="ring-bg" cx="64" cy="64" r={radius} strokeWidth="10" fill="none" />
        <circle
          className="ring-fill"
          cx="64"
          cy="64"
          r={radius}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold gradient-text">{score}</span>
        <span className="text-xs text-[var(--color-text-muted)]">eco score</span>
      </div>
    </div>
  );
}
