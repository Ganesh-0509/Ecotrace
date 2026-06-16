import type { HTMLAttributes } from 'react';

// Reusable glassmorphism card surface used across the dashboard.
type CardProps = HTMLAttributes<HTMLDivElement> & { interactive?: boolean };

export default function Card({
  className = '',
  interactive = false,
  children,
  ...props
}: CardProps) {
  const surface = interactive ? 'glass-card' : 'glass-card-static';
  return (
    <div className={`${surface} p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}
