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
    volledigeNaam: ''
  },
  bestuurder2: {
    voorletters: '',
    achternaam: '',
    functie: '',
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
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Auto-calculate company type based on inputs
  useEffect(() => {
    const fte = parseInt(formData.aantalFte) || 0;
    const omzet = parseInt(formData.jaaromzet) || 0;
    const balans = parseInt(formData.balanstotaal) || 0;
    
    let type: FormData['ondernemingType'] = '';
    if (fte < 50 && (omzet <= 10000000 || balans <= 10000000)) {
      type = 'klein';
    } else if (fte < 250 && (omzet <= 50000000 || balans <= 43000000)) {
      type = 'middelgroot';
    } else if (fte > 0 || omzet > 0 || balans > 0) {
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