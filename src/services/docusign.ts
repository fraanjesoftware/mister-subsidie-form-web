export const initializeDocuSignEmbeddedSigning = (
  _envelopeId: string,
  redirectUrl?: string
) => {
  // Create signing URL for embedded signing
  // In a real implementation, this URL would come from the API response
  // The API should return a signing URL with proper authentication tokens
  
  if (redirectUrl) {
    // If the API provides a complete redirect URL, use it directly
    window.location.href = redirectUrl;
  } else {
    // Otherwise, show the envelope ID
    console.log('DocuSign Envelope ID:', _envelopeId);
    alert(`DocuSign envelope aangemaakt!\n\nEnvelope ID: ${_envelopeId}\n\nGeen redirect URL ontvangen van de API.`);
  }
};

export const handleDocuSignCallback = (event: MessageEvent) => {
  // Handle DocuSign embedded signing events
  if (event.data && event.data.type === 'docusign') {
    switch (event.data.event) {
      case 'signing_complete':
        console.log('Signing completed successfully');
        // Handle successful signing
        window.location.href = '/success';
        break;
      case 'cancel':
        console.log('Signing cancelled by user');
        // Handle cancelled signing
        window.location.href = '/cancelled';
        break;
      case 'error':
        console.error('DocuSign error:', event.data.error);
        // Handle signing error
        alert('Er is een fout opgetreden tijdens het ondertekenen. Probeer het opnieuw.');
        break;
      default:
        console.log('Unknown DocuSign event:', event.data.event);
    }
  }
};

// Set up listener for DocuSign events
if (typeof window !== 'undefined') {
  window.addEventListener('message', handleDocuSignCallback);
}