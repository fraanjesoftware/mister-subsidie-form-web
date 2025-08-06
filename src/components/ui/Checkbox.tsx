import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
}

export const Checkbox = ({ label, className = '', ...props }: CheckboxProps) => {
  return (
    <label className="flex items-start cursor-pointer">
      <input
        type="checkbox"
        className={`mt-0.5 mr-3 flex-shrink-0 w-5 h-5 text-[#C8DA47] rounded focus:ring-2 focus:ring-[#C8DA47] border-gray-300 checked:bg-[#C8DA47] checked:border-[#C8DA47] ${className}`}
        {...props}
      />
      <span className="text-sm text-gray-dark-1 font-medium leading-5">{label}</span>
    </label>
  );
};