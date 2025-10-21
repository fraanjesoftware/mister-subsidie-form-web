import React, { useEffect } from 'react';
import { IconCircleCheck } from '@tabler/icons-react';
import { AppLayout } from '../components/layout';
import { clearFormDataFromStorage } from '../utils/localStorage';

export const EndPage: React.FC = () => {
  useEffect(() => {
    // Clear all form data including applicationId when user completes the form
    clearFormDataFromStorage();
    sessionStorage.removeItem('signwell_signing_in_progress');
  }, []);

  return (
    <AppLayout>
      <div className="flex min-h-full items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-xl bg-white p-8 text-center shadow-lg">
            <div className="mb-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent-light-5)]">
                <IconCircleCheck className="h-12 w-12 text-[var(--color-accent)]" />
              </div>
            </div>

            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              Check uw mailbox om het formulier te ondertekenen
            </h1>

            <p className="mb-6 text-gray-700">
              Het document wordt binnen enkele momenten naar uw opgegeven e-mail adres gestuurd. Open deze mail om het formulier digitaal te ondertekenen.
            </p>

            <a
              href="/"
              className="inline-block rounded-lg bg-[var(--color-primary)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
            >
              Nieuwe aanvraag
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
