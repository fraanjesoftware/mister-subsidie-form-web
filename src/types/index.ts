export interface Bestuurder {
  voorletters: string;
  achternaam: string;
  functie: string;
  email: string;
  volledigeNaam: string;
  nodig?: boolean;
}

export interface FormData {
  // Algemene bedrijfsgegevens
  bedrijfsnaam: string;
  kvkNummer: string;
  email: string;
  adres: string;
  postcode: string;
  plaats: string;
  btwId: string;
  website: string;
  provincie: string;

  // Contact informatie
  contactNaam: string;
  contactTelefoon: string;
  contactGeslacht: '' | 'dhr' | 'mvr' | 'anders';
  hoofdcontactPersoon: '' | 'Wout' | 'Tim' | 'Nathalie';

  // Bestuurder gegevens
  bestuurder1: Bestuurder;
  bestuurder2: Bestuurder;

  // Bankgegevens
  bankStatement: File | null;
  bankStatementConsent: boolean;
  bankStatementUploaded: boolean;

  // MKB gegevens
  aantalFte: string;
  laatsteBoekjaar: number;
  jaaromzet: string;
  balanstotaal: string;
  naceClassificatie: string;

  // De-minimis
  deMinimisType: 'geen' | 'wel' | 'andere';
  deMinimisAmount: string;
  andereStaatssteunAmount: string;
  andereStaatssteunDatum: string;

  // Machtiging
  akkoordMachtiging: boolean;
  akkoordWaarheid: boolean;
  machtigingIndienen: boolean;
  machtigingHandelingen: boolean;
  machtigingBezwaar: boolean;

  // Meta
  ondernemingType: '' | 'klein' | 'middelgroot' | 'groot';
  datum: string;
}

export type StepKey =
  | 'companyDetails'
  | 'directors'
  | 'bankStatement'
  | 'companySize'
  | 'stateAid'
  | 'authorization';

export interface Step {
  key: StepKey;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}
