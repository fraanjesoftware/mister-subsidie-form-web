import { FormData, Bestuurder } from '../../types';
import { Input, Card, Alert, Checkbox } from '../ui';

interface DirectorsProps {
  formData: FormData;
  onNestedInputChange: (parent: 'bestuurder1' | 'bestuurder2', field: keyof Bestuurder, value: any) => void;
}

export const Directors = ({ formData, onNestedInputChange }: DirectorsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Bestuurder(s)</h3>
        <p className="text-gray-600 mb-6">Gegevens van de bevoegde personen die de aanvraag ondertekenen.</p>
      </div>
      
      <Alert type="info">
        <p>
          <strong>Let op:</strong> Een bestuurder die zelfstandig bevoegd is (conform KvK) mag alleen tekenen. 
          Bij gezamenlijke bevoegdheid moeten minimaal twee bestuurders tekenen.
        </p>
      </Alert>
      
      <div className="space-y-6">
        <Card>
          <h4 className="font-semibold text-gray-700 mb-4">Bestuurder 1</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Voorletter(s) *"
              value={formData.bestuurder1.voorletters}
              onChange={(e) => onNestedInputChange('bestuurder1', 'voorletters', e.target.value)}
              placeholder="J."
            />
            <Input
              label="Achternaam *"
              value={formData.bestuurder1.achternaam}
              onChange={(e) => onNestedInputChange('bestuurder1', 'achternaam', e.target.value)}
              placeholder="Jansen"
            />
            <div className="md:col-span-2">
              <Input
                label="Functie"
                value={formData.bestuurder1.functie}
                onChange={(e) => onNestedInputChange('bestuurder1', 'functie', e.target.value)}
              />
            </div>
          </div>
        </Card>
        
        <Checkbox
          id="tweede-bestuurder"
          checked={formData.bestuurder2.nodig}
          onChange={(e) => onNestedInputChange('bestuurder2', 'nodig', e.target.checked)}
          label="Er is een tweede bestuurder nodig voor ondertekening"
        />
        
        {formData.bestuurder2.nodig && (
          <Card>
            <h4 className="font-semibold text-gray-700 mb-4">Bestuurder 2</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Voorletter(s)"
                value={formData.bestuurder2.voorletters}
                onChange={(e) => onNestedInputChange('bestuurder2', 'voorletters', e.target.value)}
                placeholder="M."
              />
              <Input
                label="Achternaam"
                value={formData.bestuurder2.achternaam}
                onChange={(e) => onNestedInputChange('bestuurder2', 'achternaam', e.target.value)}
                placeholder="Pietersen"
              />
              <div className="md:col-span-2">
                <Input
                  label="Functie"
                  value={formData.bestuurder2.functie}
                  onChange={(e) => onNestedInputChange('bestuurder2', 'functie', e.target.value)}
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};