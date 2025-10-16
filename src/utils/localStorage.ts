import { FormData } from '../types';

/**
 * Serializes FormData for localStorage storage
 * Files cannot be stored in localStorage, so we exclude them
 */
export const serializeFormData = (formData: FormData): string => {
  const serializable = { ...formData };

  // Remove File object - cannot be serialized
  // The bankStatementUploaded flag will track if it was sent to the API
  if (formData.bankStatement instanceof File) {
    (serializable as any).bankStatement = null;
  }

  return JSON.stringify(serializable);
};

/**
 * Deserializes FormData from localStorage
 * Note: Files cannot be restored from localStorage
 */
export const deserializeFormData = (jsonString: string): Partial<FormData> => {
  const parsed = JSON.parse(jsonString);

  // Ensure bankStatement is null (files can't be persisted)
  parsed.bankStatement = null;

  return parsed;
};

/**
 * Saves form data to localStorage with proper file handling
 */
export const saveFormDataToStorage = (formData: FormData): void => {
  try {
    const serialized = serializeFormData(formData);
    localStorage.setItem('slimFormDataDraft', serialized);
  } catch (error) {
    console.error('Error saving form data to localStorage:', error);
  }
};

/**
 * Loads form data from localStorage with proper file handling
 */
export const loadFormDataFromStorage = (): Partial<FormData> | null => {
  try {
    const savedData = localStorage.getItem('slimFormDataDraft');
    if (!savedData) {
      return null;
    }
    return deserializeFormData(savedData);
  } catch (error) {
    console.error('Error loading form data from localStorage:', error);
    return null;
  }
};
