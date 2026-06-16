// ─────────────────────────────────────────────────────────────────────
// AuthContext — single source of truth for the authenticated session and
// the user's baseline profile. Subscribes once to Firebase auth state and
// hydrates the Firestore profile, exposing both to the whole component tree.
// ─────────────────────────────────────────────────────────────────────
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuth, fetchProfile } from '../features/auth/services/authService';
import { isFirebaseConfigured } from '../config/firebase';
import type { UserProfile } from '../domain/models';

export interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  profileCompleted: boolean;
  setProfile: Dispatch<SetStateAction<UserProfile | null>>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within <AuthProvider>');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
        } catch (error: unknown) {
          console.warn('Failed to load profile:', error instanceof Error ? error.message : error);
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

  const value: AuthContextValue = {
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
