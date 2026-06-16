// ─────────────────────────────────────────────────────────────────────
// AuthForm (Presentation) — combined sign-in / sign-up form. Pure UI: it
// delegates all logic to the useAuth hook and reports success upward.
// ─────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import toast from 'react-hot-toast';
import Field from '../../../components/Field';
import Button from '../../../components/Button';
import { useAuth } from '../hooks/useAuth';

export default function AuthForm() {
  const { login, register, submitting, error, setError } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ displayName: '', email: '', password: '' });

  const isSignup = mode === 'signup';

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const toggleMode = () => {
    setError('');
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = isSignup
      ? await register(form.email, form.password, form.displayName)
      : await login(form.email, form.password);
    if (ok) toast.success(isSignup ? 'Welcome to EcoTrace!' : 'Welcome back!');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {isSignup && (
        <Field
          id="displayName"
          label="Name"
          value={form.displayName}
          onChange={update('displayName')}
          placeholder="Your name"
          autoComplete="name"
          required
        />
      )}
      <Field
        id="email"
        label="Email"
        type="email"
        value={form.email}
        onChange={update('email')}
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <Field
        id="password"
        label="Password"
        type="password"
        value={form.password}
        onChange={update('password')}
        placeholder="••••••••"
        autoComplete={isSignup ? 'new-password' : 'current-password'}
        required
        minLength={6}
      />

      {error && (
        <p className="text-sm text-[var(--color-warning)]" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={submitting} className="w-full mt-1">
        {isSignup ? 'Create account' : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={toggleMode}
          className="font-semibold text-[var(--color-primary)] hover:underline"
        >
          {isSignup ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    </form>
  );
}
