import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface NavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isStepValid: boolean;
}

export const Navigation = ({ 
  currentStep, 
  totalSteps, 
  onPrev, 
  onNext, 
  onSubmit, 
  isStepValid 
}: NavigationProps) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between items-center">
      <button
        onClick={onPrev}
        disabled={currentStep === 0}
        className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
          currentStep === 0
            ? 'bg-gray-light-1 text-gray-medium cursor-not-allowed'
            : 'bg-white text-gray-dark-1 hover:bg-gray-light-2 border border-gray-light-1'
        }`}
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Vorige
      </button>
      
      <div className="text-sm text-gray-medium font-medium">
        Stap {currentStep + 1} van {totalSteps}
      </div>
      
      {!isLastStep ? (
        <button
          onClick={onNext}
          disabled={!isStepValid}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
            isStepValid
              ? 'bg-accent text-primary hover:bg-accent-light-1'
              : 'bg-gray-light-1 text-gray-medium cursor-not-allowed'
          }`}
        >
          Volgende
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={!isStepValid}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
            isStepValid
              ? 'bg-accent text-primary hover:bg-accent-light-1'
              : 'bg-gray-light-1 text-gray-medium cursor-not-allowed'
          }`}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Aanvraag indienen
        </button>
      )}
    </div>
  );
};