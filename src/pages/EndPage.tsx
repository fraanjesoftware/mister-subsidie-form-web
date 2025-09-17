import React, { useEffect } from 'react';
import { IconCircleCheck } from '@tabler/icons-react';

export const EndPage: React.FC = () => {
  useEffect(() => {
    // Clear form data when this page loads
    localStorage.removeItem('slimFormDataDraft');
    localStorage.removeItem('slimSigningStatus');
    localStorage.removeItem('slimSigningDate');
    sessionStorage.removeItem('signwell_signing_in_progress');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-accent-light-4)] to-[var(--color-gray-light-2)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
              <IconCircleCheck className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Check uw mailbox om het formulier te ondertekenen
          </h1>
          
          <p className="text-gray-700 mb-6">
            Het document wordt binnen enkele momenten naar uw opgegeven e-mail adres gestuurd. Open deze mail om het formulier digitaal te ondertekenen.
          </p>

          <a
            href="/"
            className="inline-block px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-lg transition-colors"
          >
            Nieuwe aanvraag
          </a>
        </div>
      </div>
    </div>
  );
};
