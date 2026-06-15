// Reusable glassmorphism card surface used across the dashboard.
export default function Card({ className = '', interactive = false, children, ...props }) {
  const surface = interactive ? 'glass-card' : 'glass-card-static';
  return (
    <div className={`${surface} p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}
