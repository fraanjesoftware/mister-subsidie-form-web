import { useState, useEffect } from 'react';
import { FormData, Bestuurder } from '../types';

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
    
    let type: FormData['ondernemingType'] = '';
    
    // Groot bedrijf: jaaromzet > 50M EN balanstotaal > 43M
    if (omzet > 50000000 && balans > 43000000) {
      type = 'groot';
    }
    // Groot bedrijf: 250 of meer werknemers
    else if (fte >= 250) {
      type = 'groot';
    }
    // Middelgroot: FTE < 50 maar jaaromzet EN balanstotaal > 10M
    else if (fte < 50 && omzet > 10000000 && balans > 10000000) {
      type = 'middelgroot';
    }
    // Klein bedrijf: < 50 FTE en (omzet ≤ 10M of balans ≤ 10M)
    else if (fte < 50 && (omzet <= 10000000 || balans <= 10000000)) {
      type = 'klein';
    }
    // Middelgroot: < 250 FTE en (omzet ≤ 50M of balans ≤ 43M)
    else if (fte < 250 && (omzet <= 50000000 || balans <= 43000000)) {
      type = 'middelgroot';
    }
    // Default to groot if any values are filled
    else if (fte > 0 || omzet > 0 || balans > 0) {
      type = 'groot';
    }
    
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

  // Prefill bestuurder1 email with company email if empty
  useEffect(() => {
    if (formData.email && !formData.bestuurder1.email) {
      setFormData(prev => ({
        ...prev,
        bestuurder1: { ...prev.bestuurder1, email: formData.email }
      }));
    }
  }, [formData.email]);

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