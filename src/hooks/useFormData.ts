import { useState, useEffect } from 'react';
import { FormData, Bestuurder } from '../types';
import { getCompanyType } from '../utils/companyClassification';

const initialFormData: FormData = {
  // Algemene bedrijfsgegevens
  bedrijfsnaam: '',
  kvkNummer: '',
  email: '',
  adres: '',
  postcode: '',
  plaats: '',
  
  // Bestuurder gegevens
  bestuurder1: {
    voorletters: '',
    achternaam: '',
    functie: 'Directeur',
    email: '',
    volledigeNaam: ''
  },
  bestuurder2: {
    voorletters: '',
    achternaam: '',
    functie: '',
    email: '',
    volledigeNaam: '',
    nodig: false
  },
  
  // MKB gegevens
  aantalFte: '',
  laatsteBoekjaar: new Date().getFullYear() - 1,
  jaaromzet: '',
  balanstotaal: '',
  naceClassificatie: '',
  
  // De-minimis
  deMinimisType: 'geen',
  deMinimisAmount: '',
  andereStaatssteunAmount: '',
  andereStaatssteunDatum: '',
  
  // Machtiging
  akkoordMachtiging: false,
  akkoordWaarheid: false,
  machtigingIndienen: false,
  machtigingHandelingen: false,
  machtigingBezwaar: false,
  
  // Meta
  ondernemingType: '',
  datum: new Date().toISOString().split('T')[0]
};

export const useFormData = () => {
  // Load form data from localStorage on initialization
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem('slimFormDataDraft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Merge with initial data to handle new fields
        return { ...initialFormData, ...parsed };
      } catch (e) {
        console.error('Error parsing saved form data:', e);
        return initialFormData;
      }
    }
    return initialFormData;
  });

  // Auto-calculate company type based on inputs
  useEffect(() => {
    const fte = parseInt(formData.aantalFte) || 0;
    const omzet = parseInt(formData.jaaromzet) || 0;
    const balans = parseInt(formData.balanstotaal) || 0;

    const type = getCompanyType(fte, omzet, balans);

    if (type !== formData.ondernemingType) {
      setFormData(prev => ({ ...prev, ondernemingType: type }));
    }
  }, [formData.aantalFte, formData.jaaromzet, formData.balanstotaal]);

  // Create full names for bestuurders
  useEffect(() => {
    const naam1 = `${formData.bestuurder1.voorletters} ${formData.bestuurder1.achternaam}`.trim();
    const naam2 = `${formData.bestuurder2.voorletters} ${formData.bestuurder2.achternaam}`.trim();
    
    setFormData(prev => ({
      ...prev,
      bestuurder1: { ...prev.bestuurder1, volledigeNaam: naam1 },
      bestuurder2: { ...prev.bestuurder2, volledigeNaam: naam2 }
    }));
  }, [formData.bestuurder1.voorletters, formData.bestuurder1.achternaam, formData.bestuurder2.voorletters, formData.bestuurder2.achternaam]);


  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('slimFormDataDraft', JSON.stringify(formData));
    }, 500); // Debounce to avoid too many writes
    
    return () => clearTimeout(timeoutId);
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: 'bestuurder1' | 'bestuurder2', field: keyof Bestuurder, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  return {
    formData,
    handleInputChange,
    handleNestedInputChange
  };
};
