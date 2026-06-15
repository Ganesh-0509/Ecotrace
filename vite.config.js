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
});
