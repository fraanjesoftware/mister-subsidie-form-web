import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
}

export const Checkbox = ({ label, className = '', ...props }: CheckboxProps) => {
  return (
    <label className="flex items-start space-x-3 cursor-pointer">
      <input
        type="checkbox"
        className={`mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
};