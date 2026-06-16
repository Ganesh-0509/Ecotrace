// ─────────────────────────────────────────────────────────────────────
// Route guards. ProtectedRoute requires auth AND a completed profile;
// AuthRequired only requires auth (used for the onboarding page itself).
// ─────────────────────────────────────────────────────────────────────
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { FullScreenLoader } from './Spinner';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, profileCompleted } = useAuthContext();
  if (loading) return <FullScreenLoader text="Verifying session" />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!profileCompleted) return <Navigate to="/onboarding" replace />;
  return children;
}

export function AuthRequired({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthContext();
  if (loading) return <FullScreenLoader text="Verifying session" />;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}
