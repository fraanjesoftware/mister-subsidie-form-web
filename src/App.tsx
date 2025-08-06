import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressSteps, Navigation } from './components/form';
import { 
  CompanyDetails, 
  Directors, 
  CompanySize, 
  StateAid, 
  Authorization
} from './components/steps';
// import { DocuSignModal } from './components/DocuSignModal';  // Not needed for SignWell
import { STEPS } from './constants/steps';
import { useFormData, useStepValidation } from './hooks';
import { prepareFormData } from './utils/prepareFormData';
import { buildSigningSession } from './utils/buildSigningSession';

const App = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  // const [testResponse, setTestResponse] = useState<TemplateSigningSessionResponse | null>(null);  // Not needed for SignWell
  // const [showSigningModal, setShowSigningModal] = useState(false);  // Not needed for SignWell
  const [signLoading, setSignLoading] = useState(false);
  const [signingError, setSigningError] = useState<string>('');
  const [signingStatus, setSigningStatus] = useState<'idle' | 'completed' | 'cancelled'>('idle');
  const { formData, handleInputChange, handleNestedInputChange } = useFormData();
  const { isStepValid } = useStepValidation(formData);


  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      // Sync email when moving from CompanyDetails to Directors
      if (currentStep === 0 && formData.email && !formData.bestuurder1.email) {
        handleNestedInputChange('bestuurder1', 'email', formData.email);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };


  // const handleCloseModal = () => {  // Not needed for SignWell
  //   setShowSigningModal(false);
  //   setTestResponse(null);
  // };

  // SignWell will handle the signing process via email

  const handleSignDocuments = async (): Promise<boolean> => {
    setSignLoading(true);
    setSigningError('');

    // Build signing session data using the type-safe helper
    const signingData = buildSigningSession(
      formData,
      "4e941c38-804a-4a38-991c-146639ede747" // Replace with actual template ID from config/env
    );

    
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://mister-subsidie-form-api-h8fvgydvheenczea.westeurope-01.azurewebsites.net';
      const apiFunctionCode = import.meta.env.VITE_FUNCTION_CODE || 'DDipjiIMeEVPtIY8Kx3C7hz4ME6us6EeDwddhRdoUhYKAzFuODcd5Q=='
      const response = await fetch(
        `${apiBaseUrl}/api/createSignWellTemplateSession?code=${apiFunctionCode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signingData),
        }
      );

      const result = await response.json();
      
      if (result.success || result.documentId) {
        // SignWell will send an email to the user
        setSigningStatus('completed');
        // Navigate to success page
        navigate('/bedankt');
        return true;
      } else if (result.error) {
        // Show error message
        console.error('SignWell error:', result.error, result.validationErrors);
        const errorMessage = result.validationErrors?.join(', ') || result.message || result.error;
        setSigningError(`Fout bij ondertekenen: ${errorMessage}`);
        setSignLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error calling SignWell API:', error);
      setSigningError(`Fout bij verbinding: ${error instanceof Error ? error.message : 'Onbekende fout'}`);
      setSignLoading(false);
      return false;
    } finally {
      setSignLoading(false);
    }
    
    return false;
  };

  const handleSubmit = () => {
    const allData = prepareFormData(formData);
    
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
        return <Authorization formData={formData} onInputChange={handleInputChange} onSign={handleSignDocuments} signingError={signingError} signingStatus={signingStatus} isLoading={signLoading} />;
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-light-4 to-gray-light-2">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">SLIM Subsidie Aanvraag</h1>
          <p className="text-gray-dark-2 font-medium">Vraag eenvoudig uw SLIM-subsidie aan via Mistersubsidie</p>
        </div> */}

        
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
      
      {/* DocuSign Modal removed - SignWell sends email instead */}
    </div>
  );
};

export default App;