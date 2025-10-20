import { useState, useEffect, useRef } from 'react';
import { ValidationRule, validate } from '../../utils/validation';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  error?: string;
  hint?: string;
  validationRules?: ValidationRule[];
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Select = ({
  label,
  options,
  value,
  error: externalError,
  hint,
  validationRules,
  validateOnBlur = true,
  validateOnChange = true,
  onValidationChange,
  onChange,
  placeholder = 'Selecteer een optie',
  disabled = false,
  className = '',
}: SelectProps) => {
  const [internalError, setInternalError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const error = externalError || (touched ? internalError : undefined);

  const validateField = (val: any) => {
    if (!validationRules || validationRules.length === 0) return;

    const result = validate(val, validationRules);
    setInternalError(result.isValid ? undefined : result.error);
    onValidationChange?.(result.isValid, result.error);
  };

  const handleSelect = (optionValue: string) => {
    if (disabled) return;

    setTouched(true);
    if (validateOnChange) {
      validateField(optionValue);
    }
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTouched(true);
    if (validateOnBlur) {
      validateField(value);
    }
  };

  useEffect(() => {
    if (validationRules && touched && value) {
      validateField(value);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        handleBlur();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={className}>
      <label className="block text-sm font-medium text-[var(--color-gray-dark-1)] mb-2">
        {label}
        {hint && <span className="text-xs text-[var(--color-gray-medium)] font-medium block">{hint}</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onBlur={handleBlur}
          disabled={disabled}
          className={`w-full h-10 px-3 py-2 text-sm font-medium border rounded-md bg-white text-left cursor-pointer transition-all duration-200 shadow-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-0 focus:border-[var(--color-accent)] focus:outline-none hover:bg-gray-50 flex items-center justify-between ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-[var(--color-gray-light-4)] focus:border-[var(--color-accent)]'
          } ${
            disabled
              ? 'bg-gray-50 cursor-not-allowed text-gray-500 hover:bg-gray-50'
              : ''
          } ${
            !value || value === ''
              ? 'text-gray-400'
              : 'text-[var(--color-gray-dark-1)]'
          }`}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--color-gray-light-4)] rounded-md shadow-lg max-h-60 overflow-auto animate-in fade-in-0 zoom-in-95">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-3 py-2 text-sm text-left transition-colors duration-150 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                    option.value === value
                      ? 'bg-[var(--color-accent-light-4)] text-[var(--color-gray-dark-1)] font-medium'
                      : 'text-[var(--color-gray-dark-1)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {option.value === value && (
                      <svg
                        className="h-4 w-4 text-[var(--color-primary-dark)]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};
