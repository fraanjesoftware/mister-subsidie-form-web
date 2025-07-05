import { Building2, FileCheck, Calculator, Shield, CheckCircle } from 'lucide-react';
import { Step } from '../types';

export const STEPS: Step[] = [
  { title: 'Bedrijfsgegevens', icon: Building2, description: 'Algemene informatie over uw onderneming' },
  { title: 'Bestuurder(s)', icon: FileCheck, description: 'Gegevens van bevoegde personen' },
  { title: 'Bedrijfsomvang', icon: Calculator, description: 'FTE, omzet en balans voor MKB-classificatie' },
  { title: 'Staatssteun', icon: Shield, description: 'De-minimis verklaring' },
  { title: 'Machtiging', icon: FileCheck, description: 'Toestemming voor Mistersubsidie' },
  { title: 'Controleren', icon: CheckCircle, description: 'Overzicht en bevestiging' }
];