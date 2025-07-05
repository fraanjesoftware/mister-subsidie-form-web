// Use proxy in development, full URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://mister-subsidie-form-api-h8fvgydvheenczea.westeurope-01.azurewebsites.net/api';

interface SigningSessionResponse {
  envelopeId: string;
  redirectUrl?: string;
  status?: string;
  message?: string;
}

export const createSigningSession = async (formData: any): Promise<SigningSessionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/createSigningSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.envelopeId) {
      throw new Error('No envelope ID received from API');
    }

    return data;
  } catch (error) {
    console.error('Error creating signing session:', error);
    throw error;
  }
};

export const createTestSigningSession = async (): Promise<SigningSessionResponse> => {
  const testData = {
    formType: "mkb",
    signer: {
      email: "director@example.com",
      name: "Company Director"
    },
    formData: {
      companyName: "Test MKB Company B.V.",
      financialYear: "2024",
      employees: 45,
      annualTurnover: 8500000,
      balanceTotal: 4200000,
      signerName: "Company Director",
      signerPosition: "Managing Director",
      dateAndLocation: "Amsterdam, 05-07-2025",
      isIndependent: true,
      addSignatureAnchors: true
    }
  };

  return createSigningSession(testData);
};