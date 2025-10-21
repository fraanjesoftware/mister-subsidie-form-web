import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressSteps, Navigation } from './components/form';
import { AppLayout } from './components/layout';
import {
  CompanyDetails,
  Directors,
  BankStatement,
  CompanySize,
  StateAid,
  Authorization
} from './components/steps';
import { STEPS } from './constants/steps';
import { useFormData, useStepValidation } from './hooks';
import { useTenant } from './context/TenantProvider';
import { generateApplicationId } from './utils/applicationId';
import { submitCompanyData, uploadBankStatement, createSigningSession } from './services/api';

const App = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [signLoading, setSignLoading] = useState(false);
  const [signingError, setSigningError] = useState<string>('');
  const [signingStatus, setSigningStatus] = useState<'idle' | 'completed' | 'cancelled'>('idle');
  const { formData, handleInputChange, handleNestedInputChange } = useFormData();
  const { isStepValid } = useStepValidation(formData);
  const tenantInfo = useTenant();


  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      // Step 0: Generate ID and submit company data
      if (currentStep === 0 && !formData.applicationId) {
        const applicationId = generateApplicationId(formData);
        handleInputChange('applicationId', applicationId);

        // Submit to backend (fire-and-forget)
        submitCompanyData(formData, applicationId, tenantInfo.tenantId);
      }

      // Sync email to bestuurder1
      if (currentStep === 0 && formData.email && !formData.bestuurder1.email) {
        handleNestedInputChange('bestuurder1', 'email', formData.email);
      }

      // Step 1: Upload bank statement
      if (currentStep === 1 && formData.bankStatement && !formData.bankStatementUploaded) {
        const uploaded = await uploadBankStatement(
          formData.bankStatement,
          formData.applicationId!,
          { kvkNummer: formData.kvkNummer, bedrijfsnaam: formData.bedrijfsnaam }
        );

        if (uploaded) {
          handleInputChange('bankStatementUploaded', true);
        } else {
          return; // Don't proceed if upload failed
        }
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

    const result = await createSigningSession(formData, tenantInfo.tenantId);

    if (result.success) {
      setSigningStatus('completed');
      navigate('/bedankt');
      setSignLoading(false);
      return true;
    }

    setSigningError(`Fout bij ondertekenen: ${result.error}`);
    setSignLoading(false);
    return false;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CompanyDetails formData={formData} onInputChange={handleInputChange} />;
      case 1:
        return <BankStatement formData={formData} onInputChange={handleInputChange} />;
      case 2:
        return <Directors formData={formData} onNestedInputChange={handleNestedInputChange} />;
      case 3:
        return <CompanySize formData={formData} onInputChange={handleInputChange} />;
      case 4:
        return <StateAid formData={formData} onInputChange={handleInputChange} />;
      case 5:
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
