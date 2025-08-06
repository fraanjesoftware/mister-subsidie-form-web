import { IconCircleCheck } from '@tabler/icons-react';
import { Step } from '../../types';

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export const ProgressSteps = ({ steps, currentStep, onStepClick }: ProgressStepsProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex items-center">
              <div 
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-[#C8DA47]' : 'text-gray-400'
                } ${
                  onStepClick && index < currentStep ? 'cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (onStepClick && index < currentStep) {
                    onStepClick(index);
                  }
                }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                  index < currentStep ? 'bg-[#C8DA47] text-[#03291F] hover:ring-2 hover:ring-[#DEE790]' : 
                  index === currentStep ? 'bg-[#C8DA47] text-[#03291F] ring-4 ring-[#DEE790]' : 
                  'bg-gray-200'
                }`}>
                  {index < currentStep ? <IconCircleCheck className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span className={`text-xs font-medium text-center text-black hidden sm:block ${
                  onStepClick && index < currentStep ? 'hover:text-[#C8DA47]' : ''
                }`}>{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-full h-1 mx-2 ${
                  index < currentStep ? 'bg-[#C8DA47]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};