// Full-screen and inline loading indicators.
import { BrandMark } from './Logo';

export function FullScreenLoader({ text = 'Loading' }: { text?: string }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[var(--color-bg-dark)]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-5" aria-hidden="true">
          <div
            className="absolute -inset-1 rounded-2xl border-2 border-transparent border-t-[var(--color-primary)] animate-spin"
            style={{ animationDuration: '0.9s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center animate-float">
            <BrandMark size={48} />
          </div>
        </div>
        <p className="text-[var(--color-text-muted)] text-sm font-medium">{text}</p>
        <span className="sr-only">{text}, please wait…</span>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div
      className="flex items-center justify-center h-full min-h-[50vh]"
      role="status"
      aria-busy="true"
    >
      <div className="w-8 h-8 border-2 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}
