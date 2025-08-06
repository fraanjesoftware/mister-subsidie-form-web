import { InputHTMLAttributes, useState, useEffect } from 'react';
import { ValidationRule, validate } from '../../utils/validation';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  validationRules?: ValidationRule[];
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  onValidationChange?: (isValid: boolean, error?: string) => void;
}

export const Input = ({ 
  label, 
  error: externalError, 
  hint, 
  className = '', 
  validationRules,
  validateOnBlur = true,
  validateOnChange = true,
  onValidationChange,
  ...props 
}: InputProps) => {
  const [internalError, setInternalError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);
  const isReadOnly = props.readOnly || props.disabled;
  
  const error = externalError || (touched ? internalError : undefined);
  
  const validateField = (value: any) => {
    if (!validationRules || validationRules.length === 0) return;
    
    const result = validate(value, validationRules);
    setInternalError(result.isValid ? undefined : result.error);
    onValidationChange?.(result.isValid, result.error);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    if (validateOnBlur) {
      validateField(e.target.value);
    }
    props.onBlur?.(e);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validateOnChange && touched) {
      validateField(e.target.value);
    }
    props.onChange?.(e);
  };
  
  useEffect(() => {
    if (validationRules && touched) {
      validateField(props.value);
    }
  }, [props.value]);
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-dark-1 mb-2">
        {label}
        {hint && <span className="text-xs text-gray-medium font-medium block">{hint}</span>}
      </label>
      <input
        className={`w-full px-4 py-2 font-medium border rounded-lg focus:ring-2 focus:ring-[#C8DA47] focus:border-[#C8DA47] ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
        } ${
          isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''
        } ${className}`}
        {...props}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};