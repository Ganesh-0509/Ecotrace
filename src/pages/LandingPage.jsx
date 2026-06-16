// ─────────────────────────────────────────────────────────────────────
// LandingPage — public marketing site for signed-out visitors.
// Sections: nav · hero · trust bar · problem · how-it-works · features ·
// impact stats · AI showcase · FAQ · final CTA · footer.
// ─────────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import Logo, { BrandMark } from '../components/Logo';

const STEPS = [
  {
    title: 'Set your baseline',
    text: 'Answer a few quick questions — city, transport, diet, energy. This becomes the context every recommendation is tuned to.',
    icon: '🧭',
  },
  {
    title: 'Log micro-actions',
    text: 'Tap simple daily wins like taking transit, eating plant-based, or air-drying laundry. Each is scored instantly in kg CO₂.',
    icon: '⚡',
  },
  {
    title: 'Get AI coaching',
    text: 'Gemini analyses your real patterns and returns 3 specific, hyper-localized actions to cut your footprint further.',
    icon: '✨',
  },
];

const FEATURES = [
  {
    icon: '📋',
    title: 'One-tap logging',
    text: 'A frictionless logger across transport, food, energy, waste, and water — no spreadsheets, no utility bills.',
  },
  {
    icon: '📊',
    title: 'Personalised telemetry',
    text: 'A pure-function carbon engine scales every saving to your baseline lifestyle, so the numbers mean something.',
  },
  {
    icon: '🎯',
    title: 'Gamified eco score',
    text: 'A monthly 0–100 score and streak-friendly feedback loop keep you coming back and improving.',
  },
  {
    icon: '🧠',
    title: 'Context-aware AI',
    text: 'Recommendations reference your city, local climate initiatives, and what you already do well — never generic.',
  },
  {
    icon: '🌳',
    title: 'Relatable impact',
    text: 'Savings translate into tree-days and kilometres not driven, making abstract CO₂ tangible.',
  },
  {
    icon: '🔒',
    title: 'Private by design',
    text: 'Strict per-user data isolation via Firestore Security Rules. Your data is yours, full stop.',
  },
];

const STATS = [
  { value: '17', label: 'Curated micro-actions', sub: 'across 5 impact categories' },
  { value: '< 1s', label: 'Instant feedback', sub: 'CO₂ scored as you log' },
  { value: '3', label: 'AI insights / refresh', sub: 'localized & actionable' },
  { value: '$0', label: 'Running cost', sub: '100% Google free-tier' },
];

const SAMPLE_INSIGHTS = [
  {
    category: '🚲',
    impact: '~12 kg/mo',
    title: 'Swap weekend short drives for cycling',
    detail:
      'You drive 3 short trips most weekends. Replacing them with a bike aligns with your city’s new non-motorized transport corridor and saves ~12 kg CO₂ a month.',
  },
  {
    category: '⚡',
    impact: '~15%',
    title: 'Shift heavy appliances off-peak',
    detail:
      'Running your washer and dishwasher after 9pm taps into a cleaner local grid mix and trims your energy footprint by roughly 15%.',
  },
  {
    category: '🥗',
    impact: '~8 kg/mo',
    title: 'Add one plant-based dinner',
    detail:
      'You already log vegetarian lunches. Extending that to two dinners a week builds on the habit and saves another ~8 kg CO₂ monthly.',
  },
];

const FAQS = [
  {
    q: 'Is EcoTrace really free to run?',
    a: 'Yes. The entire platform runs on Google’s free tiers — Firebase Hosting, Authentication, and Firestore on the Spark plan, plus the Gemini API free tier. No billing account or paid backend is required.',
  },
  {
    q: 'How accurate are the carbon numbers?',
    a: 'Figures are rounded, illustrative estimates drawn from common public sustainability datasets, personalised to your baseline. They’re built for awareness and behavioural nudging — not regulatory-grade carbon accounting.',
  },
  {
    q: 'How is my data protected?',
    a: 'Firestore Security Rules enforce strict per-user isolation, so you can only ever read or write your own documents. The AI key is hardened with Cloud IAM restrictions — scoped to a single API and locked to the app’s own domains.',
  },
  {
    q: 'What makes the AI insights different?',
    a: 'Instead of generic advice, Gemini receives your baseline profile and recent activity, then returns three concrete, locally-aware recommendations that build on what you already do well.',
  },
];

export default function LandingPage() {
  return (
    <div className="relative bg-[var(--color-bg-dark)] overflow-x-hidden">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/75 backdrop-blur-md">
        <nav
          className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between"
          aria-label="Primary"
        >
          <Logo size={30} />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-text-secondary)]">
            <a href="#how" className="hover:text-[var(--color-primary)] transition-colors">
              How it works
            </a>
            <a href="#features" className="hover:text-[var(--color-primary)] transition-colors">
              Features
            </a>
            <a href="#impact" className="hover:text-[var(--color-primary)] transition-colors">
              Impact
            </a>
            <a href="#faq" className="hover:text-[var(--color-primary)] transition-colors">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="btn-secondary !py-2 !px-4 text-sm">
              Sign in
            </Link>
            <Link to="/auth" className="btn-primary !py-2 !px-4 text-sm hidden sm:inline-flex">
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-20 bg-grid">
          <div
            className="hero-glow w-[420px] h-[420px] -top-20 -left-20"
            style={{ background: 'var(--color-primary-glow)' }}
            aria-hidden="true"
          />
          <div
            className="hero-glow w-[360px] h-[360px] top-10 right-0"
            style={{ background: 'var(--color-secondary)' }}
            aria-hidden="true"
          />

          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <span className="pill reveal-1">🌍 Carbon Footprint Intelligence</span>
              <h1 className="reveal-2 mt-5 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
                Turn small daily choices into{' '}
                <span className="hero-gradient-text">real climate impact</span>
              </h1>
              <p className="reveal-3 mt-5 max-w-xl text-lg text-[var(--color-text-secondary)] leading-relaxed">
                EcoTrace measures the carbon you save with everyday actions and pairs it with
                personalised, locally-aware AI coaching — so progress feels obvious, motivating, and
                genuinely yours.
              </p>
              <div className="reveal-4 mt-8 flex flex-wrap items-center gap-3">
                <Link to="/auth" className="btn-primary">
                  Start tracking free
                </Link>
                <a href="#how" className="btn-secondary">
                  See how it works
                </a>
              </div>
              <div className="reveal-4 mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true">✅</span> No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true">✅</span> 100% Google free-tier
                </span>
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true">✅</span> Private by design
                </span>
              </div>
            </div>

            {/* Hero visual — floating dashboard preview */}
            <div className="relative hidden lg:block" aria-hidden="true">
              <div className="glass-card-static p-5 animate-float-slow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                    This month
                  </span>
                  <span className="ai-badge ai-badge-cloud">eco score 78</span>
                </div>
                <div className="flex items-end gap-1.5 h-28">
                  {[40, 55, 35, 70, 60, 85, 75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md"
                      style={{
                        height: `${h}%`,
                        background:
                          'linear-gradient(to top, var(--color-primary-dark), var(--color-primary-glow))',
                      }}
                    />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[var(--color-bg-elevated)] p-3">
                    <div className="text-2xl font-extrabold gradient-text">47.2 kg</div>
                    <div className="text-xs text-[var(--color-text-muted)]">CO₂ saved</div>
                  </div>
                  <div className="rounded-xl bg-[var(--color-bg-elevated)] p-3">
                    <div className="text-2xl font-extrabold gradient-text">31</div>
                    <div className="text-xs text-[var(--color-text-muted)]">actions logged</div>
                  </div>
                </div>
              </div>
              <div className="glass-card-static absolute -bottom-6 -left-8 p-3.5 w-56 animate-float">
                <div className="flex items-center gap-2">
                  <span className="feature-icon !w-9 !h-9 !text-lg">✨</span>
                  <div>
                    <div className="text-xs font-semibold">AI insight</div>
                    <div className="text-[11px] text-[var(--color-text-muted)]">
                      Cycle weekend trips · −12 kg/mo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust bar ── */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-card)]">
          <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-[var(--color-text-muted)]">
            <span className="font-semibold text-[var(--color-text-secondary)]">Powered by</span>
            <span>🔥 Firebase Hosting</span>
            <span>🔐 Firebase Auth</span>
            <span>🗄️ Cloud Firestore</span>
            <span>🤖 Gemini 2.5 Flash</span>
            <span>🛡️ Firestore Rules</span>
          </div>
        </section>

        {/* ── Problem framing ── */}
        <section className="section max-w-4xl mx-auto px-4 text-center">
          <span className="pill">Why it matters</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
            Individual action feels invisible. We make it{' '}
            <span className="gradient-text">visible</span>.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)] leading-relaxed">
            Climate change is systemic — but personal choices in transport, diet, and energy still
            add up. The problem is that they’re abstract and unrewarding to track. EcoTrace closes
            that gap: it quantifies each action, celebrates progress, and uses AI to connect your
            daily habits to the bigger picture and local initiatives in your city.
          </p>
        </section>

        {/* ── How it works ── */}
        <section id="how" className="section max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="pill">How it works</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
              Three steps to a lighter footprint
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="feature-tile">
                <div className="flex items-center gap-3">
                  <span className="step-num">{i + 1}</span>
                  <span className="text-3xl" aria-hidden="true">
                    {step.icon}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section
          id="features"
          className="section bg-[var(--color-bg-card)] border-y border-[var(--color-border)]"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <span className="pill">Features</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
                Everything you need to act
              </h2>
              <p className="mt-3 text-[var(--color-text-secondary)]">
                Built for momentum: fast to log, satisfying to watch, and smart enough to guide you.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <article key={f.title} className="feature-tile">
                  <span className="feature-icon" aria-hidden="true">
                    {f.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {f.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Impact stats ── */}
        <section id="impact" className="section max-w-6xl mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="stat-number gradient-text">{s.value}</div>
                <div className="mt-2 font-semibold text-[var(--color-text-primary)]">{s.label}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI showcase ── */}
        <section className="section bg-[var(--color-bg-card)] border-y border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <span className="pill">✨ AI coaching</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
                Insights tuned to your life, not generic tips
              </h2>
              <p className="mt-3 text-[var(--color-text-secondary)]">
                A glimpse of the kind of localized, actionable coaching Gemini generates from your
                activity.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {SAMPLE_INSIGHTS.map((insight) => (
                <div key={insight.title} className="glass-card-static p-5 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl" aria-hidden="true">
                      {insight.category}
                    </span>
                    <span className="ai-badge ai-badge-cloud whitespace-nowrap">
                      {insight.impact}
                    </span>
                  </div>
                  <h3 className="text-base font-bold">{insight.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {insight.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="section max-w-3xl mx-auto px-4">
          <div className="text-center">
            <span className="pill">FAQ</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
              Questions, answered
            </h2>
          </div>
          <div className="mt-10 flex flex-col gap-3">
            {FAQS.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <div className="faq-body">{item.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="cta-banner text-center">
            <div
              className="hero-glow w-72 h-72 -top-10 -right-10"
              style={{ background: '#ffffff', opacity: 0.12 }}
              aria-hidden="true"
            />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Ready to see your impact add up?
              </h2>
              <p className="mt-3 text-white/85 max-w-xl mx-auto">
                Join free, set your baseline in under a minute, and log your first green action
                today.
              </p>
              <Link
                to="/auth"
                className="inline-flex mt-7 bg-white text-[var(--color-primary-dark)] font-bold px-7 py-3 rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg"
              >
                Get started — it’s free
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <BrandMark size={28} />
              <span className="font-extrabold gradient-text text-lg">EcoTrace</span>
            </div>
            <p className="mt-3 text-sm text-[var(--color-text-muted)] max-w-xs">
              Carbon footprint intelligence for everyday people — measurable, motivating, and
              AI-guided.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Product</h3>
            <ul className="flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
              <li>
                <a href="#how" className="hover:text-[var(--color-primary)]">
                  How it works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[var(--color-primary)]">
                  Features
                </a>
              </li>
              <li>
                <a href="#impact" className="hover:text-[var(--color-primary)]">
                  Impact
                </a>
              </li>
              <li>
                <Link to="/auth" className="hover:text-[var(--color-primary)]">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Built with</h3>
            <ul className="flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
              <li>React + Vite + Tailwind</li>
              <li>Firebase (Spark plan)</li>
              <li>Gemini 2.5 Flash</li>
              <li>Cloud Firestore Rules</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--color-border)] py-5 text-center text-sm text-[var(--color-text-muted)]">
          © 2026 EcoTrace · Running entirely on a 100% Google free-tier stack
        </div>
      </footer>
    </div>
  );
}
