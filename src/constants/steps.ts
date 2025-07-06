import { IconBuilding, IconFileCheck, IconCalculator, IconCircleCheck, IconTaxEuro, IconWritingSign,  } from '@tabler/icons-react';
import { Step } from '../types';

export const STEPS: Step[] = [
  { title: 'Bedrijfsgegevens', icon: IconBuilding, description: 'Algemene informatie over uw onderneming' },
  { title: 'Bestuurder(s)', icon: IconFileCheck, description: 'Gegevens van bevoegde personen' },
  { title: 'Bedrijfsomvang', icon: IconCalculator, description: 'FTE, omzet en balans voor MKB-classificatie' },
  { title: 'Staatssteun', icon: IconTaxEuro, description: 'De-minimis verklaring' },
  { title: 'Controleren', icon: IconCircleCheck, description: 'Overzicht en bevestiging' },
  { title: 'Machtiging', icon: IconWritingSign, description: 'Toestemming voor Mistersubsidie' },
];