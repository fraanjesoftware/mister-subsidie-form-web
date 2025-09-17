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
            <div key={step.key} className="flex items-center">
              <div
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-[var(--color-accent)]' : 'text-gray-400'
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
                  index < currentStep ? 'bg-[var(--color-accent)] text-[var(--color-primary)] hover:ring-2 hover:ring-[var(--color-accent-light-2)]' :
                  index === currentStep ? 'bg-[var(--color-accent)] text-[var(--color-primary)] ring-4 ring-[var(--color-accent-light-2)]' :
                  'bg-[var(--color-gray-light-3)]'
                }`}>
                  {index < currentStep ? <IconCircleCheck className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span className={`text-xs font-medium text-center text-[var(--color-step-text)] hidden sm:block ${
                  onStepClick && index < currentStep ? 'hover:text-[var(--color-accent)]' : ''
                }`}>{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-full h-1 mx-2 ${
                  index < currentStep ? 'bg-[var(--color-accent)]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
