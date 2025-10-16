import { IconBuilding, IconCalculator, IconFileCheck, IconFileUpload, IconTaxEuro, IconWritingSign } from '@tabler/icons-react';
import { Step, StepKey } from '../types';

export const STEP_KEYS: StepKey[] = [
  'companyDetails',
  'bankStatement',
  'directors',
  'companySize',
  'stateAid',
  'authorization'
];

export const STEPS: Step[] = [
  { key: 'companyDetails', title: 'Bedrijfsgegevens', icon: IconBuilding, description: 'Algemene informatie over uw onderneming' },
  { key: 'bankStatement', title: 'Bankverificatie', icon: IconFileUpload, description: 'Upload van bankafschrift voor verificatie' },
  { key: 'directors', title: 'Bestuurder(s)', icon: IconFileCheck, description: 'Gegevens van bevoegde personen' },
  { key: 'companySize', title: 'Bedrijfsomvang', icon: IconCalculator, description: 'FTE, omzet en balans voor MKB-classificatie' },
  { key: 'stateAid', title: 'Staatssteun', icon: IconTaxEuro, description: 'De-minimis verklaring' },
  { key: 'authorization', title: 'Machtiging', icon: IconWritingSign, description: 'Toestemming voor Mistersubsidie' },
];
