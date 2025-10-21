/**
 * CompanyInfo - Data collected in Step 0 (CompanyDetails)
 * Used for Excel generation and folder creation
 * Only contains fields from the first step
 */
export interface CompanyInfo {
  // Application metadata
  applicationId: string;
  tenantId: string;
  datum: string;
  folderId?: string | null;

  // Bedrijfsinformatie
  bedrijfsnaam: string;
  kvkNummer: string;
  btwId: string;
  website: string;
  adres: string;
  postcode: string;
  plaats: string;
  provincie: string;
  naceClassificatie: string;

  // Contactpersoon
  contactNaam: string;
  contactTelefoon: string;
  contactEmail: string;
  contactGeslacht: 'man' | 'vrouw' | 'anders';
  hoofdcontactPersoon: 'Wout' | 'Tim' | 'Nathalie';
}
