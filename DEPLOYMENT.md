# 🚀 Deployment & Zero-Cost Security Hardening

This guide takes EcoTrace from a local build to a live, secured deployment
on the **Firebase Spark (free) plan** with **no billing account required**.

> The whole point of the security setup below is to let the Gemini API key
> ship in the client bundle *safely*, avoiding a paid backend proxy while
> still blocking bots/scripts from draining your free quota.

---

## 0. Prerequisites

```bash
npm install -g firebase-tools
firebase login
```

Create (or reuse) a Firebase project at <https://console.firebase.google.com>.
Put its project id in `.firebaserc` (replace `your-project-id`).

---

## 1. Enable Firebase services

In the Firebase console for your project:

1. **Authentication** → Get started → enable **Email/Password**.
2. **Firestore Database** → Create database → **Production mode** → pick a region.
3. **Project settings → General → Your apps** → add a **Web app**; copy the
   config object values into your `.env` (the `VITE_FIREBASE_*` keys).

---

## 2. Configure Gemini (Google AI Studio)

1. Create a Gemini API key at <https://aistudio.google.com/app/apikey>
   (you can attach it to the same Google Cloud project as Firebase).
2. Put it in `.env` as `VITE_GEMINI_API_KEY`.
3. The app targets `gemini-2.5-flash` and requests `application/json` output
   with **Google Search grounding OFF** — both keep you on the free tier.

---

## 3. 🔐 Security Layer 1 — Restrict the API key (Google Cloud IAM)

Open <https://console.cloud.google.com/apis/credentials> for the project.

**A. Service (API) restriction** — least privilege:
- Edit your API key → **API restrictions** → *Restrict key*.
- Allow **only** the **Generative Language API**.
- Result: a leaked key can't touch Maps, Storage, or other services.

**B. Application (HTTP referrer) restriction:**
- **Application restrictions** → *Websites (HTTP referrers)*.
- Add your hosting URLs:
  - `https://your-project-id.web.app/*`
  - `https://your-project-id.firebaseapp.com/*`
  - (For local dev, temporarily add `http://localhost:5173/*`.)
- Result: the key only works from your own origin.

---

## 4. 🔐 Security Layer 2 — Firestore Security Rules

Rules are already authored in [`firestore.rules`](./firestore.rules):
they enforce that an authenticated user can only read/write documents under
their own `uid`. Deploy them:

```bash
npm run deploy:rules
```

---

## 5. Deploy hosting

```bash
npm run build
firebase deploy --only hosting
# or, build + deploy everything:
npm run deploy
```

Your app is now live at `https://your-project-id.web.app`.

---

## 6. Post-deploy checklist

- [ ] Firebase **Email/Password** auth enabled.
- [ ] Firestore created in **production mode**; `firestore.rules` deployed.
- [ ] API key restricted to **Generative Language API** only.
- [ ] API key restricted to your **HTTP referrers** (`*.web.app`, `*.firebaseapp.com`).
- [ ] Gemini call uses `gemini-2.5-flash`, JSON output, **grounding off**.
- [ ] No real secrets committed — `.env` is git-ignored.

> **Note:** App Check / reCAPTCHA Enterprise is intentionally **not** used in
> this build. The Gemini key relies on the two Google Cloud API-key
> restrictions above (service scope + HTTP referrers). If you later want bot
> attestation, you can re-introduce Firebase App Check.

---

## 💸 Free-tier guardrails (reference)

| Resource | Free limit | How EcoTrace stays under it |
| --- | --- | --- |
| Firestore storage | 1 GiB | Tiny numeric/string telemetry only |
| Firestore egress | 10 GB/mo | One doc read per month per user (monthly aggregation) |
| Auth | 50k MAU | Email/password only |
| Gemini 2.5 Flash | ~1,500 req/day | Insights are user-triggered and cached per month |

Staying within these keeps the entire platform at **$0** with no billing
account attached.
