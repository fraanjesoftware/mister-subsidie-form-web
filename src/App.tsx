import { useState } from 'react';
import { ProgressSteps, Navigation } from './components/form';
import { 
  CompanyDetails, 
  Directors, 
  CompanySize, 
  StateAid, 
  Authorization, 
  Review 
} from './components/steps';
import { STEPS } from './constants/steps';
import { useFormData, useStepValidation } from './hooks';
import { prepareFormData } from './utils/prepareFormData';
import { createSigningSession, createTestSigningSession } from './services/api';
import { initializeDocuSignEmbeddedSigning } from './services/docusign';

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const { formData, handleInputChange, handleNestedInputChange } = useFormData();
  const { isStepValid } = useStepValidation(formData);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTestDocuSign = async () => {
    try {
      setIsTestLoading(true);
      console.log('Sending test DocuSign request...');
      
      const response = await createTestSigningSession();
      
      console.log('Test signing session created:', response);
      
      if (response.envelopeId) {
        localStorage.setItem('testEnvelopeId', response.envelopeId);
        
        if (response.redirectUrl) {
          initializeDocuSignEmbeddedSigning(response.envelopeId, response.redirectUrl);
        } else {
          alert(`Test DocuSign envelope aangemaakt!\n\nEnvelope ID: ${response.envelopeId}`);
        }
      }
    } catch (error) {
      console.error('Error in test DocuSign:', error);
      const errorMessage = error instanceof Error ? error.message : 'Onbekende fout';
      
      // Check if it's a CORS error
      if (errorMessage.includes('Failed to fetch')) {
        alert(`CORS Error: De API server staat geen requests toe van localhost.\n\nMogelijke oplossingen:\n1. Vraag de API beheerder om CORS te configureren voor localhost:5173\n2. Test vanaf de gedeployde versie van de applicatie\n3. Gebruik een browser extensie zoals "CORS Unblock" voor testing\n\nTechnische details: ${errorMessage}`);
      } else {
        alert(`Test fout: ${errorMessage}`);
      }
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const allData = prepareFormData(formData);
      console.log('Formulieren data:', allData);
      
      // Save to localStorage
      localStorage.setItem('slimFormData', JSON.stringify(allData));
      
      // Call API to create signing session
      const response = await createSigningSession(allData.structured);
      
      console.log('Signing session created:', response);
      
      // Initialize DocuSign embedded signing
      if (response.envelopeId) {
        // Store envelope ID for reference
        localStorage.setItem('currentEnvelopeId', response.envelopeId);
        
        // If API provides a redirect URL, use it
        if (response.redirectUrl) {
          initializeDocuSignEmbeddedSigning(response.envelopeId, response.redirectUrl);
        } else {
          // Otherwise show success message with envelope ID
          alert(`Uw aanvraag is succesvol verzonden!\n\nEnvelope ID: ${response.envelopeId}\n\nU wordt doorgestuurd naar de ondertekeningspagina.`);
          
          // Here you would typically redirect to a signing page
          // For now, we'll show the envelope ID
          console.log('Envelope ID received:', response.envelopeId);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      
      // Show error message
      const errorMessage = error instanceof Error ? error.message : 'Onbekende fout';
      alert(`Er is een fout opgetreden bij het verzenden van uw aanvraag:\n\n${errorMessage}\n\nProbeer het later opnieuw of neem contact op met support.`);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CompanyDetails formData={formData} onInputChange={handleInputChange} />;
      case 1:
        return <Directors formData={formData} onNestedInputChange={handleNestedInputChange} />;
      case 2:
        return <CompanySize formData={formData} onInputChange={handleInputChange} />;
      case 3:
        return <StateAid formData={formData} onInputChange={handleInputChange} />;
      case 4:
        return <Authorization formData={formData} onInputChange={handleInputChange} />;
      case 5:
        return <Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-light-4 to-gray-light-2">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">SLIM Subsidie Aanvraag</h1>
          <p className="text-gray-dark-2 font-medium">Vraag eenvoudig uw SLIM-subsidie aan via Mistersubsidie</p>
          
          {/* Test DocuSign Button */}
          <div className="mt-4">
            <button
              onClick={handleTestDocuSign}
              disabled={isTestLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isTestLoading ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Test DocuSign bezig...
                </>
              ) : (
                'Test DocuSign Embedded Signing'
              )}
            </button>
            <p className="text-xs text-gray-600 mt-2">
              API Endpoint: /api/createSigningSession
            </p>
          </div>
        </div>
        
        <ProgressSteps steps={STEPS} currentStep={currentStep} />
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {renderStep()}
        </div>
        
        <Navigation
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onPrev={handlePrev}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isStepValid={isStepValid(currentStep)}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default App;