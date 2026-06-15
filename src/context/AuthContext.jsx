// ─────────────────────────────────────────────────────────────────────
// AuthContext — single source of truth for the authenticated session and
// the user's baseline profile. Subscribes once to Firebase auth state and
// hydrates the Firestore profile, exposing both to the whole component tree.
// ─────────────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuth, fetchProfile } from '../features/auth/services/authService';
import { isFirebaseConfigured } from '../config/firebase';

const AuthContext = createContext(null);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within <AuthProvider>');
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  // Lazy initial state: if Firebase isn't configured we skip the loading
  // gate entirely so the app can render a setup-needed message immediately.
  const [loading, setLoading] = useState(() => isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          setProfile(await fetchProfile(firebaseUser.uid));
        } catch (error) {
          console.warn('Failed to load profile:', error.message);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Allows features (onboarding, profile edits) to refresh cached profile.
  const refreshProfile = async () => {
    if (!user) return;
    setProfile(await fetchProfile(user.uid));
  };

  const value = {
    user,
    profile,
    loading,
    isConfigured: isFirebaseConfigured,
    profileCompleted: !!profile?.profileCompleted,
    setProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
