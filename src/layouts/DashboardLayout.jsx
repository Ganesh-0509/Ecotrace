// ─────────────────────────────────────────────────────────────────────
// DashboardLayout — shared chrome (nav + content slot) for protected pages.
// Child routes render into <Outlet />.
// ─────────────────────────────────────────────────────────────────────
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PageLoader } from '../components/Spinner';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] bg-grid">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
