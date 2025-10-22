import { FormData } from '../types';
import { STEP_KEYS } from '../constants/steps';
import { validateStep } from '../utils/validation';

export const useStepValidation = (formData: FormData) => {
  const isFilled = (value: unknown) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    if (typeof value === 'number') {
      return !isNaN(value);
    }
    return !!value;
  };

  const isStepValid = (currentStep: number): boolean => {
    const stepKey = STEP_KEYS[currentStep];

    if (!stepKey) {
      return true;
    }

    // First check if required fields are filled
    const hasRequiredFields = (() => {
      switch (stepKey) {
        case 'companyDetails':
          return (
            isFilled(formData.bedrijfsnaam) &&
            isFilled(formData.kvkNummer) &&
            isFilled(formData.straat) &&
            isFilled(formData.huisnummer) &&
            isFilled(formData.plaats) &&
            isFilled(formData.postcode) &&
            isFilled(formData.email) &&
            isFilled(formData.contactNaam) &&
            isFilled(formData.contactTelefoon) &&
            isFilled(formData.naceClassificatie) &&
            isFilled(formData.hoofdcontactPersoon)
          );
        case 'directors':
          const bestuurder1Valid = !!(formData.bestuurder1.voorletters && formData.bestuurder1.achternaam && formData.bestuurder1.email);
          if (formData.bestuurder2?.nodig) {
            const bestuurder2Valid = !!(formData.bestuurder2.voorletters && formData.bestuurder2.achternaam && formData.bestuurder2.email);
            return bestuurder1Valid && bestuurder2Valid;
          }
          return bestuurder1Valid;
        case 'bankStatement':
          // Valid if file is uploaded to API, or if file is selected with consent
          return formData.bankStatementUploaded || !!(formData.bankStatement && formData.bankStatementConsent);
        case 'companySize':
          return !!(formData.aantalFte && formData.jaaromzet && formData.balanstotaal && formData.laatsteBoekjaar);
        case 'stateAid':
          if (formData.deMinimisType === 'wel') {
            return !!(formData.deMinimisType && formData.deMinimisAmount);
          }
          if (formData.deMinimisType === 'andere') {
            return !!(formData.deMinimisType && formData.andereStaatssteunAmount);
          }
          return !!formData.deMinimisType;
        case 'authorization':
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
    if (stepKey) {
      const errors = validateStep(stepKey, formData);
      return Object.keys(errors).length === 0;
    }

    return true;
  };

  return { isStepValid };
};
