import { useMemo } from 'react';
import { FormData } from '../../types';
import { Input, Alert, RadioGroup } from '../ui';
import { validators, validateStep } from '../../utils/validation';
import { StepIntro } from './StepIntro';

interface StateAidProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
}

export const StateAid = ({ formData, onInputChange }: StateAidProps) => {
  const errors = useMemo(() => validateStep('stateAid', formData), [formData]);
  const deMinimisAmountError =
    formData.deMinimisType === 'wel' ? errors.deMinimisAmount : undefined;
  const andereAmountError =
    formData.deMinimisType === 'andere' ? errors.andereStaatssteunAmount : undefined;
  const andereDateError =
    formData.deMinimisType === 'andere' ? errors.andereStaatssteunDatum : undefined;

  const numberInputClasses = (hasError: boolean) =>
    `w-full pl-8 pr-4 py-2 border rounded-lg font-medium focus:ring-2 focus:outline-none ${
      hasError
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    }`;

  const options = [
    {
      value: 'geen',
      label: 'Geen de-minimissteun ontvangen',
      description: 'In de afgelopen 36 maanden heeft mijn onderneming geen de-minimissteun ontvangen.'
    },
    {
      value: 'wel',
      label: 'Wel de-minimissteun ontvangen',
      description: 'In de afgelopen 36 maanden heeft mijn onderneming de-minimissteun ontvangen, maar het totaal blijft onder de €300.000 drempel.',
      content: (
        <div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Totaalbedrag ontvangen de-minimissteun
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">€</span>
              <input
                type="number"
                className={numberInputClasses(!!deMinimisAmountError)}
                value={formData.deMinimisAmount}
                onChange={(e) => onInputChange('deMinimisAmount', e.target.value)}
                placeholder="0"
                max="299999"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximaal €299.999 (de drempel is €300.000)
            </p>
            {deMinimisAmountError && (
              <p className="mt-1 text-sm text-red-600 font-medium">{deMinimisAmountError}</p>
            )}
          </div>
        </div>
      )
    },
    {
      value: 'andere',
      label: 'Andere staatssteun voor dezelfde kosten',
      description: 'Voor dezelfde kosten waarvoor nu SLIM-subsidie wordt aangevraagd, is al andere staatssteun ontvangen.',
      content: (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Totaalbedrag andere staatssteun
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">€</span>
              <input
                type="number"
                className={numberInputClasses(!!andereAmountError)}
                value={formData.andereStaatssteunAmount}
                onChange={(e) => onInputChange('andereStaatssteunAmount', e.target.value)}
                placeholder="0"
              />
            </div>
            {andereAmountError && (
              <p className="mt-1 text-sm text-red-600 font-medium">{andereAmountError}</p>
            )}
          </div>
          <Input
            type="date"
            label="Datum besluit Europese Commissie"
            value={formData.andereStaatssteunDatum}
            onChange={(e) => onInputChange('andereStaatssteunDatum', e.target.value)}
            error={andereDateError}
            validationRules={[validators.dateInPast()]}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <StepIntro
        title="De-minimisverklaring"
        description="Verklaring over ontvangen staatssteun in de afgelopen 36 maanden."
      />

      <Alert type="info">
        <p className='text-blue-800'>
          De-minimissteun is een vorm van staatssteun tot maximaal €300.000 over een periode van 3 jaar. 
          U moet aangeven of uw onderneming dergelijke steun heeft ontvangen.
        </p>
      </Alert>
      
      <RadioGroup
        name="deMinimis"
        options={options}
        value={formData.deMinimisType}
        onChange={(value) => onInputChange('deMinimisType', value)}
      />
    </div>
  );
};
