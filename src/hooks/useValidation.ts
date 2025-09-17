import { useState, useCallback } from 'react';
import { validateStep } from '../utils/validation';
import { FormData } from '../types';
import { STEP_KEYS } from '../constants/steps';

export const useValidation = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  const validateCurrentStep = useCallback((stepIndex: number, formData: FormData): boolean => {
    const stepKey = STEP_KEYS[stepIndex];

    if (!stepKey) {
      setValidationErrors({});
      setShowErrors(false);
      return true;
    }

    const errors = validateStep(stepKey, formData);

    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      return false;
    }
    
    setShowErrors(false);
    return true;
  }, []);

  const clearErrors = useCallback(() => {
    setValidationErrors({});
    setShowErrors(false);
  }, []);

  return {
    validationErrors,
    showErrors,
    validateCurrentStep,
    clearErrors
  };
};
