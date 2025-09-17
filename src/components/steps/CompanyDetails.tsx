import { FormData } from '../../types';
import { Input } from '../ui';
import { validators } from '../../utils/validation';

interface CompanyDetailsProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
}

export const CompanyDetails = ({ formData, onInputChange }: CompanyDetailsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[var(--color-title-text)] mb-2">Bedrijfsgegevens</h3>
        <p className="text-gray-600 mb-6">Vul de algemene gegevens van uw onderneming in.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Bedrijfsnaam *"
            value={formData.bedrijfsnaam}
            onChange={(e) => onInputChange('bedrijfsnaam', e.target.value)}
            placeholder="Uw bedrijfsnaam"
            autoComplete="organization"
            name="company"
            validationRules={[validators.required(), validators.minLength(2)]}
          />
        </div>
        
        <Input
          label="KvK-nummer *"
          value={formData.kvkNummer}
          onChange={(e) => onInputChange('kvkNummer', e.target.value.replace(/\D/g, ''))}
          placeholder="12345678"
          maxLength={8}
          validationRules={[validators.required(), validators.kvkNumber()]}
        />
        
        <Input
          type="email"
          label="E-mailadres *"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          placeholder="info@uwbedrijf.nl"
          autoComplete="email"
          name="email"
          validationRules={[validators.required(), validators.email()]}
        />
        
        <div className="md:col-span-2">
          <Input
            label="Adres"
            value={formData.adres}
            onChange={(e) => onInputChange('adres', e.target.value)}
            placeholder="Straatnaam 123"
            autoComplete="street-address"
            name="address"
          />
        </div>
        
        <Input
          label="Postcode"
          value={formData.postcode}
          onChange={(e) => onInputChange('postcode', e.target.value.toUpperCase())}
          placeholder="1234 AB"
          autoComplete="postal-code"
          name="postal-code"
          maxLength={7}
          validationRules={[validators.dutchPostcode()]}
        />
        
        <Input
          label="Plaats"
          value={formData.plaats}
          onChange={(e) => onInputChange('plaats', e.target.value)}
          placeholder="Amsterdam"
          autoComplete="address-level2"
          name="city"
        />
        
        <Input
          label="NACE-classificatie"
          hint="Eerste 4 cijfers van uw SBI-code"
          value={formData.naceClassificatie}
          onChange={(e) => onInputChange('naceClassificatie', e.target.value.replace(/\D/g, ''))}
          placeholder="0000"
          maxLength={4}
          validationRules={[validators.naceCode()]}
        />
      </div>
    </div>
  );
};
