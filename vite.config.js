import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// ── Vite Configuration ──────────────────────────────────────────────
// Tailwind v4 is wired in via the official @tailwindcss/vite plugin,
// removing the need for a separate postcss.config / tailwind.config file.
// The build emits a static SPA into /dist that Firebase Hosting serves
// straight from Google's global CDN (zero-cost Spark plan).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Manual chunks keep the initial bundle small and push heavy, rarely
    // changed vendor code (Firebase, the GenAI SDK) into cacheable chunks.
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          genai: ['@google/genai'],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
  // ── Vitest ────────────────────────────────────────────────────────
  // jsdom lets component tests render React; the setup file wires in
  // jest-dom + accessibility (axe) matchers. Coverage thresholds are
  // enforced on the pure logic layers (domain, utils, services), which
  // hold the platform's testable business rules.
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      // Enforce coverage on the pure, deterministic business logic. The
      // Firestore/Gemini adapters are thin I/O wrappers verified through the
      // in-memory repository contract tests rather than line coverage.
      include: [
        'src/utils/**',
        'src/domain/**',
        'src/features/insights/services/rulesEngine.js',
        'src/features/tracking/repository/memoryTrackingRepo.js',
      ],
      exclude: ['**/*.test.*'],
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 70 },
    },
  },
});
