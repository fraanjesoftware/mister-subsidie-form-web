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
              ? 'bg-[#F3F7DA] hover:bg-[#E8EFB5]' 
              : 'hover:bg-gray-50 hover:border-[#DEE790]'
          }`}
          style={{ borderColor: value === option.value ? '#C8DA47' : '#D3D4D3' }}
        >
          <div className="flex items-start space-x-3">
            <input
              type="radio"
              name={name}
              value={option.value}
              className="mt-1 w-4 h-4 text-[#C8DA47]"
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
            />
            <div className="flex-1">
              <p className="font-medium text-gray-dark-1">{option.label}</p>
              {option.description && (
                <p className="text-sm text-gray-dark-2 font-medium mt-1">{option.description}</p>
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