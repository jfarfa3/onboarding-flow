import type { InputProps } from "@/types/input";

export default function Input({
  field,
  onInput,
  onBlur,
  onFocus,
}: InputProps) {
  const getInputClasses = () => {
    const baseClasses = "p-2 text-base border border-gray-300 rounded text-black";
    if (field.state === 'error') return `${baseClasses} border-red-500`;
    if (field.state === 'success') return `${baseClasses} border-green-500`;
    return baseClasses;
  };
  return (
    <div className="flex flex-col mb-4">
      {field.type === 'select' ? (
        <>
          <label htmlFor={field.id}>{field.label}</label>
          <select
            id={field.id}
            name={field.name}
            value={field.value || ''}
            onInput={(e) => onInput(field.name, e.currentTarget.value)}
            onChange={(e) => onInput(field.name, e.currentTarget.value)}
            onBlur={(e) => onBlur(field.name, e.currentTarget.value)}
            onFocus={() => onFocus(field.name)}
            required={field.required}
            disabled={field.disabled}
            className={getInputClasses()}
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <label htmlFor={field.id}>{field.label}</label>
          <input
            type={field.type}
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            value={field.value || ''}
            onInput={(e) => onInput(field.name, e.currentTarget.value)}
            onBlur={(e) => onBlur(field.name, e.currentTarget.value)}
            onFocus={() => onFocus(field.name)}
            required={field.required}
            disabled={field.disabled}
            pattern={field.regex}
            min={field.min}
            max={field.max}
            className={getInputClasses()}
          />
        </>
      )}
      {field.touched && field.validationMessage && field.state === 'error' && (
        <span className="text-red-500 text-sm mt-1">{field.validationMessage}</span>
      )}
    </div>
  );
};
