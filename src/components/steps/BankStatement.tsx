import { useState } from 'react';
import { IconUpload, IconFileTypePdf, IconX } from '@tabler/icons-react';
import { FormData } from '../../types';
import { Checkbox, Alert } from '../ui';
import { StepIntro } from './StepIntro';

interface BankStatementProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: any) => void;
}

export const BankStatement = ({ formData, onInputChange }: BankStatementProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Clear any previous error
    setErrorMessage(null);

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      setErrorMessage('Alleen PDF-bestanden zijn toegestaan');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Het bestand mag niet groter zijn dan 10MB');
      return;
    }

    onInputChange('bankStatement', file);
  };

  const handleRemoveFile = () => {
    setErrorMessage(null);
    onInputChange('bankStatement', null);
    onInputChange('bankStatementConsent', false);
  };

  return (
    <div className="space-y-6">
      <StepIntro
        title="Bankverificatie"
        description="Upload een recent bankafschrift voor verificatie van uw bankrekeningnummer."
      />

      <Alert type="info">
        <div className="space-y-2">
          <p className="font-semibold">Waarom hebben we dit nodig?</p>
          <p>
            Wij hebben uw bankafschrift nodig om uw bankrekeningnummer te verifiëren.
            Dit is een vereiste voor de subsidieaanvraag.
          </p>
          <p className="mt-2">
            <strong>Let op:</strong> U mag alle financiële bedragen op het bankafschrift onleesbaar maken voor privacy.
          </p>
        </div>
      </Alert>

      {errorMessage && (
        <Alert type="error">
          {errorMessage}
        </Alert>
      )}

      <div className="space-y-4">
        {!formData.bankStatement ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-[var(--color-accent)] bg-blue-50'
                : 'border-gray-300 hover:border-[var(--color-accent)]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              id="file-upload"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <IconUpload className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
              </div>

              <div>
                <p className="text-md font-medium text-gray-900">
                  Sleep uw PDF hier of{' '}
                  <label htmlFor="file-upload" className="text-[var(--color-accent)] hover:underline cursor-pointer">
                    klik om te uploaden
                  </label>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Alleen PDF-bestanden, maximaal 10MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                  <IconFileTypePdf className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{formData.bankStatement.name}</p>
                  <p className="text-sm text-gray-500">
                    {(formData.bankStatement.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Verwijder bestand"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {formData.bankStatement && (
          <div className="pt-2">
            <Checkbox
              label={
                <span>
                  Ik geef toestemming voor het verwerken en bewaren van dit bankafschrift voor verificatie
                  van mijn bankrekeningnummer ten behoeve van de subsidieaanvraag, conform de{' '}
                  <a
                    href="https://mistersubsidie.nl/wp-content/uploads/2025/08/Privacyverklaring-mistersubsidie.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    privacyverklaring
                  </a>
                  . <span className="text-red-500">*</span>
                </span>
              }
              checked={formData.bankStatementConsent}
              onChange={(e) => onInputChange('bankStatementConsent', e.target.checked)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
