import { CheckCircle } from 'lucide-react';
import { Step } from '../../types';

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex items-center">
              <div className={`flex flex-col items-center ${index <= currentStep ? 'text-accent' : 'text-gray-medium'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  index < currentStep ? 'bg-accent text-primary' : 
                  index === currentStep ? 'bg-accent text-primary ring-4 ring-accent-light-2' : 
                  'bg-gray-light-1'
                }`}>
                  {index < currentStep ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span className="text-xs font-medium text-center hidden sm:block">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-full h-1 mx-2 ${
                  index < currentStep ? 'bg-accent' : 'bg-gray-light-1'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};