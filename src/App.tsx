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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SLIM Subsidie Aanvraag</h1>
          <p className="text-gray-600">Vraag eenvoudig uw SLIM-subsidie aan via Mistersubsidie</p>
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
    </div>
  );
};

export default App;