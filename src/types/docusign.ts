// DocuSign Template Signing Session Types

export interface RadioOption {
  value: string;
  selected: string; // "true" | "false" as string
}

export interface RadioGroupTab {
  groupName: string;
  radios: RadioOption[];
}

export interface TextTab {
  tabLabel: string;
  value: string;
}

export interface CheckboxTab {
  tabLabel: string;
  selected: string; // "true" | "false" as string
}

export interface ListTab {
  tabLabel: string;
  value: string;
}

export interface SignerTabs {
  radioGroupTabs?: RadioGroupTab[];
  textTabs?: TextTab[];
  checkboxTabs?: CheckboxTab[];
  listTabs?: ListTab[];
}

export interface Signer {
  email: string;
  name: string;
  roleName: 'Applicant' | 'SecondSigner';
  tabs?: SignerTabs;
}

export interface TemplateSigningSession {
  templateId: string;
  signers: Signer[];
  returnUrl: string;
  forEmbedding?: boolean;
}

// Helper type for creating type-safe tab labels
export type TextTabLabel = 
  | 'minimis-2.1'
  | 'minimis-3.1'
  | 'minimis-3.2'
  | 'bedrijfsnaam'
  | 'naam'
  | 'functie'
  | 'email'
  | 'voorletters-tekenbevoegde'
  | 'achternaam-tekenbevoegde'
  | 'functie-tekenbevoegde'
  | 'voorletters-tekenbevoegde-2'
  | 'achternaam-tekenbevoegde-2'
  | 'functie-tekenbevoegde-2'
  | 'nace'
  | 'kvk'
  | 'onderneming-adres'
  | 'postcode'
  | 'plaats'
  | 'fte'
  | 'jaaromzet'
  | 'balanstotaal'
  | 'boekjaar'
  | 'datum';

export type RadioGroupName = 
  | 'de-minimis-radio'
  | 'onderneming-type';

export type CompanySizeValue = 
  | 'Klein (< 50 medewerkers)'
  | 'Middelgroot (50-250 medewerkers)'
  | 'Groot (> 250 medewerkers)';

// Helper functions for type-safe creation
export const createTextTab = (label: TextTabLabel, value: string): TextTab => ({
  tabLabel: label,
  value
});

export const createRadioGroup = (
  groupName: RadioGroupName, 
  selectedValue: string,
  options: string[]
): RadioGroupTab => ({
  groupName,
  radios: options.map(value => ({
    value,
    selected: value === selectedValue ? "true" : "false"
  }))
});

// Response type
export interface TemplateSigningSessionResponse {
  success?: boolean;
  envelopeId?: string;
  signingUrl?: string;
  error?: string;
  message?: string;
  validationErrors?: string[];
}