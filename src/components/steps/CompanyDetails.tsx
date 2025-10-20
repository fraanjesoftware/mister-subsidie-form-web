import { FormData } from '../../types';
import { Input, Select } from '../ui';
import { validators } from '../../utils/validation';
import { StepIntro } from './StepIntro';

const PROVINCIES = [
  { value: 'Drenthe', label: 'Drenthe' },
  { value: 'Flevoland', label: 'Flevoland' },
  { value: 'Friesland', label: 'Friesland' },
  { value: 'Gelderland', label: 'Gelderland' },
  { value: 'Groningen', label: 'Groningen' },
  { value: 'Limburg', label: 'Limburg' },
  { value: 'Noord-Brabant', label: 'Noord-Brabant' },
  { value: 'Noord-Holland', label: 'Noord-Holland' },
  { value: 'Overijssel', label: 'Overijssel' },
  { value: 'Utrecht', label: 'Utrecht' },
  { value: 'Zeeland', label: 'Zeeland' },
  { value: 'Zuid-Holland', label: 'Zuid-Holland' }
];

const GESLACHT_OPTIES = [
  { value: 'man', label: 'Man' },
  { value: 'vrouw', label: 'Vrouw' },
  { value: 'anders', label: 'Anders' }
];

const HOOFDCONTACT_OPTIES = [
  { value: 'Wout', label: 'Wout' },
  { value: 'Tim', label: 'Tim' },
  { value: 'Nathalie', label: 'Nathalie' }
];

interface CompanyDetailsProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
}

export const CompanyDetails = ({ formData, onInputChange }: CompanyDetailsProps) => {
  return (
    <div className="space-y-8">
      <StepIntro
        title="Bedrijfsgegevens"
        description="Vul de algemene gegevens van uw onderneming in."
      />

      {/* Bedrijfsinformatie */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-gray-dark-1)] mb-4">Bedrijfsinformatie</h3>
        <div className="space-y-6">
          <Input
            label="Bedrijfsnaam *"
            value={formData.bedrijfsnaam}
            onChange={(e) => onInputChange('bedrijfsnaam', e.target.value)}
            placeholder="Uw bedrijfsnaam"
            autoComplete="organization"
            name="company"
            validationRules={[validators.required(), validators.minLength(2)]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="KvK-nummer *"
              value={formData.kvkNummer}
              onChange={(e) => onInputChange('kvkNummer', e.target.value.replace(/\D/g, ''))}
              placeholder="12345678"
              maxLength={8}
              validationRules={[validators.required(), validators.kvkNumber()]}
            />

            <Input
              label="BTW-identificatienummer"
              value={formData.btwId}
              onChange={(e) => onInputChange('btwId', e.target.value.toUpperCase())}
              placeholder="NL123456789B01"
              maxLength={14}
              validationRules={[validators.btwId()]}
            />
          </div>

          <Input
            label="Website"
            value={formData.website}
            onChange={(e) => onInputChange('website', e.target.value)}
            placeholder="www.uwbedrijf.nl"
            validationRules={[validators.url()]}
          />

          <Input
            label="Adres"
            value={formData.adres}
            onChange={(e) => onInputChange('adres', e.target.value)}
            placeholder="Straatnaam 123"
            autoComplete="street-address"
            name="address"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Provincie"
              options={PROVINCIES}
              value={formData.provincie}
              onChange={(value) => onInputChange('provincie', value)}
              placeholder="Selecteer een provincie"
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
              label="Postcode"
              value={formData.postcode}
              onChange={(e) => onInputChange('postcode', e.target.value.toUpperCase())}
              placeholder="1234 AB"
              autoComplete="postal-code"
              name="postal-code"
              maxLength={7}
              validationRules={[validators.dutchPostcode()]}
            />
            
          </div>

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

      {/* Contactinformatie */}
      <div className="border border-[var(--color-gray-light-4)] rounded-xl bg-gradient-to-br from-[var(--color-accent-light-4)] to-white p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--color-primary-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-gray-dark-1)]">Contactinformatie</h3>
            <p className="text-sm text-[var(--color-gray-dark-2)] mt-1">Gegevens van uw contactpersoon bij uw bedrijf</p>
          </div>
        </div>

        <div className="space-y-6">
          <Input
            label="Naam contactpersoon *"
            value={formData.contactNaam}
            onChange={(e) => onInputChange('contactNaam', e.target.value)}
            placeholder="Volledige naam"
            autoComplete="name"
            validationRules={[validators.required(), validators.minLength(2)]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <Input
              label="Telefoonnummer *"
              type="tel"
              value={formData.contactTelefoon}
              onChange={(e) => onInputChange('contactTelefoon', e.target.value)}
              placeholder="0612345678"
              autoComplete="tel"
              validationRules={[validators.required(), validators.dutchPhone()]}
            />
          </div>

          <Select
            label="Geslacht *"
            options={GESLACHT_OPTIES}
            value={formData.contactGeslacht}
            onChange={(value) => onInputChange('contactGeslacht', value)}
            placeholder="Selecteer geslacht"
            validationRules={[validators.required()]}
          />

          <div className="pt-4 border-t border-[var(--color-gray-light-4)]">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-[var(--color-gray-dark-1)]">Uw vaste contactpersoon bij ons</h4>
              <p className="text-sm text-[var(--color-gray-dark-2)] mt-1">Wie zal uw hoofdcontactpersoon zijn bij Mister Subsidie?</p>
            </div>
            <Select
              label="Hoofdcontactpersoon *"
              options={HOOFDCONTACT_OPTIES}
              value={formData.hoofdcontactPersoon}
              onChange={(value) => onInputChange('hoofdcontactPersoon', value)}
              placeholder="Selecteer uw contactpersoon"
              validationRules={[validators.required()]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
