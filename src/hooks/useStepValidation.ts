import { FormData } from '../types';

export const useStepValidation = (formData: FormData) => {
  const isStepValid = (currentStep: number): boolean => {
    switch (currentStep) {
      case 0:
        return !!(formData.bedrijfsnaam && formData.kvkNummer && formData.email && formData.adres && formData.postcode && formData.plaats && formData.naceClassificatie);
      case 1:
        return !!(formData.bestuurder1.voorletters && formData.bestuurder1.achternaam && formData.bestuurder1.functie && formData.bestuurder1.email);
      case 2:
        return !!(formData.aantalFte && formData.jaaromzet && formData.balanstotaal && formData.laatsteBoekjaar);
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