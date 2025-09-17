import { FormData } from '../types';
import {
  TemplateSigningSession,
  Signer,
  createTextTab,
  createRadioGroup
} from '../types/sign';
import { formatCurrency, sanitizeNumericInput } from './numberFormat';
import { getCompanySizeLabel, getCompanyRadioValue } from './companyClassification';

// Build signing session data for SignWell API
export const buildSigningSession = (
  formData: FormData,
  templateId: string
): TemplateSigningSession => {
  const signers: Signer[] = [];
  
  // Format date
  const formatDate = (): string => {
    return new Date().toLocaleDateString('nl-NL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    }).replace(/\//g, '-');
  };
  
  // Format date from YYYY-MM-DD to dd/mm/yyyy
  const formatDateInput = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };
  
  // Primary signer
  const primarySignerName = formData.bestuurder1.volledigeNaam || 
                          `${formData.bestuurder1.voorletters} ${formData.bestuurder1.achternaam}`.trim();
  
  const primarySigner: Signer = {
    email: formData.bestuurder1.email || formData.email,
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
          getCompanyRadioValue(formData.ondernemingType),
          ['kleine', 'middel', 'grote']
        )
      ],
      textTabs: [
        // Only include minimis-2.1 when 'wel' is selected
        ...(formData.deMinimisType === 'wel' ? [
          createTextTab('minimis-2.1', sanitizeNumericInput(formData.deMinimisAmount) || '0')
        ] : []),
        // Only include minimis-3.1 and 3.2 when 'andere' is selected
        ...(formData.deMinimisType === 'andere' ? [
          createTextTab('minimis-3.1', sanitizeNumericInput(formData.andereStaatssteunAmount) || '0'),
          createTextTab('minimis-3.2', formatDateInput(formData.andereStaatssteunDatum || ''))
        ] : []),
        createTextTab('bedrijfsnaam', formData.bedrijfsnaam),
        createTextTab('naam', primarySignerName),
        createTextTab('functie', formData.bestuurder1.functie),
        createTextTab('email', formData.bestuurder1.email || formData.email),
        createTextTab('voorletters-tekenbevoegde', formData.bestuurder1.voorletters),
        createTextTab('achternaam-tekenbevoegde', formData.bestuurder1.achternaam),
        createTextTab('functie-tekenbevoegde', formData.bestuurder1.functie),
        createTextTab('voorletters-tekenbevoegde-2', formData.bestuurder2.voorletters),
        createTextTab('achternaam-tekenbevoegde-2', formData.bestuurder2.achternaam),
        createTextTab('functie-tekenbevoegde-2', formData.bestuurder2.functie),
        createTextTab('nace', formData.naceClassificatie || ''),
        createTextTab('kvk', formData.kvkNummer),
        createTextTab('onderneming-adres', formData.adres),
        createTextTab('postcode', formData.postcode),
        createTextTab('plaats', formData.plaats),
        createTextTab('fte', formData.aantalFte),
        createTextTab('jaaromzet', formatCurrency(formData.jaaromzet, { withSymbol: true })),
        createTextTab('balanstotaal', formatCurrency(formData.balanstotaal, { withSymbol: true })),
        createTextTab('boekjaar', `${formData.laatsteBoekjaar}`),
        createTextTab('datum', formatDate()),
        
      ],
      listTabs: [
        {
          tabLabel: 'CompanySize',
          value: getCompanySizeLabel(formData.ondernemingType)
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
      email: formData.bestuurder2.email || formData.email,
      name: secondarySignerName,
      roleName: 'SecondSigner',
      tabs: {
        textTabs: [
          
        ]
      }
    };
    
    signers.push(secondarySigner);
  }
  
  return {
    templateId,
    signers,
    returnUrl: window.location.origin + '/bedankt'
  };
};
