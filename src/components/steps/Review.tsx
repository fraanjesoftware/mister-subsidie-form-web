import { FormData } from '../../types';
import { Card } from '../ui';
import { StepIntro } from './StepIntro';
import { formatAddress } from '../../utils/address';

interface ReviewProps {
  formData: FormData;
}

export const Review = ({ formData }: ReviewProps) => {
  return (
    <div className="space-y-6">
      <StepIntro
        title="Controleer uw gegevens"
        description="Controleer alle ingevoerde gegevens voordat u de aanvraag indient."
      />

      <div className="space-y-6">
        {/* Bedrijfsgegevens */}
        <Card>
          <h4 className="font-semibold text-gray-700 mb-4">Bedrijfsgegevens</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Bedrijfsnaam:</p>
              <p className="font-medium">{formData.bedrijfsnaam || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">KvK-nummer:</p>
              <p className="font-medium">{formData.kvkNummer || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">E-mail:</p>
              <p className="font-medium">{formData.email || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">Adres:</p>
              <p className="font-medium">{formData.straat && formData.huisnummer ? formatAddress(formData.straat, formData.huisnummer) : '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">Postcode & Plaats:</p>
              <p className="font-medium">{formData.postcode} {formData.plaats}</p>
            </div>
            <div>
              <p className="text-gray-600">Type onderneming:</p>
              <p className="font-medium">
                {formData.ondernemingType === 'klein' && 'Kleine onderneming'}
                {formData.ondernemingType === 'middelgroot' && 'Middelgrote onderneming'}
                {formData.ondernemingType === 'groot' && 'Grote onderneming'}
              </p>
            </div>
          </div>
        </Card>
        
        {/* Bestuurders */}
        <Card>
          <h4 className="font-semibold text-gray-700 mb-4">Bestuurder(s)</h4>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Bestuurder 1:</p>
              <p className="font-medium">
                {formData.bestuurder1.volledigeNaam} - {formData.bestuurder1.functie}
              </p>
            </div>
            {formData.bestuurder2.nodig && formData.bestuurder2.volledigeNaam && (
              <div>
                <p className="text-gray-600">Bestuurder 2:</p>
                <p className="font-medium">
                  {formData.bestuurder2.volledigeNaam} - {formData.bestuurder2.functie}
                </p>
              </div>
            )}
          </div>
        </Card>
        
        {/* De-minimis */}
        <Card>
          <h4 className="font-semibold text-gray-700 mb-4">De-minimisverklaring</h4>
          <div className="text-sm">
            <p className="text-gray-600">Status:</p>
            <p className="font-medium">
              {formData.deMinimisType === 'geen' && 'Geen de-minimissteun ontvangen'}
              {formData.deMinimisType === 'wel' && `De-minimissteun ontvangen: €${formData.deMinimisAmount || '0'}`}
              {formData.deMinimisType === 'andere' && `Andere staatssteun ontvangen: €${formData.andereStaatssteunAmount || '0'}`}
            </p>
          </div>
        </Card>
        
        {/* Ondertekening */}
        {/* <Alert type="warning">
          <div>
            <h4 className="font-semibold text-[var(--color-title-text)] mb-2">Digitale ondertekening</h4>
            <p className="text-sm text-gray-700">
              Door op "Aanvraag indienen" te klikken, verklaart u dat:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• Alle gegevens naar waarheid zijn ingevuld</li>
              <li>• U bevoegd bent om namens de onderneming te handelen</li>
              <li>• U akkoord gaat met de machtiging aan Mistersubsidie</li>
              <li>• De verklaring geldt als digitale handtekening op datum: {new Date().toLocaleDateString('nl-NL')}</li>
            </ul>
          </div>
        </Alert> */}
      </div>
    </div>
  );
};
