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
import { submitCompanyInfo, uploadBankStatement, createSigningSession } from './services/api';
import { Alert } from './components/ui';

const App = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [signLoading, setSignLoading] = useState(false);
  const [signingError, setSigningError] = useState<string>('');
  const [signingStatus, setSigningStatus] = useState<'idle' | 'completed' | 'cancelled'>('idle');
  const [companyInfoWarning, setCompanyInfoWarning] = useState<string | null>(null);
  const { formData, handleInputChange, handleNestedInputChange } = useFormData();
  const { isStepValid } = useStepValidation(formData);
  const tenantInfo = useTenant();


  const handleNext = async () => {
    if (currentStep >= STEPS.length - 1 || isNextLoading) {
      return;
    }

    setIsNextLoading(true);

    try {
      if (currentStep === 0) {
        const applicationId = formData.applicationId ?? generateApplicationId(formData);

        if (!formData.applicationId) {
          handleInputChange('applicationId', applicationId);
        }

        const dataToSubmit = { ...formData, applicationId };

        if (tenantInfo?.tenantId) {
          const companyInfoResult = await submitCompanyInfo(
            dataToSubmit,
            applicationId,
            tenantInfo.tenantId
          );

          if (!companyInfoResult.success) {
            console.error('Failed to submit company info', companyInfoResult.error);
            setCompanyInfoWarning(
              'Het is niet gelukt om uw gegevens direct in ons systeem op te slaan. Wij verwerken dit handmatig, u kunt veilig doorgaan.'
            );
          } else {
            if (companyInfoWarning) {
              setCompanyInfoWarning(null);
            }

            if (companyInfoResult.folderId && companyInfoResult.folderId !== formData.folderId) {
              handleInputChange('folderId', companyInfoResult.folderId);
            }
          }
        }

        if (formData.email && !formData.bestuurder1.email) {
          handleNestedInputChange('bestuurder1', 'email', formData.email);
        }
      }

      if (
        currentStep === 1 &&
        formData.bankStatement &&
        !formData.bankStatementUploaded
      ) {
        const uploaded = await uploadBankStatement(
          formData.bankStatement,
          formData.applicationId!,
          { kvkNummer: formData.kvkNummer, bedrijfsnaam: formData.bedrijfsnaam },
          tenantInfo.tenantId,
          formData.folderId
        );

        if (!uploaded) {
          return; // Don't proceed if upload failed
        }

        handleInputChange('bankStatementUploaded', true);
      }

      setCurrentStep((step) => step + 1);
    } finally {
      setIsNextLoading(false);
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
          {companyInfoWarning && (
            <div className="mb-6">
              <Alert type="warning">
                {companyInfoWarning}
              </Alert>
            </div>
          )}
          {renderStep()}
        </div>
        
        <Navigation
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onPrev={handlePrev}
          onNext={handleNext}
          isStepValid={isStepValid(currentStep)}
          isLoading={isNextLoading}
        />
      </div>
    </AppLayout>
  );
};

export default App;
