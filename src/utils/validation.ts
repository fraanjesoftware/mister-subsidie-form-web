export type ValidationRule = {
  validate: (value: any) => boolean;
  message: string;
};

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

// Reusable validation functions
export const validators = {
  required: (message = 'Dit veld is verplicht'): ValidationRule => ({
    validate: (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'number') return !isNaN(value);
      return value != null;
    },
    message
  }),

  email: (message = 'Voer een geldig e-mailadres in'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Let required handle empty values
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message
  }),

  kvkNumber: (message = 'KvK-nummer moet 8 cijfers zijn'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const cleaned = value.replace(/\D/g, '');
      return cleaned.length === 8;
    },
    message
  }),

  dutchPostcode: (message = 'Postcode moet in formaat 1234 AB zijn'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const postcodeRegex = /^[1-9]\d{3}\s?[A-Z]{2}$/i;
      return postcodeRegex.test(value.replace(/\s/g, ' ').trim());
    },
    message
  }),

  naceCode: (message = 'NACE-code moet 4 cijfers zijn'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const cleaned = value.replace(/\D/g, '');
      return cleaned.length === 4;
    },
    message
  }),

  initials: (message = 'Gebruik alleen letters en punten (bijv. J.M.)'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const initialsRegex = /^[A-Z](\.[A-Z])*\.?$/i;
      return initialsRegex.test(value);
    },
    message
  }),

  lettersOnly: (message = 'Gebruik alleen letters'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const lettersRegex = /^[a-zA-ZÀ-ÿĀ-žÇçÑñ\s\-']+$/;
      return lettersRegex.test(value);
    },
    message
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return value.length >= min;
    },
    message: message || `Minimaal ${min} karakters vereist`
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return value.length <= max;
    },
    message: message || `Maximaal ${max} karakters toegestaan`
  }),

  minValue: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (value === '' || value == null) return true;
      const num = typeof value === 'string' ? parseFloat(value) : value;
      return !isNaN(num) && num >= min;
    },
    message: message || `Waarde moet minimaal ${min} zijn`
  }),

  maxValue: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (value === '' || value == null) return true;
      const num = typeof value === 'string' ? parseFloat(value) : value;
      return !isNaN(num) && num <= max;
    },
    message: message || `Waarde mag maximaal ${max} zijn`
  }),

  yearRange: (min: number, max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const year = parseInt(value);
      return !isNaN(year) && year >= min && year <= max;
    },
    message: message || `Jaar moet tussen ${min} en ${max} liggen`
  }),

  positiveInteger: (message = 'Voer een positief geheel getal in'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const num = parseInt(value);
      return !isNaN(num) && num > 0 && num.toString() === value.toString();
    },
    message
  }),

  dateInPast: (message = 'Datum moet in het verleden liggen'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    message
  }),

  btwId: (message = 'BTW-nummer moet geldig zijn (bijv. NL123456789B01)'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const btwRegex = /^[A-Z]{2}[0-9]{9}B[0-9]{2}$/i;
      return btwRegex.test(value.replace(/\s/g, ''));
    },
    message
  }),

  url: (message = 'Voer een geldige URL in'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      try {
        new URL(value.startsWith('http') ? value : `https://${value}`);
        return true;
      } catch {
        return false;
      }
    },
    message
  }),

  phone: (message = 'Voer een geldig telefoonnummer in'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const cleaned = value.replace(/[\s\-\(\)]/g, '');
      // International phone format: optional +, followed by 7-15 digits
      const phoneRegex = /^\+?[0-9]{7,15}$/;
      return phoneRegex.test(cleaned);
    },
    message
  }),

  dutchHouseNumber: (message = 'Voer een geldig huisnummer in (bijv. 12, 123A, 301B)'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      // Dutch house numbers: digits optionally followed by letters or -letters
      // Examples: 12, 123, 301B, 45-A, 12bis, 34-2
      const houseNumberRegex = /^[1-9]\d{0,4}([A-Za-z]{1,3}|-[A-Za-z0-9]{1,3}|[A-Za-z]{1,3}-\d{1,2})?$/;
      return houseNumberRegex.test(value.trim());
    },
    message
  })
};

// Validate a value against multiple rules
export const validate = (value: any, rules: ValidationRule[]): ValidationResult => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return { isValid: false, error: rule.message };
    }
  }
  return { isValid: true };
};

// Field-specific validation configurations
export const fieldValidations = {
  // Company Details
  bedrijfsnaam: [validators.required(), validators.minLength(2)],
  kvkNummer: [validators.required(), validators.kvkNumber()],
  email: [validators.required(), validators.email()],
  straat: [validators.required(), validators.minLength(2)],
  huisnummer: [validators.required(), validators.dutchHouseNumber()],
  plaats: [validators.required()],
  postcode: [validators.required(), validators.dutchPostcode()],
  naceClassificatie: [validators.required(), validators.naceCode()],
  contactNaam: [validators.required(), validators.minLength(2)],
  contactTelefoon: [validators.required(), validators.phone()],
  hoofdcontactPersoon: [validators.required()],
  
  // Directors
  voorletters: [validators.required(), validators.initials()],
  achternaam: [validators.required(), validators.minLength(2), validators.lettersOnly()],
  directeurEmail: [validators.required(), validators.email()],
  
  // Company Size
  aantalFte: [validators.required(), validators.positiveInteger(), validators.maxValue(999999)],
  laatsteBoekjaar: [
    validators.required(),
    validators.yearRange(2020, new Date().getFullYear())
  ],
  jaaromzet: [validators.required(), validators.minValue(0), validators.maxValue(10000000000)],
  balanstotaal: [validators.required(), validators.minValue(0), validators.maxValue(10000000000)],
  
  // State Aid
  deMinimisAmount: [validators.maxValue(299999, 'Bedrag mag maximaal €299.999 zijn')],
  andereStaatssteunDatum: [validators.dateInPast()]
};

// Validate entire form step
export const validateStep = (stepName: string, formData: any): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  switch (stepName) {
    case 'companyDetails':
      const companyFields = [
        'bedrijfsnaam',
        'kvkNummer',
        'email',
        'straat',
        'huisnummer',
        'plaats',
        'postcode',
        'naceClassificatie',
        'contactNaam',
        'contactTelefoon',
        'hoofdcontactPersoon'
      ] as const;
      companyFields.forEach(field => {
        const rules = fieldValidations[field as keyof typeof fieldValidations];
        if (rules) {
          const result = validate(formData[field], rules);
          if (!result.isValid && result.error) {
            errors[field] = result.error;
          }
        }
      });
      break;
      
    case 'directors':
      // Validate bestuurder1 (always required)
      ['voorletters', 'achternaam', 'email'].forEach(field => {
        const value = formData.bestuurder1?.[field];
        const validationRules = field === 'email' 
          ? fieldValidations.directeurEmail 
          : fieldValidations[field as keyof typeof fieldValidations];
        
        if (validationRules) {
          const result = validate(value, validationRules);
          if (!result.isValid && result.error) {
            errors[`bestuurder1.${field}`] = result.error;
          }
        }
      });
      
      // Validate bestuurder2 if enabled
      if (formData.bestuurder2?.nodig) {
        ['voorletters', 'achternaam', 'email'].forEach(field => {
          const value = formData.bestuurder2?.[field];
          const validationRules = field === 'email' 
            ? fieldValidations.directeurEmail 
            : fieldValidations[field as keyof typeof fieldValidations];
          
          if (validationRules) {
            const result = validate(value, validationRules);
            if (!result.isValid && result.error) {
              errors[`bestuurder2.${field}`] = result.error;
            }
          }
        });
      }
      break;
      
    case 'companySize':
      ['aantalFte', 'laatsteBoekjaar', 'jaaromzet', 'balanstotaal'].forEach(field => {
        const validationRules = fieldValidations[field as keyof typeof fieldValidations];
        if (validationRules) {
          const result = validate(formData[field], validationRules);
          if (!result.isValid && result.error) {
            errors[field] = result.error;
          }
        }
      });
      break;
      
    case 'stateAid':
      if (formData.deMinimisType === 'wel') {
        if (!formData.deMinimisAmount) {
          errors.deMinimisAmount = 'Dit veld is verplicht';
        } else {
          const result = validate(formData.deMinimisAmount, fieldValidations.deMinimisAmount);
          if (!result.isValid && result.error) {
            errors.deMinimisAmount = result.error;
          }
        }
      }
      
      if (formData.deMinimisType === 'andere') {
        if (!formData.andereStaatssteunAmount) {
          errors.andereStaatssteunAmount = 'Dit veld is verplicht';
        }
        
        if (formData.andereStaatssteunDatum) {
          const result = validate(formData.andereStaatssteunDatum, fieldValidations.andereStaatssteunDatum);
          if (!result.isValid && result.error) {
            errors.andereStaatssteunDatum = result.error;
          }
        }
      }
      break;
  }
  
  return errors;
};

