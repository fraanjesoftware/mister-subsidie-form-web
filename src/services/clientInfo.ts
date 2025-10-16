import { FormData } from '../types';
import { getApiBaseUrl, getFunctionCode } from '../config/api';

export interface ClientInfoPayload {
  // Bedrijfsinformatie
  bedrijfsnaam: string;
  kvkNummer: string;
  email: string;
  adres: string;
  postcode: string;
  plaats: string;
  btwId: string;
  website: string;
  provincie: string;
  naceClassificatie: string;

  // Contactinformatie
  contactNaam: string;
  contactTelefoon: string;
  contactGeslacht: string;
  hoofdcontactPersoon: string;

  // Metadata
  tenantId?: string;
  datum: string;
}

export interface ClientInfoResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Builds the client info payload from form data
 * Following DRY principle - single source of truth for data extraction
 */
export const buildClientInfoPayload = (
  formData: FormData,
  tenantId?: string
): ClientInfoPayload => {
  return {
    // Bedrijfsinformatie
    bedrijfsnaam: formData.bedrijfsnaam,
    kvkNummer: formData.kvkNummer,
    email: formData.email,
    adres: formData.adres,
    postcode: formData.postcode,
    plaats: formData.plaats,
    btwId: formData.btwId,
    website: formData.website,
    provincie: formData.provincie,
    naceClassificatie: formData.naceClassificatie,

    // Contactinformatie
    contactNaam: formData.contactNaam,
    contactTelefoon: formData.contactTelefoon,
    contactGeslacht: formData.contactGeslacht,
    hoofdcontactPersoon: formData.hoofdcontactPersoon,

    // Metadata
    tenantId,
    datum: formData.datum,
  };
};

/**
 * Submits client info to the backend CRM system
 * This data is separate from the SignWell document submission
 */
export const submitClientInfo = async (
  formData: FormData,
  tenantId?: string
): Promise<ClientInfoResponse> => {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const functionCode = getFunctionCode();
    const payload = buildClientInfoPayload(formData, tenantId);

    const response = await fetch(
      `${apiBaseUrl}/api/submitClientInfo?code=${functionCode}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting client info:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
