# Architecture

EcoTrace is a **serverless, client-only React SPA** that runs entirely on the
Google **Spark (free) tier**: Firebase Hosting serves the static bundle, the
browser talks directly to Cloud Firestore and the Gemini API, and there is no
paid backend. This document explains the layers and the reasoning behind them;
see the [README](../README.md) for product context and deployment steps.

## System overview

```text
Browser (React 19 + Vite, Tailwind v4)        Google Cloud (Spark / free tier)
  • Feature-Sliced Clean Architecture  ──────► Firebase Hosting   (global CDN, SSL, SPA)
  • accessible UI + eco-score ring             Firebase Auth      (email/password identity)
  • per-user session (AuthContext)             Cloud Firestore    (per-user telemetry)
        │                                       Gemini 2.5 Flash   (localized insights)
        ├─ repository interface  ──► Firestore repo (prod) / in-memory repo (tests)
        ├─ insights              ──► Gemini  →  rule-engine fallback (never throws)
        └─ pure carbon engine    ──► deterministic kg CO₂e math, source-cited factors
```

There is **one origin** and **no server to operate**. Authentication to Google
services is the Firebase Web SDK; the Gemini key is constrained by Google Cloud
API-key restrictions (service scope + HTTP referrers) rather than a backend
proxy — keeping the whole system on the free plan. See the [README security
section](../README.md#️-security-layers).

## Layers

| Layer | Module(s) | Rule |
| --- | --- | --- |
| Domain (pure) | `src/domain/`, `src/utils/` | Deterministic math and entities, no I/O and no React. Every emission factor is a named constant citing its source — no magic numbers. |
| Insights | `src/features/insights/` | `geminiService.js` calls Gemini; `rulesEngine.js` is the always-available deterministic fallback. The hook (`useInsights`) never surfaces a hard failure — it degrades and tags the result `source: 'gemini' \| 'rules'`. |
| Persistence | `src/features/tracking/repository/` | An interface (documented in `index.js`) with two implementations: Firestore (production) and in-memory (dev/tests). The concrete backend is selected here and injected into the service layer. |
| Application | `src/features/*/hooks/`, `src/features/*/services/`, `src/context/` | Hooks orchestrate data flow (`useFootprintData`, `useInsights`, `useAuth`); services express use-cases over the repository interface. |
| Presentation | `src/components/`, `src/features/*/components/`, `src/pages/`, `src/layouts/` | Components consume data from the application layer and render UI. They contain no carbon math and no direct database access. |

Design rules the codebase follows:

- **Dependencies point inward.** The service layer depends on the repository
  *interface*, never a concrete backend; the domain layer imports nothing above
  it. Direction is strictly `domain → utils → features → pages`.
- **Graceful degradation.** Gemini and Firebase are feature-detected
  (`isGeminiConfigured`, `isFirebaseConfigured`); the app stays usable with both
  absent — which is also how the unit suite runs (no network, no credentials).
- **Spark-plan data modelling.** A whole month of micro-actions lives in **one**
  document (`users/{uid}/monthly_logs/{YYYY-MM}`) with `totalSaved` denormalised,
  so rendering a month is one read and appending a log is one write. Insights are
  cached at `users/{uid}/insights/{YYYY-MM}` so reopening the page costs no API
  call.
- **No secrets in the repo.** All config comes from `import.meta.env` (Vite);
  `.env` is git-ignored and the app renders a "setup required" state when keys
  are missing.

## Frontend structure

| Concern | Location |
| --- | --- |
| Session + profile state | `src/context/AuthContext.jsx` |
| Data orchestration | `src/features/*/hooks/` (`useFootprintData`, `useInsights`, `useAuth`) |
| Use-cases over the repo | `src/features/*/services/` |
| Swappable persistence | `src/features/tracking/repository/` |
| Pure domain logic | `src/domain/`, `src/utils/` |
| Presentation | `src/components/`, `src/features/*/components/`, `src/pages/` |

Reusable form markup lives in `Field`, which owns label / hint / ARIA wiring so
accessibility is consistent by construction.

## Quality gates

Every push runs **lint** (ESLint + `jsx-a11y` accessibility rules),
**formatting** (Prettier), **strict TypeScript type checks** (`tsc --noEmit`
with `strict` enabled), and the **Vitest** suite with enforced coverage thresholds on
the pure logic layers, plus a production build — see
[CONTRIBUTING.md](../CONTRIBUTING.md). The same gates run locally via the
`.pre-commit-config.yaml` hooks.
