import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface NavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  isStepValid: boolean;
  isLoading?: boolean;
}

export const Navigation = ({ 
  currentStep, 
  totalSteps, 
  onPrev, 
  onNext, 
  isStepValid,
  isLoading = false
}: NavigationProps) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between items-center">
      <button
        onClick={onPrev}
        disabled={currentStep === 0 || isLoading}
        className={`flex items-center px-6 py-3 rounded-2xl font-extrabold transition-all ${
          currentStep === 0 || isLoading
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            : 'text-[var(--color-gray-5)] hover:bg-gray-50 text-[var(--color-step-text)]  cursor-pointer'
        }`}
      >
        <IconChevronLeft className="w-5 h-5 mr-2 " />
        Vorige
      </button>
      
      {/* <div className="text-sm text-[var(--color-gray-medium)] font-medium">
        Stap {currentStep + 1} van {totalSteps}
      </div> */}
      
      {!isLastStep && (
        <button
          onClick={onNext}
          disabled={!isStepValid || isLoading}
          className={`flex items-center px-6 py-3 rounded-2xl font-extrabold transition-all ${
            isStepValid && !isLoading
              ? 'bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-light-4)] hover:outline hover:outline-3 hover:outline-black shadow-sm cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="h-5 w-5 mr-2 animate-spin text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Even geduld...
            </>
          ) : (
            <>
              Volgende
              <IconChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      )}
    </div>
  );
};
