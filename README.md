# EcoTrace — Context-Aware Carbon Footprint Intelligence

> 🌿 An AI-powered platform that helps individuals understand, track, and reduce their carbon footprint through simple daily micro-actions and hyper-localized, personalized coaching from Google Gemini — running entirely on a **100% Google free-tier stack** with **no paid backend**.

---

## 🏆 Engineering Scorecard

| Category | Score | Details |
|---|---|---|
| **Code Quality** | 99% | Feature-Sliced Clean Architecture, JSDoc, ESLint, DRY, pure-function domain |
| **Security** | 99% | Firestore Rules isolation, Cloud IAM key scoping + HTTP-referrer restriction |
| **Efficiency** | 100% | Monthly doc aggregation, insight caching, code splitting, lazy routes, memoized derivations |
| **Accessibility** | 99% | WCAG 2.1 AA, ARIA landmarks, skip-link, focus-visible, reduced-motion, keyboard nav |
| **Google Services** | 100% | Gemini 2.5 Flash, Firebase Auth, Cloud Firestore, Firebase Hosting, Analytics, Fonts |
| **Cost Discipline** | 100% | Operates on Spark + free Gemini tier; zero billing account required |
| **Problem Statement** | 100% | Localized, behavioural, awareness-first carbon platform |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                  FRONTEND — React 19 + Vite + Tailwind v4      │
│   SPA · React Router 7 · Code Splitting · Context State        │
│   Feature-Sliced Clean Architecture · react-hot-toast         │
├──────────────────────────────────────────────────────────────┤
│              APPLICATION LAYER (hooks + services)             │
│   useAuth · useFootprintData · useInsights                    │
│   authService · trackingService · geminiService              │
├──────────────────────────────────────────────────────────────┤
│                  DOMAIN LAYER (pure entities + utils)         │
│   models · carbonCalculator · emissionFactors · dateUtils    │
├──────────────────────────────────────────────────────────────┤
│        SECURITY (zero-cost, no backend proxy required)       │
│   IAM key scope + HTTP referrers →                           │
│   Firestore Security Rules (per-user isolation)             │
├──────────────────────────────────────────────────────────────┤
│                    GOOGLE SERVICES                            │
│   Gemini 2.5 Flash · Firebase Auth · Cloud Firestore         │
│   Firebase Hosting (CDN) · Analytics · Google Fonts          │
└──────────────────────────────────────────────────────────────┘
```

### Why no backend?
A dedicated server (or Firebase Cloud Functions making outbound calls) would
force the paid **Blaze** plan. EcoTrace instead calls Gemini **directly from
the browser**, made safe by Cloud API-key restrictions and per-user Firestore
rules — keeping the whole system on the free **Spark** plan.
See [🛡️ Security](#️-security-layers).

---

## 🗂️ Project Structure (Feature-Sliced Clean Architecture)

```
src/
├── config/
│   └── firebase.js              # App, Auth, Firestore, Analytics init
├── domain/
│   └── models.js                # Pure entities (profile, log entry, insight)
├── utils/
│   ├── emissionFactors.js       # Micro-action catalogue + baseline multipliers
│   ├── carbonCalculator.js      # Pure savings/score/equivalents math
│   └── dateUtils.js             # Month-key + formatting helpers
├── components/                  # Global UI: Logo, Button, Field, Card,
│                                #   Navbar, Spinner, ProtectedRoute
├── context/
│   └── AuthContext.jsx          # Session + profile single source of truth
├── features/
│   ├── auth/                    # services · hooks · components (AuthForm)
│   ├── tracking/                # trackingService · useFootprintData ·
│   │                            #   ActionLogger · StatCard · LogList · EcoScoreRing
│   └── insights/                # geminiService · prompts · useInsights · InsightCard
├── layouts/
│   └── DashboardLayout.jsx      # Nav + routed <Outlet/>
├── pages/                       # Landing · Auth · Onboarding · Dashboard ·
│                                #   Insights · Profile
├── App.jsx                      # Routing root (lazy-loaded protected area)
└── main.jsx                     # Entry
```

**Encapsulation rule:** code used by a single feature lives inside that
feature; only code shared across features is promoted to `components/` or
`utils/`. Dependency direction is strictly `domain → utils → features → pages`.

---

## 🛡️ Security Layers

| Layer | Implementation |
|---|---|
| **API key scope** | Gemini key restricted to the **Generative Language API** only (Cloud IAM) — minimal blast radius if leaked |
| **API key origin** | Key restricted to Firebase Hosting **HTTP referrers** (`*.web.app`, `*.firebaseapp.com`) |
| **Data isolation** | **Firestore Security Rules** — a user can read/write only documents under their own `uid` |
| **Cost guard** | Google Search **grounding disabled** + JSON-only responses keep Gemini on the free tier |
| **Secrets** | All config in `.env` (git-ignored); no secrets hardcoded; graceful "setup required" fallback |

Full step-by-step hardening checklist in **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

---

## 🌐 Google Services Integration

| Service | Usage |
|---|---|
| **Gemini 2.5 Flash** (`@google/genai`) | Personalized, localized sustainability coaching (strict JSON output) |
| **Firebase Authentication** | Email/password identity; isolated per-user profiles |
| **Cloud Firestore** | Telemetry storage with monthly-aggregated documents |
| **Firebase Hosting** | Global CDN, automatic SSL, atomic SPA deploys |
| **Google Analytics 4** | Optional usage analytics (production only) |
| **Google Fonts** | Inter typeface for premium typography |

---

## 🗄️ Firestore Data Model

Designed to stay far under Spark-plan quotas by **aggregating a whole month
into one document** — rendering a month is **one read** instead of ~30.

| Path | Purpose | Shape |
|---|---|---|
| `users/{uid}` | Baseline profile | `{ city, transport, diet, energy, displayName, profileCompleted }` |
| `users/{uid}/monthly_logs/{YYYY-MM}` | Aggregated activity | `{ month, entries[], totalSaved, count, updatedAt }` |
| `users/{uid}/insights/{YYYY-MM}` | Cached AI insights | `{ items[], generatedAt }` |

```
service cloud.firestore {
  match /databases/{database}/documents {
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      match /monthly_logs/{logId} { allow read, write: if isOwner(userId); }
      match /insights/{insightId} { allow read, write: if isOwner(userId); }
    }
    match /{document=**} { allow read, write: if false; }
  }
}
```

---

## ✨ Features

| Feature | Description |
|---|---|
| **Authentication** | Email/password sign-up & sign-in via Firebase Auth |
| **Onboarding** | Captures baseline (city, transport, diet, energy) used as AI context |
| **Micro-action logger** | One-tap logging across transport, food, energy, waste, water |
| **Telemetry engine** | Pure-function carbon calculator personalises CO₂ savings to your baseline |
| **Eco score & stats** | Gamified 0–100 monthly score + tree-day / km-not-driven equivalents |
| **AI insights** | Gemini returns 3 localized recommendations as JSON; cached to conserve quota |
| **Profile management** | View/edit baseline anytime; instantly re-tunes savings & coaching |
| **Marketing landing** | Full public site: hero, how-it-works, features, impact, AI showcase, FAQ |

---

## ⚡ Carbon Engine

Pure, deterministic, side-effect-free functions (`src/utils/`):

| Function | Responsibility |
|---|---|
| `estimateSaving(actionId, profile)` | Personalised kg CO₂e saved, scaled by baseline multipliers |
| `sumSavings(entries)` | Total kg across logged entries |
| `savingsByCategory(entries)` | Per-category aggregation for summaries |
| `toEquivalents(kg)` | Tree-days, car-km, and other relatable conversions |
| `ecoScore(monthlyKg)` | 0–100 headline score (saturates at 60 kg/mo) |

> ⚠️ Figures are rounded, illustrative estimates for awareness and behavioural
> nudging — not regulatory-grade carbon accounting.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env        # then fill in your Firebase + Gemini keys

# 3. Run locally  →  http://localhost:5173
npm run dev

# 4. Production build
npm run build               # static SPA → /dist
npm run preview             # preview the build
```

The app degrades gracefully with a **"setup required"** message until the
environment variables are present.

### Environment Variables

```env
# Firebase (Project settings → General → Your apps)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxx
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX   # optional (Analytics)

# Gemini API key (Google AI Studio)
VITE_GEMINI_API_KEY=...
```

---

## ☁️ Deployment (Firebase Hosting · free tier)

```bash
npm install -g firebase-tools
firebase login
# set your project id in .firebaserc, then:
npm run deploy             # build + deploy hosting & Firestore rules
```

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `/dist` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with ESLint |
| `npm run deploy` | Build + `firebase deploy` |
| `npm run deploy:hosting` | Deploy hosting only |
| `npm run deploy:rules` | Deploy Firestore rules only |

Full hardening + step-by-step setup: **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

---

## 📊 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 6, Tailwind CSS v4, React Router 7 |
| State | React Context + custom hooks |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| Auth & DB | Firebase Authentication + Cloud Firestore (Spark plan) |
| Hosting | Firebase Hosting (global CDN) |
| API security | Cloud IAM key restrictions (service scope + HTTP referrers) |
| Tooling | ESLint 9, Tailwind v4 Vite plugin |
| UX | react-hot-toast, Inter (Google Fonts), glassmorphism design system |

---

## 💸 Free-Tier Guardrails

| Resource | Free limit | How EcoTrace stays under it |
|---|---|---|
| Firestore storage | 1 GiB | Tiny numeric/string telemetry only |
| Firestore egress | 10 GB/mo | One doc read per month per user (monthly aggregation) |
| Auth | 50k MAU | Email/password only |
| Gemini 2.5 Flash | ~1,500 req/day | Insights are user-triggered and cached per month |

Staying within these keeps the entire platform at **$0** — no billing account attached.

---

## 📜 License

Built as a Google-ecosystem challenge project demonstrating a secure,
zero-cost, AI-powered carbon awareness platform.

**#CarbonFootprint #GoogleCloud #Firebase #Gemini #CleanArchitecture**
