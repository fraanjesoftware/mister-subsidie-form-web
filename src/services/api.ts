import type { FormData } from '../types';
import type { CompanyInfo } from '../types/companyInfo';
import type { TenantId } from '../hooks/useTenantInfo';
import { getApiBaseUrl, getFunctionCode, getSignWellTemplateId, getOptionalFunctionCode } from '../config/api';
import { buildSigningSession } from '../utils/buildSigningSession';
import { mapFormDataToCompanyInfo } from '../utils/mappers';
import { loadFormDataFromStorage } from '../utils/localStorage';

/**
 * API Service - Single responsibility for all backend communication
 * Following SOLID principles - all API calls in one place
 */

interface ApiResponse {
  success: boolean;
  error?: string;
  folderId?: string;
  applicationId?: string;
}

interface SignWellResponse {
  success?: boolean;
  documentId?: string;
  error?: string;
  message?: string;
  validationErrors?: string[];
}

/**
 * Submits company info from Step 0 to backend
 * Backend creates folder and generates Excel file
 * Uses type-safe CompanyInfo model (Step 0 fields only)
 */
export const submitCompanyInfo = async (
  formData: FormData,
  applicationId: string,
  tenantId: TenantId
): Promise<ApiResponse> => {
  try {
    // Extract only Step 0 fields
    const companyInfo: CompanyInfo = mapFormDataToCompanyInfo(formData, applicationId, tenantId);
    if (!companyInfo.folderId) {
      const stored = loadFormDataFromStorage();
      if (stored?.folderId) {
        companyInfo.folderId = stored.folderId;
      }
    }

    const response = await fetch(
      `${getApiBaseUrl(tenantId)}/api/submitCompanyInfo?code=${getFunctionCode(tenantId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyInfo),
      }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result: ApiResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to submit company data:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Uploads bank statement file to backend
 */
export const uploadBankStatement = async (
  file: File,
  applicationId: string,
  metadata: { kvkNummer: string; bedrijfsnaam: string },
  tenantId: TenantId,
  folderId?: string | null
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('applicationId', applicationId);
    formData.append('kvkNummer', metadata.kvkNummer);
    formData.append('bedrijfsnaam', metadata.bedrijfsnaam);
    const effectiveFolderId = folderId ?? loadFormDataFromStorage()?.folderId ?? undefined;
    if (effectiveFolderId) {
      formData.append('folderId', effectiveFolderId);
    }

    const uploadEndpoint =
        `${getApiBaseUrl(tenantId)}/api/uploadBankStatement?code=${getFunctionCode(tenantId)}`

    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();
    return result.success ?? true;
  } catch (error) {
    console.error('Failed to upload bank statement:', error);

    // Development fallback
    if (import.meta.env.DEV) {
      console.warn('Using mock upload for development');
      return new Promise((resolve) => setTimeout(() => resolve(true), 500));
    }

    return false;
  }
};

/**
 * Creates SignWell signing session
 * Returns success status and error message if failed
 */
export const createSigningSession = async (
  formData: FormData,
  tenantId: TenantId
): Promise<{ success: boolean; error?: string }> => {
  try {
    const signingData = buildSigningSession(formData, getSignWellTemplateId());

    const payload = {
      ...signingData,
      applicationId: formData.applicationId,
      folderId: formData.folderId,
      tenantId,
      test: tenantId === 'test',
    };

    const response = await fetch(
      `${getApiBaseUrl(tenantId)}/api/createSignWellTemplateSession?code=${getFunctionCode(tenantId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result: SignWellResponse = await response.json();

    if (result.success || result.documentId) {
      return { success: true };
    }

    const errorMessage = result.validationErrors?.join(', ') || result.message || result.error || 'Unknown error';
    return { success: false, error: errorMessage };
  } catch (error) {
    console.error('Error calling SignWell API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Onbekende fout',
    };
  }
};

/**
 * Fetches tenant authorization info from backend
 */
export const fetchTenantInfo = async (
  tenantId: string
): Promise<{
  gemachtigde?: string;
  gemachtigde_email?: string;
  gemachtigde_naam?: string;
  gemachtigde_telefoon?: string;
  gemachtigde_kvk?: string;
  meta?: any;
}> => {
  const endpoint = new URL(`${getApiBaseUrl().replace(/\/$/, '')}/api/getAuthorizedRepresentativeInfo`);

  const functionCode = getOptionalFunctionCode();
  if (functionCode) {
    endpoint.searchParams.set('code', functionCode);
  }

  const response = await fetch(endpoint.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: tenantId }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return await response.json();
};
