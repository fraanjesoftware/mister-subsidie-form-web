import { FormData } from '../../types';
import { Checkbox, Card } from '../ui';

interface AuthorizationProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
  onSign?: () => Promise<boolean>;
  signingError?: string;
  signingStatus?: 'idle' | 'completed' | 'cancelled';
  isLoading?: boolean;
}

export const Authorization = ({ formData, onInputChange, onSign, signingError, signingStatus, isLoading }: AuthorizationProps) => {

  const handleSign = async () => {
    // Call the sign function
    await onSign?.();
  };

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
      
      {/* Signing Button */}
      {onSign && (
        <div className="pt-8 border-t">
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 mb-3">
              Klaar om te ondertekenen?
            </h4>
            <p className="text-gray-600 mb-6">
              Controleer alle gegevens en onderteken de aanvraag digitaal.
            </p>
            
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8DA47] mb-3"></div>
                <p className="text-gray-700 font-medium">Aanvraag wordt verwerkt...</p>
                <p className="text-sm text-gray-600 mt-2">U ontvangt een e-mail met instructies voor het ondertekenen.</p>
              </div>
            ) : (
              <button
                onClick={handleSign}
                disabled={!formData.akkoordMachtiging || !formData.akkoordWaarheid || 
                         !formData.machtigingIndienen || !formData.machtigingHandelingen || 
                         !formData.machtigingBezwaar}
                className={`inline-flex items-center px-6 py-3 rounded-2xl font-extrabold transition-all ${
                  formData.akkoordMachtiging && formData.akkoordWaarheid && 
                  formData.machtigingIndienen && formData.machtigingHandelingen && 
                  formData.machtigingBezwaar
                    ? 'bg-[#C8DA47] text-[#03291F] hover:bg-[#F3F7DA] hover:outline hover:outline-3 hover:outline-black shadow-sm cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Digitaal ondertekenen
              </button>
            )}
            {(!formData.akkoordMachtiging || !formData.akkoordWaarheid || 
              !formData.machtigingIndienen || !formData.machtigingHandelingen || 
              !formData.machtigingBezwaar) && (
              <p className="text-sm text-red-600 mt-3">
                Vink alle verklaringen aan om door te gaan met ondertekenen.
              </p>
            )}
            {signingStatus === 'completed' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Document succesvol verstuurd!
                </p>
              </div>
            )}
            {signingError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{signingError}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};