import { FormData } from '../../types';
import { Input } from '../ui';

interface CompanyDetailsProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
}

export const CompanyDetails = ({ formData, onInputChange }: CompanyDetailsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Bedrijfsgegevens</h3>
        <p className="text-gray-600 mb-6">Vul de algemene gegevens van uw onderneming in.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Bedrijfsnaam *"
            value={formData.bedrijfsnaam}
            onChange={(e) => onInputChange('bedrijfsnaam', e.target.value)}
            placeholder="Uw bedrijfsnaam"
          />
        </div>
        
        <Input
          label="KvK-nummer *"
          value={formData.kvkNummer}
          onChange={(e) => onInputChange('kvkNummer', e.target.value)}
          placeholder="12345678"
          maxLength={8}
        />
        
        <Input
          type="email"
          label="E-mailadres *"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          placeholder="info@uwbedrijf.nl"
        />
        
        <div className="md:col-span-2">
          <Input
            label="Adres"
            value={formData.adres}
            onChange={(e) => onInputChange('adres', e.target.value)}
            placeholder="Straatnaam 123"
          />
        </div>
        
        <Input
          label="Postcode"
          value={formData.postcode}
          onChange={(e) => onInputChange('postcode', e.target.value)}
          placeholder="1234 AB"
        />
        
        <Input
          label="Plaats"
          value={formData.plaats}
          onChange={(e) => onInputChange('plaats', e.target.value)}
          placeholder="Amsterdam"
        />
        
        <Input
          label="NACE-classificatie"
          hint="Eerste 4 cijfers van uw SBI-code"
          value={formData.naceClassificatie}
          onChange={(e) => onInputChange('naceClassificatie', e.target.value)}
          placeholder="0000"
          maxLength={4}
        />
      </div>
    </div>
  );
};