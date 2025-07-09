import { IconChevronLeft, IconChevronRight, IconCircleCheck } from '@tabler/icons-react';

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
        className={`flex items-center px-6 py-3 rounded-2xl font-extrabold transition-all ${
          currentStep === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm cursor-pointer'
        }`}
      >
        <IconChevronLeft className="w-5 h-5 mr-2" />
        Vorige
      </button>
      
      <div className="text-sm text-gray-medium font-medium">
        Stap {currentStep + 1} van {totalSteps}
      </div>
      
      {!isLastStep && (
        <button
          onClick={onNext}
          disabled={!isStepValid}
          className={`flex items-center px-6 py-3 rounded-2xl font-extrabold transition-all ${
            isStepValid
              ? 'bg-[#C8DA47] text-[#03291F] hover:bg-[#F3F7DA] hover:outline hover:outline-3 hover:outline-black shadow-sm cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
          }`}
        >
          Volgende
          <IconChevronRight className="w-5 h-5 ml-2" />
        </button>
      )}
    </div>
  );
};