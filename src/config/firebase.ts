// ─────────────────────────────────────────────────────────────────────
// Infrastructure Initialization (Clean Architecture: outermost layer)
// ─────────────────────────────────────────────────────────────────────
// Initializes the Firebase App and the services the platform needs on the
// Spark (free) plan:
//   • Authentication  — email/password identity
//   • Cloud Firestore — per-user telemetry storage
//   • Analytics (GA4) — optional, production only
//
// All config comes from import.meta.env (Vite) so no secrets are hardcoded.
// The module degrades gracefully: if env vars are missing it logs a clear
// warning instead of crashing, so the UI can render a "needs setup" state.
// ─────────────────────────────────────────────────────────────────────
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Guard against running with placeholder values from .env.example.
export const isFirebaseConfigured =
  !!firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
  !!firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'your-project-id';

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);

  // ── Google Analytics 4 (optional, production only) ─────────────────
  // Initialised lazily so it never runs on localhost or where unsupported
  // (e.g. SSR/no measurementId), keeping dev noise and bundle cost down.
  if (import.meta.env.PROD && firebaseConfig.measurementId) {
    const initialisedApp = app;
    import('firebase/analytics')
      .then(({ isSupported, getAnalytics }) =>
        isSupported().then((ok) => {
          if (ok) getAnalytics(initialisedApp);
        })
      )
      .catch((error: unknown) =>
        console.warn('Analytics init skipped:', error instanceof Error ? error.message : error)
      );
  }
} else {
  console.warn(
    'Firebase is not configured. Copy .env.example to .env and fill in your ' +
      'project credentials to enable authentication, storage, and AI insights.'
  );
}

// Consumers (auth service, repositories) only run once a user is authenticated,
// which is impossible unless Firebase is configured — so these are exported as
// non-null. The `isFirebaseConfigured` guard gates the whole authed area.
export const auth = authInstance as Auth;
export const db = dbInstance as Firestore;
export { app };
export default app;
