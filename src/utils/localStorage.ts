import { FormData } from '../types';

const STORAGE_KEY = 'mister-subsidie-form-data';

export const saveFormDataToStorage = (formData: FormData): void => {
  try {
    const dataToStore = {
      ...formData,
      bankStatement: null // Don't store file in localStorage
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('Failed to save form data to localStorage:', error);
  }
};

export const loadFormDataFromStorage = (): FormData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load form data from localStorage:', error);
    return null;
  }
};

export const clearFormDataFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear form data from localStorage:', error);
  }
};
