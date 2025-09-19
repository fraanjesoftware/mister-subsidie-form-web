import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressSteps, Navigation } from './components/form';
import { AppLayout } from './components/layout';
import { 
  CompanyDetails, 
  Directors, 
  CompanySize, 
  StateAid, 
  Authorization
} from './components/steps';
import { STEPS } from './constants/steps';
import { useFormData, useStepValidation } from './hooks';
import { buildSigningSession } from './utils/buildSigningSession';
import { useTenant } from './context/TenantProvider';
import { getApiBaseUrl, getFunctionCode, getSignWellTemplateId } from './config/api';

const App = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [signLoading, setSignLoading] = useState(false);
  const [signingError, setSigningError] = useState<string>('');
  const [signingStatus, setSigningStatus] = useState<'idle' | 'completed' | 'cancelled'>('idle');
  const { formData, handleInputChange, handleNestedInputChange } = useFormData();
  const { isStepValid } = useStepValidation(formData);
  const tenantInfo = useTenant();


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

  const handleStepClick = (stepIndex: number) => {
    // Only allow navigation to previous steps (already completed)
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
    }
  };


  const handleSignDocuments = async (): Promise<boolean> => {
    setSignLoading(true);
    setSigningError('');

    // Build signing session data using the type-safe helper
    const signingData = buildSigningSession(
      formData,
      getSignWellTemplateId()
    );

    const payload = {
      ...signingData,
      tenantId: tenantInfo.tenantId,
      test: tenantInfo.tenantId === 'test',
    };

    
    try {
      const apiBaseUrl = getApiBaseUrl();
      const apiFunctionCode = getFunctionCode();
      const response = await fetch(
        `${apiBaseUrl}/api/createSignWellTemplateSession?code=${apiFunctionCode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
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
        return (
          <Authorization 
            formData={formData} 
            onInputChange={handleInputChange} 
            onSign={handleSignDocuments} 
            signingError={signingError} 
            signingStatus={signingStatus} 
            isLoading={signLoading}
            tenantInfo={tenantInfo}
          />
        );
      default:
        return null;
    }
  };


  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProgressSteps 
          steps={STEPS} 
          currentStep={currentStep} 
          onStepClick={handleStepClick}
        />
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {renderStep()}
        </div>
        
        <Navigation
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onPrev={handlePrev}
          onNext={handleNext}
          isStepValid={isStepValid(currentStep)}
        />
      </div>
    </AppLayout>
  );
};

export default App;
