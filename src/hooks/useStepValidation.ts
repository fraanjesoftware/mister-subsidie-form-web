import { FormData } from '../types';
import { validateStep } from '../utils/validation';

export const useStepValidation = (formData: FormData) => {
  const isStepValid = (currentStep: number): boolean => {
    const stepNames = ['companyDetails', 'directors', 'companySize', 'stateAid', 'authorization'];
    
    // First check if required fields are filled
    const hasRequiredFields = (() => {
      switch (currentStep) {
        case 0:
          return !!(formData.bedrijfsnaam && formData.kvkNummer && formData.email);
        case 1:
          const bestuurder1Valid = !!(formData.bestuurder1.voorletters && formData.bestuurder1.achternaam && formData.bestuurder1.email);
          if (formData.bestuurder2?.nodig) {
            const bestuurder2Valid = !!(formData.bestuurder2.voorletters && formData.bestuurder2.achternaam && formData.bestuurder2.email);
            return bestuurder1Valid && bestuurder2Valid;
          }
          return bestuurder1Valid;
        case 2:
          return !!(formData.aantalFte && formData.jaaromzet && formData.balanstotaal && formData.laatsteBoekjaar);
        case 3:
          if (formData.deMinimisType === 'wel') {
            return !!(formData.deMinimisType && formData.deMinimisAmount);
          }
          if (formData.deMinimisType === 'andere') {
            return !!(formData.deMinimisType && formData.andereStaatssteunAmount);
          }
          return !!formData.deMinimisType;
        case 4:
          return !!(formData.akkoordMachtiging && formData.akkoordWaarheid && 
                 formData.machtigingIndienen && formData.machtigingHandelingen && 
                 formData.machtigingBezwaar);
        default:
          return true;
      }
    })();
    
    if (!hasRequiredFields) {
      return false;
    }
    
    // Then check validation rules
    if (currentStep < stepNames.length) {
      const errors = validateStep(stepNames[currentStep], formData);
      return Object.keys(errors).length === 0;
    }
    
    return true;
  };

  return { isStepValid };
};