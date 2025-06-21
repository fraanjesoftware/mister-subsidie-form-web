import { FormData } from '../../types';
import { Input, Alert } from '../ui';

interface CompanySizeProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
}

export const CompanySize = ({ formData, onInputChange }: CompanySizeProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Bedrijfsomvang</h3>
        <p className="text-gray-600 mb-6">Deze gegevens bepalen of uw onderneming als klein, middelgroot of groot wordt geclassificeerd.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="number"
          label="Aantal werkzame personen (FTE) *"
          value={formData.aantalFte}
          onChange={(e) => onInputChange('aantalFte', e.target.value)}
          placeholder="0"
          min="0"
        />
        
        <Input
          type="number"
          label="Laatst afgesloten boekjaar"
          value={formData.laatsteBoekjaar}
          onChange={(e) => onInputChange('laatsteBoekjaar', e.target.value)}
          placeholder="2023"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jaaromzet (€) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">€</span>
            <input
              type="number"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.jaaromzet}
              onChange={(e) => onInputChange('jaaromzet', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Balanstotaal (€) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">€</span>
            <input
              type="number"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.balanstotaal}
              onChange={(e) => onInputChange('balanstotaal', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </div>
      
      {formData.ondernemingType && (
        <Alert type="info">
          <p className="font-medium text-blue-900">
            Op basis van de ingevoerde gegevens wordt uw onderneming geclassificeerd als:
          </p>
          <p className="text-lg font-semibold text-blue-900 mt-1">
            {formData.ondernemingType === 'klein' && 'Kleine onderneming'}
            {formData.ondernemingType === 'middelgroot' && 'Middelgrote onderneming'}
            {formData.ondernemingType === 'groot' && 'Grote onderneming'}
          </p>
        </Alert>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3">Classificatie criteria:</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="font-medium mr-2">Klein:</span>
            <span>&lt; 50 FTE EN (jaaromzet ≤ €10 miljoen OF balanstotaal ≤ €10 miljoen)</span>
          </div>
          <div className="flex items-start">
            <span className="font-medium mr-2">Middelgroot:</span>
            <span>&lt; 250 FTE EN (jaaromzet ≤ €50 miljoen OF balanstotaal ≤ €43 miljoen)</span>
          </div>
          <div className="flex items-start">
            <span className="font-medium mr-2">Groot:</span>
            <span>≥ 250 FTE OF (jaaromzet &gt; €50 miljoen EN balanstotaal &gt; €43 miljoen)</span>
          </div>
        </div>
      </div>
    </div>
  );
};