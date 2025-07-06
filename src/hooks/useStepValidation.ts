import { FormData } from '../types';

export const useStepValidation = (formData: FormData) => {
  const isStepValid = (currentStep: number): boolean => {
    switch (currentStep) {
      case 0:
        return !!(formData.bedrijfsnaam && formData.kvkNummer && formData.email);
      case 1:
        return !!(formData.bestuurder1.voorletters && formData.bestuurder1.achternaam);
      case 2:
        return !!(formData.aantalFte && formData.jaaromzet && formData.balanstotaal);
      case 3:
        return !!formData.deMinimisType;
      case 4: 
      return true;
      case 5:
        return !!(formData.akkoordMachtiging && formData.akkoordWaarheid && 
               formData.machtigingIndienen && formData.machtigingHandelingen && 
               formData.machtigingBezwaar);
      default:
        return true;
    }
  };

  return { isStepValid };
};