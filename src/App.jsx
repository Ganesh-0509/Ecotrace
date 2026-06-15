// ─────────────────────────────────────────────────────────────────────
// App — routing root. Public pages load eagerly (critical path); the
// authenticated dashboard area is code-split via React.lazy so the initial
// bundle stays small (bundle-dynamic-imports best practice).
// ─────────────────────────────────────────────────────────────────────
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { ProtectedRoute, AuthRequired } from './components/ProtectedRoute';
import { FullScreenLoader, PageLoader } from './components/Spinner';

// Eager (public)
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

// Lazy (authenticated area)
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

function AppRoutes() {
  const { user, loading, profileCompleted } = useAuthContext();

  if (loading) return <FullScreenLoader text="Starting EcoTrace" />;

  // Where a signed-in user should land depending on onboarding state.
  const homeRedirect = user
    ? profileCompleted
      ? '/dashboard'
      : '/onboarding'
    : null;

  return (
    <Routes>
      <Route path="/" element={homeRedirect ? <Navigate to={homeRedirect} replace /> : <LandingPage />} />
      <Route
        path="/auth"
        element={homeRedirect ? <Navigate to={homeRedirect} replace /> : <AuthPage />}
      />

      {/* Auth required, profile may be incomplete */}
      <Route
        path="/onboarding"
        element={
          <AuthRequired>
            <Suspense fallback={<PageLoader />}>
              {profileCompleted ? <Navigate to="/dashboard" replace /> : <OnboardingPage />}
            </Suspense>
          </AuthRequired>
        }
      />

      {/* Protected dashboard (auth + completed profile) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Suspense fallback={<FullScreenLoader text="Loading dashboard" />}>
              <DashboardLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-bg-card)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            duration: 3000,
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
