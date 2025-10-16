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
      <div className="relative">
        <select
          className={`w-full px-4 py-2 font-medium border rounded-lg appearance-none bg-white cursor-pointer transition-all duration-150 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] focus:outline-none hover:border-gray-400 ${
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          } ${
            isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-600 hover:border-gray-300' : ''
          } ${
            !props.value || props.value === '' ? 'text-gray-400' : 'text-gray-900'
          } ${className}`}
          {...props}
          onBlur={handleBlur}
          onChange={handleChange}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-gray-900">
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};
