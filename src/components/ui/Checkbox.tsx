import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
}

export const Checkbox = ({ label, className = '', ...props }: CheckboxProps) => {
  return (
    <label className="flex items-start space-x-3 cursor-pointer">
      <input
        type="checkbox"
        className={`mt-1 w-5 h-5 text-[#C8DA47] rounded focus:ring-2 focus:ring-[#C8DA47] border-gray-300 checked:bg-[#C8DA47] checked:border-[#C8DA47] ${className}`}
        {...props}
      />
      <span className="text-sm text-gray-dark-1 font-medium">{label}</span>
    </label>
  );
};