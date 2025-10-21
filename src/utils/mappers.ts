import type { FormData } from '../types';
import type { CompanyInfo } from '../types/companyInfo';

/**
 * Maps FormData to CompanyInfo
 * Extracts only Step 0 (CompanyDetails) fields for backend submission
 * Simple extraction - no complex logic needed
 */
export const mapFormDataToCompanyInfo = (
  formData: FormData,
  applicationId: string,
  tenantId: string
): CompanyInfo => {
  return {
    // Application metadata
    applicationId,
    tenantId,
    datum: formData.datum,

    // Bedrijfsinformatie (Step 0 only)
    bedrijfsnaam: formData.bedrijfsnaam,
    kvkNummer: formData.kvkNummer,
    btwId: formData.btwId,
    website: formData.website,
    adres: formData.adres,
    postcode: formData.postcode,
    plaats: formData.plaats,
    provincie: formData.provincie,
    naceClassificatie: formData.naceClassificatie,

    // Contactpersoon (Step 0 only)
    contactNaam: formData.contactNaam,
    contactTelefoon: formData.contactTelefoon,
    contactEmail: formData.email,
    contactGeslacht: formData.contactGeslacht || 'anders',
    hoofdcontactPersoon: formData.hoofdcontactPersoon || 'Wout',
  };
};
