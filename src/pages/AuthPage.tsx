// ─────────────────────────────────────────────────────────────────────
// AuthPage — hosts the combined sign-in / sign-up card.
// ─────────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import AuthForm from '../features/auth/components/AuthForm';
import { useAuthContext } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function AuthPage() {
  const { isConfigured } = useAuthContext();

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] bg-grid flex flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="mb-8" aria-label="EcoTrace home">
        <Logo size={40} />
      </Link>

      <div className="glass-card-static w-full max-w-md p-7">
        <h1 className="text-xl font-bold mb-1">Welcome</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          Track your footprint and unlock AI-powered insights.
        </p>

        {isConfigured ? (
          <AuthForm />
        ) : (
          <div className="rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] p-4 text-sm text-[var(--color-text-secondary)]">
            <strong className="block text-[var(--color-text-primary)] mb-1">Setup required</strong>
            Firebase isn’t configured yet. Copy <code>.env.example</code> to <code>.env</code> and
            add your project credentials, then restart the dev server. See <code>README.md</code>.
          </div>
        )}
      </div>
    </div>
  );
}
