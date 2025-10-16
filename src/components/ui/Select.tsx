import { SelectHTMLAttributes, useState, useEffect } from 'react';
import { ValidationRule, validate } from '../../utils/validation';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  validationRules?: ValidationRule[];
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const Select = ({
  label,
  options,
  error: externalError,
  hint,
  className = '',
  validationRules,
  validateOnBlur = true,
  validateOnChange = true,
  onValidationChange,
  onChange,
  placeholder = 'Selecteer een optie',
  ...props
}: SelectProps) => {
  const [internalError, setInternalError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const isReadOnly = props.disabled;

  const error = externalError || (touched ? internalError : undefined);

  const validateField = (value: any) => {
    if (!validationRules || validationRules.length === 0) return;

    const result = validate(value, validationRules);
    setInternalError(result.isValid ? undefined : result.error);
    onValidationChange?.(result.isValid, result.error);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setTouched(true);
    if (validateOnBlur) {
      validateField(e.target.value);
    }
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (validateOnChange && touched) {
      validateField(value);
    }
    onChange?.(value);
  };

  useEffect(() => {
    if (validationRules && touched) {
      validateField(props.value);
    }
  }, [props.value]);

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-gray-dark-1)] mb-2">
        {label}
        {hint && <span className="text-xs text-[var(--color-gray-medium)] font-medium block">{hint}</span>}
      </label>
      <select
        className={`w-full px-4 py-2 font-medium border rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
        } ${
          isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
        } ${className}`}
        {...props}
        onBlur={handleBlur}
        onChange={handleChange}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};
