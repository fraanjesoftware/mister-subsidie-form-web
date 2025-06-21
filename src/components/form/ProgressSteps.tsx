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
              <div className={`flex flex-col items-center ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  index < currentStep ? 'bg-blue-600 text-white' : 
                  index === currentStep ? 'bg-blue-600 text-white ring-4 ring-blue-200' : 
                  'bg-gray-200'
                }`}>
                  {index < currentStep ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span className="text-xs font-medium text-center hidden sm:block">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-full h-1 mx-2 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};