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

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [showEmbeddedSigning, setShowEmbeddedSigning] = useState(false);
  const [useDirectIframe, setUseDirectIframe] = useState(false);
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
    setIsTestLoading(true);
    setTestResponse(null);

    const testData = {
      "signer": {
        "email": "multi-form-test@example.com",
        "name": "Multi Form Tester",
        "clientUserId": "test-user-123"
      },
      "forms": [
        {
          "formType": "deMinimis",
          "formData": {
            "selectedOption": 1,
            "generalData": {
              "companyName": "Multi Test Company B.V.",
              "kvkNumber": "88888888",
              "street": "Multistraat",
              "houseNumber": "999",
              "city": "Rotterdam",
              "postalCode": "3000AA",
              "signerName": "Multi Form Tester",
              "date": "05-07-25"
            },
            "addSignatureAnchors": true
          }
        },
        {
          "formType": "mkb",
          "formData": {
            "companyName": "Multi Test Company B.V.",
            "financialYear": "2024",
            "employees": 75,
            "annualTurnover": 12000000,
            "balanceTotal": 6000000,
            "signerName": "Multi Form Tester",
            "signerPosition": "CEO",
            "dateAndLocation": "Rotterdam, 05-07-2025",
            "isIndependent": true,
            "hasLargeCompanyOwnership": false,
            "hasPartnerCompanies": false,
            "addSignatureAnchors": true
          }
        }
      ],
      "returnUrl": "https://example.com/multi-signing-complete"
    };

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mister-subsidie-form-api-h8fvgydvheenczea.westeurope-01.azurewebsites.net';
      const response = await fetch(
        `${apiBaseUrl}/api/createEmbeddedSigningSession`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testData),
        }
      );

      const result = await response.json();
      setTestResponse(result);
      console.log('DocuSign API Response:', result);
      console.log('Signing URL:', result.signingUrl);
      
      if (result.signingUrl) {
        // Check if this is an embedded signing URL
        const url = new URL(result.signingUrl);
        const isEmbeddedUrl = url.searchParams.has('slt') || url.pathname.includes('/Signing/');
        
        if (!isEmbeddedUrl) {
          console.warn('The URL does not appear to be configured for embedded signing.');
          console.warn('Make sure your backend calls EnvelopeViews:createRecipient with frameAncestors.');
        }
        
        // Initialize embedded signing with integration key from response, env, or use default
        const integrationKey = result.integrationKey || 
                             import.meta.env.VITE_DOCUSIGN_INTEGRATION_KEY || 
                             'd24356d5-3e46-41f4-93ec-03101328d1a5';
        
        // Show the embedded signing container
        setShowEmbeddedSigning(true);
        
        // Only initialize DocuSign JS if not using direct iframe
        if (!useDirectIframe) {
          initializeEmbeddedSigning(result.signingUrl, integrationKey);
        }
      }
    } catch (error) {
      console.error('Error calling DocuSign API:', error);
      setTestResponse({ error: error.message });
    } finally {
      setIsTestLoading(false);
    }
  };

  const initializeEmbeddedSigning = async (signingUrl: string, integrationKey: string) => {
    try {
      console.log('Initializing embedded signing with:', {
        signingUrl,
        integrationKey,
        urlHost: new URL(signingUrl).hostname
      });
      
      // For now, let's use direct iframe embedding since DocuSign JS is having issues
      console.log('Using direct iframe embedding due to DocuSign JS issues');
      setUseDirectIframe(true);
      
    } catch (error) {
      console.error('Error initializing embedded signing:', error);
      console.log('Falling back to direct iframe embedding');
      setUseDirectIframe(true);
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
        </div>

        {/* Test DocuSign Button */}
        {!showEmbeddedSigning && (
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
                {testResponse.signingUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      If embedded signing doesn't load, you can open it in a new window:
                    </p>
                    <a 
                      href={testResponse.signingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      Open in New Window
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Embedded Signing Container */}
        {showEmbeddedSigning && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">DocuSign Embedded Signing</h2>
              <div className="flex gap-2">
                {testResponse?.signingUrl && (
                  <button
                    onClick={() => {
                      window.open(testResponse.signingUrl, 'docusign-popup', 'width=800,height=800');
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Open in Popup
                  </button>
                )}
                <button
                  onClick={() => setShowEmbeddedSigning(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="mb-4 p-3 bg-yellow-100 rounded">
              <p className="text-sm">If the embedded signing doesn't load, try opening in a popup window or check the browser console for errors.</p>
            </div>
            <div className="mb-2">
              <button
                onClick={() => setUseDirectIframe(!useDirectIframe)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {useDirectIframe ? 'Try DocuSign JS' : 'Try Direct Iframe'} (debugging)
              </button>
            </div>
            <div 
              id="docusign-signing-container" 
              style={{ width: '100%', height: '600px', border: '1px solid #e5e7eb', position: 'relative' }}
            >
              {/* Direct iframe embedding for debugging */}
              {useDirectIframe && testResponse?.signingUrl && (
                <iframe 
                  src={testResponse.signingUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="DocuSign Signing"
                  allow="camera; microphone"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                  onLoad={() => console.log('DocuSign iframe loaded')}
                  onError={(e) => console.error('DocuSign iframe error:', e)}
                />
              )}
            </div>
          </div>
        )}
        
        {!showEmbeddedSigning && (
          <ProgressSteps steps={STEPS} currentStep={currentStep} />
        )}
        
        {!showEmbeddedSigning && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default App;