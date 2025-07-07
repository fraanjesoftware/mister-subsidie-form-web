import { useState, useEffect } from 'react';
import { ProgressSteps, Navigation } from './components/form';
import { 
  CompanyDetails, 
  Directors, 
  CompanySize, 
  StateAid, 
  Authorization, 
  Review 
} from './components/steps';
import { DocuSignModal } from './components/DocuSignModal';
import { STEPS } from './constants/steps';
import { useFormData, useStepValidation } from './hooks';
import { prepareFormData } from './utils/prepareFormData';
import { buildSigningSession } from './utils/buildSigningSession';
import type { TemplateSigningSession, TemplateSigningSessionResponse } from './types/docusign';

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<TemplateSigningSessionResponse | null>(null);
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [signingError, setSigningError] = useState<string>('');
  const [signingStatus, setSigningStatus] = useState<'idle' | 'completed' | 'cancelled'>('idle');
  const { formData, handleInputChange, handleNestedInputChange } = useFormData();
  const { isStepValid } = useStepValidation(formData);

  // Handle DocuSign return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const docusignCallback = urlParams.get('docusign');
    const event = urlParams.get('event');
    
    if (docusignCallback === 'callback') {
      // Clear the signing in progress flag
      sessionStorage.removeItem('docusign_signing_in_progress');
      
      // Handle different events
      if (event === 'signing_complete') {
        setSigningStatus('completed');
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      } else if (event === 'cancel' || event === 'decline') {
        setSigningStatus('cancelled');
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        // No event parameter, assume completed (DocuSign default behavior)
        setSigningStatus('completed');
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      }
      
      // Navigate to authorization step (last step)
      setCurrentStep(STEPS.length - 1);
    } else {
      // Check if signing was in progress (page refresh during signing)
      const signingInProgress = sessionStorage.getItem('docusign_signing_in_progress');
      if (signingInProgress) {
        // User refreshed during signing or came back without proper callback
        sessionStorage.removeItem('docusign_signing_in_progress');
        setCurrentStep(STEPS.length - 1);
        setSigningStatus('cancelled');
      }
    }
  }, []);

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
    setIsTestLoading(true);
    setTestResponse(null);

    const testData: TemplateSigningSession = {
      templateId: "4e941c38-804a-4a38-991c-146639ede747",
      signers: [
        {
          email: "info@fraanjesoftware.com",
          name: "Test Applicant",
          roleName: "Applicant",
          tabs: {
            radioGroupTabs: [
              {
                groupName: "de-minimis-radio",
                radios: [
                  { value: "geen", selected: "true" },
                  { value: "wel", selected: "false" },
                  { value: "andere", selected: "false" }
                ]
              },
              {
                groupName: "onderneming-type",
                radios: [
                  { value: "kleine", selected: "true" },
                  { value: "middel", selected: "false" },
                  { value: "grote", selected: "false" }
                ]
              }
            ],
            textTabs: [
              { tabLabel: "minimis-2.1", value: "" },
              { tabLabel: "minimis-3.1", value: "5000" },
              { tabLabel: "minimis-3.2", value: "Test" },
              { tabLabel: "bedrijfsnaam", value: "Test Company B.V." },
              { tabLabel: "naam", value: "Mickey Fraanje" },
              { tabLabel: "functie", value: "Directeur" },
              { tabLabel: "email", value: "info@fraanjesoftware.com" },
              { tabLabel: "voorletters-tekenbevoegde", value: "M." },
              { tabLabel: "achternaam-tekenbevoegde", value: "Fraanje" },
              { tabLabel: "functie-tekenbevoegde", value: "Directeur" },
              { tabLabel: "nace", value: "1234" },
              { tabLabel: "kvk", value: "12345678" },
              { tabLabel: "onderneming-adres", value: "Teststraat 123" },
              { tabLabel: "postcode", value: "1234 AB" },
              { tabLabel: "plaats", value: "Amsterdam" },
              { tabLabel: "fte", value: "25" },
              { tabLabel: "jaaromzet", value: "€5.000.000" },
              { tabLabel: "balanstotaal", value: "€2.500.000" },
              { tabLabel: "boekjaar", value: "2024" },
              { tabLabel: "Date", value: "06-07-2025" }
            ],
            listTabs: [
              { tabLabel: "CompanySize", value: "Klein (< 50 medewerkers)" }
            ]
          }
        },
        {
          email: "test@mickeyfraanje.com",
          name: "Second signer",
          roleName: "SecondSigner"
        }
      ],
      returnUrl: window.location.origin + "/?docusign=callback"
    };

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mister-subsidie-form-api-h8fvgydvheenczea.westeurope-01.azurewebsites.net';
      const response = await fetch(
        `${apiBaseUrl}/api/createTemplateSigningSession`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testData),
        }
      );

      const result: TemplateSigningSessionResponse = await response.json();
      setTestResponse(result);
      console.log('DocuSign API Response:', result);
      console.log('Signing URL:', result.signingUrl);
      
      if (result.signingUrl) {
        // Check if this is an embedded signing URL
        try {
          const url = new URL(result.signingUrl);
          const isEmbeddedUrl = url.searchParams.has('slt') || url.pathname.includes('/Signing/');
          
          console.log('URL Analysis:', {
            fullUrl: result.signingUrl,
            hasSlT: url.searchParams.has('slt'),
            pathname: url.pathname,
            isEmbeddedFormat: isEmbeddedUrl
          });
          
          if (!isEmbeddedUrl) {
            console.warn('The URL does not appear to be configured for embedded signing.');
            console.warn('Expected URL to contain "slt" parameter or "/Signing/" in path.');
            console.warn('Make sure your backend calls EnvelopeViews:createRecipient with frameAncestors and returnUrl.');
          }
        } catch (urlError) {
          console.error('Failed to parse signing URL:', urlError);
        }
        
        // Show the signing modal
        setShowSigningModal(true);
        setModalLoading(false);
      } else {
        console.error('No signing URL received from API');
        setTestResponse({ error: 'No signing URL received', ...result });
      }
    } catch (error) {
      console.error('Error calling DocuSign API:', error);
      setTestResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSigningModal(false);
    setTestResponse(null);
  };

  const handleSigningComplete = () => {
    console.log('Signing completed successfully!');
    setSigningStatus('completed');
    setSigningError('');
    // Save to localStorage that signing was completed
    localStorage.setItem('slimSigningStatus', 'completed');
    localStorage.setItem('slimSigningDate', new Date().toISOString());
    // The modal will close automatically after showing success message
  };

  const handleSigningCancelled = () => {
    console.log('Signing was cancelled');
    setSigningStatus('cancelled');
    setSigningError('Het ondertekenen is geannuleerd. U kunt het opnieuw proberen.');
    // The modal will close automatically after showing cancelled message
  };

  const handleSignDocuments = async () => {
    setModalLoading(true);
    setTestResponse(null);
    setSigningError('');

    // Build signing session data using the type-safe helper
    const signingData = buildSigningSession(
      formData,
      "4e941c38-804a-4a38-991c-146639ede747" // Replace with actual template ID from config/env
    );

    console.log('Sending to DocuSign API:', JSON.stringify(signingData, null, 2));
    
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mister-subsidie-form-api-h8fvgydvheenczea.westeurope-01.azurewebsites.net';
      const response = await fetch(
        `${apiBaseUrl}/api/createTemplateSigningSession`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signingData),
        }
      );

      const result = await response.json();
      setTestResponse(result);
      console.log('DocuSign API Response:', result);
      
      if (result.signingUrl) {
        // Show the signing modal
        setShowSigningModal(true);
        setModalLoading(false);
      } else if (result.error) {
        // Show error message
        console.error('DocuSign error:', result.error, result.validationErrors);
        const errorMessage = result.validationErrors?.join(', ') || result.message || result.error;
        setSigningError(`Fout bij ondertekenen: ${errorMessage}`);
        setModalLoading(false);
      }
    } catch (error) {
      console.error('Error calling DocuSign API:', error);
      setTestResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
      setSigningError(`Fout bij verbinding: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
      setModalLoading(false);
    }
  };

  const handleSubmit = () => {
    const allData = prepareFormData(formData);
    console.log('Formulieren data:', allData);
    
    // Save to localStorage
    localStorage.setItem('slimFormData', JSON.stringify(allData));
    
    // Download structured data as JSON
    const structuredDataStr = JSON.stringify(allData.structured, null, 2);
    const structuredDataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(structuredDataStr);
    const structuredFileName = `slim-aanvraag-structured-${formData.bedrijfsnaam.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    
    // Download PDF field mapping as JSON
    const pdfDataStr = JSON.stringify(allData.pdfFields, null, 2);
    const pdfDataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(pdfDataStr);
    const pdfFileName = `slim-aanvraag-pdf-fields-${formData.bedrijfsnaam.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    
    // Create download for structured data
    const link1 = document.createElement('a');
    link1.setAttribute('href', structuredDataUri);
    link1.setAttribute('download', structuredFileName);
    link1.click();
    
    // Create download for PDF field mapping (with small delay)
    setTimeout(() => {
      const link2 = document.createElement('a');
      link2.setAttribute('href', pdfDataUri);
      link2.setAttribute('download', pdfFileName);
      link2.click();
    }, 500);
    
    alert('Uw aanvraag is succesvol verwerkt! Er zijn 2 bestanden gedownload:\n\n1. Gestructureerde data (voor archivering)\n2. PDF veld mapping (voor automatisch invullen van PDFs)');
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
        return <Review formData={formData} />;
      case 5:
        return <Authorization formData={formData} onInputChange={handleInputChange} onSign={handleSignDocuments} signingError={signingError} signingStatus={signingStatus} />;
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
        </div>

        {/* Test DocuSign Button */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">DocuSign API Test</h2>
          <button
            onClick={handleTestDocuSign}
            disabled={isTestLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isTestLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
          >
            {isTestLoading ? 'Loading...' : 'Test Embedded Signing'}
          </button>
          
          {testResponse && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">API Response:</h3>
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(testResponse, null, 2)}
              </pre>
              {testResponse.error && (
                <p className="mt-2 text-red-600">Error: {testResponse.error}</p>
              )}
            </div>
          )}
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
        />
      </div>
      
      {/* DocuSign Modal */}
      <DocuSignModal 
        isOpen={showSigningModal}
        onClose={handleCloseModal}
        signingUrl={testResponse?.signingUrl}
        isLoading={modalLoading}
        onSigningComplete={handleSigningComplete}
        onSigningCancelled={handleSigningCancelled}
      />
    </div>
  );
};

export default App;