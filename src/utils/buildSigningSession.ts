import { FormData } from '../types';
import { 
  TemplateSigningSession, 
  Signer, 
  createTextTab, 
  createRadioGroup 
} from '../types/docusign';

export const buildSigningSession = (
  formData: FormData,
  templateId: string
): TemplateSigningSession => {
  const signers: Signer[] = [];
  
  // Format currency values
  const formatCurrency = (value: string): string => {
    const num = parseInt(value.replace(/[^\d]/g, '')) || 0;
    return new Intl.NumberFormat('nl-NL', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };
  
  // Format date
  const formatDate = (): string => {
    return new Date().toLocaleDateString('nl-NL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    }).replace(/\//g, '-');
  };
  
  // Determine company size value
  const getCompanySizeValue = (): string => {
    switch (formData.ondernemingType) {
      case 'klein': return 'Klein (< 50 medewerkers)';
      case 'middelgroot': return 'Middelgroot (50-250 medewerkers)';
      case 'groot': return 'Groot (> 250 medewerkers)';
      default: return 'Klein (< 50 medewerkers)';
    }
  };
  
  // Map company type to radio values
  const getOndernemingRadioValue = (): string => {
    switch (formData.ondernemingType) {
      case 'klein': return 'kleine';
      case 'middelgroot': return 'middel';
      case 'groot': return 'grote';
      default: return 'kleine';
    }
  };
  
  // Primary signer
  const primarySignerName = formData.bestuurder1.volledigeNaam || 
                          `${formData.bestuurder1.voorletters} ${formData.bestuurder1.achternaam}`.trim();
  
  const primarySigner: Signer = {
    email: formData.email,
    name: primarySignerName,
    roleName: 'Applicant',
    tabs: {
      radioGroupTabs: [
        createRadioGroup(
          'de-minimis-radio',
          formData.deMinimisType,
          ['geen', 'wel', 'andere']
        ),
        createRadioGroup(
          'onderneming-type',
          getOndernemingRadioValue(),
          ['kleine', 'middel', 'grote']
        )
      ],
      textTabs: [
        createTextTab('minimis-2.1', formData.deMinimisType === 'wel' ? 
          formData.deMinimisAmount.replace(/[^\d]/g, '') : '0'),
        createTextTab('bedrijfsnaam', formData.bedrijfsnaam),
        createTextTab('naam', primarySignerName),
        createTextTab('functie', formData.bestuurder1.functie),
        createTextTab('email', formData.email),
        createTextTab('voorletters-tekenbevoegde', formData.bestuurder1.voorletters),
        createTextTab('achternaam-tekenbevoegde', formData.bestuurder1.achternaam),
        createTextTab('functie-tekenbevoegde', formData.bestuurder1.functie),
        createTextTab('nace', formData.naceClassificatie || ''),
        createTextTab('kvk', formData.kvkNummer),
        createTextTab('onderneming-adres', formData.adres),
        createTextTab('postcode', formData.postcode),
        createTextTab('plaats', formData.plaats),
        createTextTab('fte', formData.aantalFte),
        createTextTab('jaaromzet', formatCurrency(formData.jaaromzet)),
        createTextTab('balanstotaal', formatCurrency(formData.balanstotaal)),
        createTextTab('Date', formatDate())
      ],
      listTabs: [
        {
          tabLabel: 'CompanySize',
          value: getCompanySizeValue()
        }
      ]
    }
  };
  
  signers.push(primarySigner);
  
  // Secondary signer if needed
  if (formData.bestuurder2.nodig && formData.bestuurder2.achternaam) {
    const secondarySignerName = formData.bestuurder2.volledigeNaam || 
                              `${formData.bestuurder2.voorletters} ${formData.bestuurder2.achternaam}`.trim();
    
    const secondarySigner: Signer = {
      email: formData.email, // Could be a separate email field if available
      name: secondarySignerName,
      roleName: 'SecondSigner'
      // Note: No tabs for secondary signer based on the example
    };
    
    signers.push(secondarySigner);
  }
  
  return {
    templateId,
    signers,
    returnUrl: window.location.origin + '/',
    forEmbedding: true
  };
};