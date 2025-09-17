interface RadioOption {
  value: string;
  label: string;
  description?: string;
  content?: React.ReactNode;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export const RadioGroup = ({ name, options, value, onChange }: RadioGroupProps) => {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <label
          key={option.value}
          className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
            value === option.value
              ? 'border-[var(--color-accent)] bg-[var(--color-accent-light-4)] hover:bg-[var(--color-accent-light-3)]'
              : 'border-[var(--color-gray-light-1)] hover:bg-gray-50 hover:border-[var(--color-accent-light-2)]'
          }`}
        >
          <div className="flex items-start space-x-3">
            <input
              type="radio"
              name={name}
              value={option.value}
              className="mt-1 w-4 h-4 text-[var(--color-accent)]"
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
            />
            <div className="flex-1">
              <p className="font-medium text-[var(--color-gray-dark-1)]">{option.label}</p>
              {option.description && (
                <p className="text-sm text-[var(--color-gray-dark-2)] font-medium mt-1">{option.description}</p>
              )}
              {value === option.value && option.content && (
                <div className="mt-4">{option.content}</div>
              )}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};
