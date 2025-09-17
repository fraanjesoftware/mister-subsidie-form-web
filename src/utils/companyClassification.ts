import { FormData } from '../types';

type ClassificationColor = 'green' | 'blue' | 'purple';

export interface CompanyClassification {
  type: Exclude<FormData['ondernemingType'], ''>;
  label: string;
  color: ClassificationColor;
  criteria: string;
}

export const getCompanyClassification = (
  fte: number,
  omzet: number,
  balans: number
): CompanyClassification | null => {
  if (omzet > 50_000_000 && balans > 43_000_000) {
    return {
      type: 'groot',
      label: 'Grote onderneming',
      color: 'purple',
      criteria: 'Jaaromzet > €50 miljoen EN balanstotaal > €43 miljoen',
    };
  }

  if (fte >= 250) {
    return {
      type: 'groot',
      label: 'Grote onderneming',
      color: 'purple',
      criteria: '250 of meer werknemers',
    };
  }

  if (fte < 50 && omzet > 10_000_000 && balans > 10_000_000) {
    return {
      type: 'middelgroot',
      label: 'Middelgrote onderneming',
      color: 'blue',
      criteria: 'Minder dan 50 werknemers maar jaaromzet EN balanstotaal > €10 miljoen',
    };
  }

  if (fte < 50 && (omzet <= 10_000_000 || balans <= 10_000_000)) {
    return {
      type: 'klein',
      label: 'Kleine onderneming',
      color: 'green',
      criteria: 'Minder dan 50 werknemers EN jaaromzet of balanstotaal ≤ €10 miljoen',
    };
  }

  if (fte < 250 && (omzet <= 50_000_000 || balans <= 43_000_000)) {
    return {
      type: 'middelgroot',
      label: 'Middelgrote onderneming',
      color: 'blue',
      criteria: 'Minder dan 250 werknemers EN jaaromzet ≤ €50 miljoen OF balanstotaal ≤ €43 miljoen',
    };
  }

  if (fte > 0 || omzet > 0 || balans > 0) {
    return {
      type: 'groot',
      label: 'Grote onderneming',
      color: 'purple',
      criteria: 'Overige ondernemingen',
    };
  }

  return null;
};

export const getCompanyType = (
  fte: number,
  omzet: number,
  balans: number
): FormData['ondernemingType'] => getCompanyClassification(fte, omzet, balans)?.type ?? '';

export const getCompanySizeLabel = (type: FormData['ondernemingType']): string => {
  switch (type) {
    case 'klein':
      return 'Klein (< 50 medewerkers)';
    case 'middelgroot':
      return 'Middelgroot (50-250 medewerkers)';
    case 'groot':
      return 'Groot (> 250 medewerkers)';
    default:
      return 'Klein (< 50 medewerkers)';
  }
};

export const getCompanyRadioValue = (type: FormData['ondernemingType']): string => {
  switch (type) {
    case 'klein':
      return 'kleine';
    case 'middelgroot':
      return 'middel';
    case 'groot':
      return 'grote';
    default:
      return 'kleine';
  }
};
