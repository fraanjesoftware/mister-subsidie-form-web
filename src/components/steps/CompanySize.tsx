import { FormData } from '../../types';
import { Input, Alert, Card } from '../ui';
import { Calculator, Users, Euro, FileText } from 'lucide-react';
import { validators } from '../../utils/validation';

interface CompanySizeProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
}

export const CompanySize = ({ formData, onInputChange }: CompanySizeProps) => {
  // Format currency input
  const formatCurrency = (value: string): string => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Convert to number and format
    if (numericValue === '') return '';
    const num = parseInt(numericValue);
    return new Intl.NumberFormat('nl-NL').format(num);
  };
  
  // Handle currency input change
  const handleCurrencyChange = (field: 'jaaromzet' | 'balanstotaal', value: string) => {
    // Store only numeric value
    const numericValue = value.replace(/\D/g, '');
    onInputChange(field, numericValue);
  };
  
  // Get classification details
  const getClassificationDetails = () => {
    const fte = parseInt(formData.aantalFte) || 0;
    const omzet = parseInt(formData.jaaromzet) || 0;
    const balans = parseInt(formData.balanstotaal) || 0;
    
    // Groot bedrijf: jaaromzet > 50M EN balanstotaal > 43M
    if (omzet > 50000000 && balans > 43000000) {
      return {
        type: 'groot',
        label: 'Grote onderneming',
        color: 'purple',
        criteria: 'Jaaromzet > €50 miljoen EN balanstotaal > €43 miljoen'
      };
    }
    // Groot bedrijf: 250 of meer werknemers
    else if (fte >= 250) {
      return {
        type: 'groot',
        label: 'Grote onderneming',
        color: 'purple',
        criteria: '250 of meer werknemers'
      };
    }
    // Middelgroot: FTE < 50 maar jaaromzet EN balanstotaal > 10M
    else if (fte < 50 && omzet > 10000000 && balans > 10000000) {
      return {
        type: 'middelgroot',
        label: 'Middelgrote onderneming',
        color: 'blue',
        criteria: 'Minder dan 50 werknemers maar jaaromzet EN balanstotaal > €10 miljoen'
      };
    }
    // Klein bedrijf: < 50 FTE en (omzet ≤ 10M of balans ≤ 10M)
    else if (fte < 50 && (omzet <= 10000000 || balans <= 10000000)) {
      return {
        type: 'klein',
        label: 'Kleine onderneming',
        color: 'green',
        criteria: 'Minder dan 50 werknemers EN jaaromzet of balanstotaal ≤ €10 miljoen'
      };
    }
    // Middelgroot: < 250 FTE en (omzet ≤ 50M of balans ≤ 43M)
    else if (fte < 250 && (omzet <= 50000000 || balans <= 43000000)) {
      return {
        type: 'middelgroot',
        label: 'Middelgrote onderneming',
        color: 'blue',
        criteria: 'Minder dan 250 werknemers EN jaaromzet ≤ €50 miljoen OF balanstotaal ≤ €43 miljoen'
      };
    }
    // Default to groot if any values are filled
    else if (fte > 0 || omzet > 0 || balans > 0) {
      return {
        type: 'groot',
        label: 'Grote onderneming',
        color: 'purple',
        criteria: 'Overige ondernemingen'
      };
    }
    return null;
  };
  
  const classification = getClassificationDetails();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Bedrijfsomvang</h3>
        <p className="text-gray-600 mb-6">Vul de gegevens van het laatst afgesloten boekjaar in. Deze bepalen de classificatie van uw onderneming.</p>
      </div>
      
      <Alert type="info">
        <div className="flex items-start">
          <div>
            <p className="font-medium text-blue-900">Waarom hebben we deze informatie nodig?</p>
            <p className="text-sm text-blue-800 mt-1">
              De grootte van uw onderneming bepaalt de hoogte van de subsidie en de voorwaarden. 
              Gebruik de cijfers uit uw laatst goedgekeurde jaarrekening.
            </p>
          </div>
        </div>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex items-center mb-3">
            <Users className="w-5 h-5 text-gray-600 mr-2" />
            <h4 className="font-medium text-gray-700">Werknemers</h4>
          </div>
          <Input
            type="number"
            label="Aantal werkzame personen (FTE) *"
            value={formData.aantalFte}
            onChange={(e) => onInputChange('aantalFte', e.target.value)}
            placeholder="0"
            min="0"
            step="1"
            validationRules={[validators.required(), validators.positiveInteger(), validators.maxValue(999999)]}
          />
          <p className="text-xs text-gray-500 mt-1">
            Gemiddeld aantal werknemers in fulltime equivalenten
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center mb-3">
            <FileText className="w-5 h-5 text-gray-600 mr-2" />
            <h4 className="font-medium text-gray-700">Boekjaar</h4>
          </div>
          <Input
            type="number"
            label="Laatst afgesloten boekjaar *"
            value={formData.laatsteBoekjaar}
            onChange={(e) => onInputChange('laatsteBoekjaar', e.target.value)}
            placeholder={`${new Date().getFullYear() - 1}`}
            min="2020"
            max={new Date().getFullYear()}
            validationRules={[validators.required(), validators.yearRange(2020, new Date().getFullYear())]}
          />
          <p className="text-xs text-gray-500 mt-1">
            Het jaar waarop de cijfers betrekking hebben
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center mb-3">
            <Euro className="w-5 h-5 text-gray-600 mr-2" />
            <h4 className="font-medium text-gray-700">Jaaromzet</h4>
          </div>
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-dark-1 mb-2">
                Jaaromzet (€) *
                <span className="text-xs text-gray-medium font-medium block">Netto-omzet uit het laatst afgesloten boekjaar</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">€</span>
                <input
                  type="text"
                  className="w-full pl-8 pr-4 py-2 font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8DA47] focus:border-[#C8DA47]"
                  value={formatCurrency(formData.jaaromzet)}
                  onChange={(e) => handleCurrencyChange('jaaromzet', e.target.value)}
                  placeholder="0"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center mb-3">
            <Calculator className="w-5 h-5 text-gray-600 mr-2" />
            <h4 className="font-medium text-gray-700">Balanstotaal</h4>
          </div>
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-dark-1 mb-2">
                Balanstotaal (€) *
                <span className="text-xs text-gray-medium font-medium block">Totaal van alle activa op de balans</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">€</span>
                <input
                  type="text"
                  className="w-full pl-8 pr-4 py-2 font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8DA47] focus:border-[#C8DA47]"
                  value={formatCurrency(formData.balanstotaal)}
                  onChange={(e) => handleCurrencyChange('balanstotaal', e.target.value)}
                  placeholder="0"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      
      
      {classification && (
        <Card className={`border-2 ${
          classification.color === 'green' ? 'border-green-500 bg-green-50' :
          classification.color === 'blue' ? 'border-blue-500 bg-blue-50' :
          'border-purple-500 bg-purple-50'
        }`}>
          <div className="p-4">
            <p className="font-medium text-gray-700 mb-2">
              Uw classificatie:
            </p>
            <p className={`text-xl font-bold mb-3 ${
              classification.color === 'green' ? 'text-green-700' :
              classification.color === 'blue' ? 'text-blue-700' :
              'text-purple-700'
            }`}>
              {classification.label}
            </p>
            <p className="text-sm text-gray-600">
              {classification.criteria}
            </p>
          </div>
        </Card>
      )}
      
      <details className="bg-gray-50 rounded-lg">
        <summary className="p-4 cursor-pointer hover:bg-gray-100 rounded-lg font-medium text-gray-700">
          Hoe wordt de bedrijfsgrootte bepaald?
        </summary>
        <div className="px-4 pb-4 space-y-3">
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="font-semibold text-green-700">Kleine onderneming</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-5">
              <li>• Minder dan 50 werknemers (FTE)</li>
              <li>• EN jaaromzet ≤ €10 miljoen OF balanstotaal ≤ €10 miljoen</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="font-semibold text-blue-700">Middelgrote onderneming</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-5">
              <li>• Minder dan 250 werknemers (FTE)</li>
              <li>• EN jaaromzet ≤ €50 miljoen OF balanstotaal ≤ €43 miljoen</li>
              <li>• OF minder dan 50 werknemers met jaaromzet EN balanstotaal &gt; €10 miljoen</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-3 border border-purple-200">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="font-semibold text-purple-700">Grote onderneming</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-5">
              <li>• 250 of meer werknemers (FTE)</li>
              <li>• OF jaaromzet &gt; €50 miljoen EN balanstotaal &gt; €43 miljoen</li>
            </ul>
          </div>
        </div>
      </details>
    </div>
  );
};