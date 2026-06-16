import type { ButtonHTMLAttributes } from 'react';

// Global, reusable button. Variants map to the design-system CSS classes.
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
};

export default function Button({
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span
          className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
