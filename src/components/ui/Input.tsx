import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = ({ label, error, hint, className = '', ...props }: InputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-dark-1 mb-2">
        {label}
        {hint && <span className="text-xs text-gray-medium font-medium block">{hint}</span>}
      </label>
      <input
        className={`w-full px-4 py-2 font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8DA47] focus:border-[#C8DA47] ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
};