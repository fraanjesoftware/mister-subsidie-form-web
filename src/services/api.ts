import type { FormData } from '../types';
import { getApiBaseUrl, getFunctionCode } from '../config/api';

/**
 * API Service - Single responsibility for all backend communication
 * Following SOLID principles - all API calls in one place
 */

interface ApiResponse {
  success: boolean;
  error?: string;
}

/**
 * Submits company data to backend
 * Backend creates folder and generates Excel file
 */
export const submitCompanyData = async (
  formData: FormData,
  applicationId: string,
  tenantId: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/api/submitCompanyData?code=${getFunctionCode()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, applicationId, tenantId }),
      }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return await response.json();
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
  metadata: { kvkNummer: string; bedrijfsnaam: string }
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('applicationId', applicationId);
    formData.append('kvkNummer', metadata.kvkNummer);
    formData.append('bedrijfsnaam', metadata.bedrijfsnaam);

    const response = await fetch('/api/bankStatements', {
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
