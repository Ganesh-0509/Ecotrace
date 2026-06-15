// Labelled form control wrapping the design-system .input-field style.
// Renders a <select> when `options` are supplied, otherwise an <input>.
export default function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  options,
  required = false,
  ...props
}) {
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
          {...props}
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
          {...props}
        />
      )}
    </div>
  );
}
