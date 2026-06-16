import type { ChangeEvent } from 'react';

// Labelled form control wrapping the design-system .input-field style.
// Renders a <select> when `options` are supplied, otherwise an <input>.
interface FieldProps {
  id: string;
  label?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
}

export default function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  options,
  required = false,
  placeholder,
  autoComplete,
  minLength,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
          {required && <span className="text-[var(--color-warning)]"> *</span>}
        </label>
      )}
      {options ? (
        <select
          id={id}
          className="input-field"
          value={value}
          onChange={onChange}
          required={required}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          className="input-field"
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
        />
      )}
    </div>
  );
}
