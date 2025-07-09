import React from 'react';
import { IconCircleCheck, IconMail, IconClock } from '@tabler/icons-react';

interface EndPageProps {
  onStartNew: () => void;
}

export const EndPage: React.FC<EndPageProps> = ({ onStartNew }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-light-4 to-gray-light-2 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
              <IconCircleCheck className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bedankt voor uw aanvraag!
          </h1>
          
          <p className="text-lg text-gray-700 mb-8">
            Uw SLIM-subsidie aanvraag is succesvol ingediend en ondertekend.
          </p>

          {/* What Happens Next */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <IconClock className="w-6 h-6 mr-2 text-primary" />
              Wat gebeurt er nu?
            </h2>
            
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary font-bold mr-2">•</span>
                <span>Wij verwerken uw aanvraag en controleren alle gegevens</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-2">•</span>
                <span>U ontvangt binnen <strong>3-5 werkdagen</strong> een bevestiging per e-mail</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary font-bold mr-2">•</span>
                <span>Bij goedkeuring starten wij direct met de uitvoering van uw subsidietraject</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-2">
              <IconMail className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Vragen?</h3>
            </div>
            <p className="text-gray-700">
              Neem contact op via{' '}
              <a href="mailto:info@mistersubsidie.nl" className="text-blue-600 hover:text-blue-700 font-medium">
                info@mistersubsidie.nl
              </a>
            </p>
          </div>

          {/* New Application Button */}
          <button
            onClick={onStartNew}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
          >
            Nieuwe aanvraag starten
          </button>
        </div>
      </div>
    </div>
  );
};