// ─────────────────────────────────────────────────────────────────────
// Navbar — top navigation for the authenticated dashboard area.
// ─────────────────────────────────────────────────────────────────────
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../features/auth/hooks/useAuth';
import Logo from './Logo';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/dashboard/insights', label: 'AI Insights', icon: '✨' },
  { to: '/dashboard/profile', label: 'Profile', icon: '👤' },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/80 backdrop-blur-md">
      <nav
        className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4"
        aria-label="Primary"
      >
        <NavLink to="/dashboard" aria-label="EcoTrace home">
          <Logo size={30} />
        </NavLink>

        <div className="flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[var(--color-bg-elevated)] text-[var(--color-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]'
                }`
              }
            >
              <span aria-hidden="true">{link.icon}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:block text-sm text-[var(--color-text-muted)] max-w-[140px] truncate">
            {user?.displayName || user?.email}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-warning)] transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
