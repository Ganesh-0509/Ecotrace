// ─────────────────────────────────────────────────────────────────────
// Logo — the EcoTrace brand mark, rendered inline as SVG so it scales
// crisply and can sit beside an optional wordmark. The mark itself carries
// no caption text (icon only); the wordmark is opt-in via `withWordmark`.
// ─────────────────────────────────────────────────────────────────────
export function BrandMark({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="EcoTrace"
    >
      <defs>
        <linearGradient id="eco-grad-inline" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22c55e" />
          <stop offset="0.55" stopColor="#16a34a" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="17" fill="url(#eco-grad-inline)" />
      <path
        d="M16 44 L27 33 L35 41 L48 19"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 18 L50 18 L50 28"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ size = 32, withWordmark = true, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandMark size={size} />
      {withWordmark && (
        <span className="font-extrabold tracking-tight gradient-text" style={{ fontSize: size * 0.6 }}>
          EcoTrace
        </span>
      )}
    </span>
  );
}
