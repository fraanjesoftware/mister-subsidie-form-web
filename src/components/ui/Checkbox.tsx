import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
}

export const Checkbox = ({ label, className = '', ...props }: CheckboxProps) => {
  return (
    <label className="flex items-start cursor-pointer">
      <input
        type="checkbox"
        className={`mt-0.5 mr-3 flex-shrink-0 w-5 h-5 text-[var(--color-accent)] rounded focus:ring-2 focus:ring-[var(--color-accent)] border-gray-300 checked:bg-[var(--color-accent)] checked:border-[var(--color-accent)] ${className}`}
        {...props}
      />
      <span className="text-sm text-[var(--color-gray-dark-1)] font-medium leading-5">{label}</span>
    </label>
  );
};
