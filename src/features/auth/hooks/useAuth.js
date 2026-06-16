// ─────────────────────────────────────────────────────────────────────
// useAuth — Application-layer hook orchestrating auth actions for the UI.
// Components call login/register/signOut and read loading/error here,
// rather than touching Firebase or the service layer directly.
// ─────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  loginWithEmail,
  registerWithEmail,
  logout as logoutService,
  friendlyAuthError,
} from '../services/authService';
import { useAuthContext } from '../../../context/AuthContext';

export function useAuth() {
  const { user, profile, loading, profileCompleted, refreshProfile } = useAuthContext();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const login = async (email, password) => {
    setSubmitting(true);
    setError('');
    try {
      await loginWithEmail(email, password);
      return true;
    } catch (err) {
      setError(friendlyAuthError(err));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const register = async (email, password, displayName) => {
    setSubmitting(true);
    setError('');
    try {
      await registerWithEmail(email, password, displayName);
      return true;
    } catch (err) {
      setError(friendlyAuthError(err));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const signOut = () => logoutService();

  return {
    user,
    profile,
    loading,
    profileCompleted,
    submitting,
    error,
    setError,
    login,
    register,
    signOut,
    refreshProfile,
  };
}
