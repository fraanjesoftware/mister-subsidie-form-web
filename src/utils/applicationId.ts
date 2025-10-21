import { FormData } from '../types';

/**
 * Generates application ID from company name and current date
 * Format: CompanyName-dd-mm-yyyy
 * Example: "Voorbeeld BV-21-10-2025"
 */
export const generateApplicationId = (formData: FormData): string => {
  const companyName = formData.bedrijfsnaam || 'Unknown';
  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return `${companyName}-${day}-${month}-${year}`;
};
