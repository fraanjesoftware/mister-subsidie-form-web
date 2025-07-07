import { useEffect, useRef } from 'react';

interface DocuSignConfig {
  signingUrl: string;
  integrationKey: string;
  enabled?: boolean;
  onReady?: () => void;
  onSessionEnd?: (event: any) => void;
  onError?: (error: any) => void;
}

export const useDocuSignEmbedded = ({
  signingUrl,
  integrationKey,
  enabled = true,
  onReady,
  onSessionEnd,
  onError
}: DocuSignConfig) => {
  const signingRef = useRef<any>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Listen for CSP violations in console
    const originalError = console.error;
    console.error = function(...args: any[]) {
      const errorMessage = args.join(' ');
      if (errorMessage.includes('frame-ancestors') || errorMessage.includes('Content Security Policy')) {
        console.warn(
          '%c⚠️ DocuSign CSP Error Detected! %c\n' +
          'The backend needs to be updated to include frameAncestors in the createRecipientView call.\n' +
          'See BACKEND_DOCUSIGN_UPDATE.md for instructions.',
          'background: #ff6b6b; color: white; padding: 4px 8px; font-weight: bold;',
          'color: #ff6b6b; font-weight: normal;'
        );
      }
      originalError.apply(console, args);
    };
    
    const initializeSigning = async () => {
      try {
        console.log('Initializing DocuSign with integration key:', integrationKey ? 'Present' : 'Missing');
        
        // Set a timeout to detect if loading takes too long
        timeoutId = setTimeout(() => {
          console.error('DocuSign initialization timeout after 30 seconds');
          onError?.({ message: 'DocuSign initialization timed out. Please check your internet connection and try again.' });
        }, 30000);
        
        // Ensure DocuSign JS is loaded
        if (!(window as any).DocuSign) {
          console.error('DocuSign JS SDK not loaded. Make sure https://js-d.docusign.com/bundle.js is included in index.html');
          throw new Error('DocuSign JS SDK not loaded');
        }

        // Load DocuSign instance
        const docusign = await (window as any).DocuSign.loadDocuSign(integrationKey);
        console.log('DocuSign SDK loaded successfully');
        
        // Clear timeout since loading succeeded
        clearTimeout(timeoutId);

        // Configure signing
        const signingConfiguration = {
          url: signingUrl,
          displayFormat: 'default',
          style: {
            branding: {
              primaryButton: {
                backgroundColor: '#C7DA46',
                color: '#FFFFFF', // Fixed: White text on green background
              },
            },
          },
        };

        // Create signing instance
        signingRef.current = docusign.signing(signingConfiguration);
        
        // Check if signing instance was created successfully
        if (!signingRef.current) {
          throw new Error('Failed to create signing instance');
        }

        // Wait a bit before mounting
        await new Promise(resolve => setTimeout(resolve, 100));

        // Mount the signing session
        const container = document.getElementById('docusign-signing-container');
        console.log('Container element found:', !!container);
        
        if (container && signingRef.current) {
          console.log('Mounting DocuSign to container');
          signingRef.current.mount('#docusign-signing-container');

          // Set up event handlers
          try {
            // Set up ready event handler
            signingRef.current.on('ready', (event: any) => {
              console.log('DocuSign ready event:', event);
              onReady?.();
            });

            // Set up sessionEnd event handler
            signingRef.current.on('sessionEnd', (event: any) => {
              console.log('DocuSign session ended:', event);
              // Check the sessionEndType for specific handling
              if (event?.sessionEndType === 'signing_complete') {
                onSessionEnd?.({ status: 'signing_complete', ...event });
              } else if (event?.sessionEndType === 'decline') {
                onSessionEnd?.({ status: 'decline', ...event });
              } else if (event?.sessionEndType === 'ttl_expired') {
                onSessionEnd?.({ status: 'ttl_expired', ...event });
              } else if (event?.sessionEndType === 'cancel') {
                onSessionEnd?.({ status: 'cancel', ...event });
              } else {
                onSessionEnd?.(event);
              }
            });

            console.log('DocuSign event handlers set up successfully');
          } catch (eventError) {
            console.error('Error setting up event handlers:', eventError);
            // The error might be because events are set up differently
            // Let's continue without events for now
          }
        }
      } catch (error: any) {
        console.error('Failed to initialize DocuSign:', error);
        
        // Check for common issues
        if (error?.message?.includes('frame-ancestors') || error?.message?.includes('CSP')) {
          const cspError = new Error(
            'Content Security Policy error: The backend needs to include your domain in frameAncestors. ' +
            'Please update the backend createRecipientView call to include frameAncestors parameter.'
          );
          onError?.(cspError);
        } else if (error?.message?.includes('Failed to load')) {
          const loadError = new Error(
            'Failed to load DocuSign SDK. Please check your internet connection and try again.'
          );
          onError?.(loadError);
        } else {
          onError?.(error);
        }
      }
    };

    if (signingUrl && integrationKey && enabled) {
      console.log('Starting DocuSign initialization...');
      initializeSigning();
    } else {
      console.log('DocuSign not initialized:', { 
        hasSigningUrl: !!signingUrl, 
        hasIntegrationKey: !!integrationKey, 
        enabled 
      });
    }

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      console.error = originalError; // Restore original console.error
      if (signingRef.current && signingRef.current.unmount) {
        try {
          signingRef.current.unmount();
        } catch (e) {
          console.warn('Error unmounting DocuSign:', e);
        }
      }
    };
  }, [signingUrl, integrationKey, enabled, onReady, onSessionEnd, onError]);

  return signingRef.current;
};