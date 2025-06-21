import { FormData } from '../../types';
import { Checkbox, Card } from '../ui';

interface AuthorizationProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
}

export const Authorization = ({ formData, onInputChange }: AuthorizationProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Machtiging Mistersubsidie</h3>
        <p className="text-gray-600 mb-6">
          Geef Tim Otte/NOT-Company (handelend onder de naam Mistersubsidie) toestemming om namens uw onderneming 
          de SLIM-subsidie aan te vragen.
        </p>
      </div>
      
      <Card>
        <h4 className="font-semibold text-gray-700 mb-4">Gemachtigde organisatie</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Organisatie:</p>
            <p className="font-medium">Tim Otte/NOT-Company bv h.o.d.n. Mistersubsidie</p>
          </div>
          <div>
            <p className="text-gray-600">KvK-nummer:</p>
            <p className="font-medium">24353031</p>
          </div>
          <div>
            <p className="text-gray-600">Contactpersoon:</p>
            <p className="font-medium">Tim Otte</p>
          </div>
          <div>
            <p className="text-gray-600">E-mail:</p>
            <p className="font-medium">Tim@mistersubsidie.nl</p>
          </div>
          <div>
            <p className="text-gray-600">Telefoon:</p>
            <p className="font-medium">06 11 24 13 60</p>
          </div>
        </div>
      </Card>
      
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-700">Verklaringen en toestemmingen</h4>
        
        <Checkbox
          checked={formData.akkoordMachtiging}
          onChange={(e) => onInputChange('akkoordMachtiging', e.target.checked)}
          label="Ik ben bevoegd om deze machtiging te ondertekenen namens de onderneming."
        />
        
        <Checkbox
          checked={formData.akkoordWaarheid}
          onChange={(e) => onInputChange('akkoordWaarheid', e.target.checked)}
          label="Ik verklaar dat alle informatie naar waarheid is ingevuld."
        />
        
        <div className="pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Hierbij machtig ik bovengenoemde persoon/organisatie voor:
          </p>
          
          <div className="space-y-3">
            <Checkbox
              checked={formData.machtigingIndienen}
              onChange={(e) => onInputChange('machtigingIndienen', e.target.checked)}
              label="Het verzorgen van het indienen van de aanvraag."
            />
            
            <Checkbox
              checked={formData.machtigingHandelingen}
              onChange={(e) => onInputChange('machtigingHandelingen', e.target.checked)}
              label="Het uitvoeren van alle gerelateerde (rechts)handelingen in verband met deze aanvraag tot en met de verlening/vaststelling."
            />
            
            <Checkbox
              checked={formData.machtigingBezwaar}
              onChange={(e) => onInputChange('machtigingBezwaar', e.target.checked)}
              label="Het uitvoeren van alle benodigde rechtshandelingen in geval van een eventueel te voeren bezwaar- en beroepsprocedure."
            />
          </div>
        </div>
      </div>
    </div>
  );
};