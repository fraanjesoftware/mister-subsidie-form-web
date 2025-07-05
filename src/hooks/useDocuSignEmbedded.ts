import { useEffect, useRef } from 'react';

interface DocuSignConfig {
  signingUrl: string;
  integrationKey: string;
  onReady?: () => void;
  onSessionEnd?: (event: any) => void;
  onError?: (error: any) => void;
}

export const useDocuSignEmbedded = ({
  signingUrl,
  integrationKey,
  onReady,
  onSessionEnd,
  onError
}: DocuSignConfig) => {
  const signingRef = useRef<any>(null);

  useEffect(() => {
    const initializeSigning = async () => {
      try {
        // Ensure DocuSign JS is loaded
        if (!(window as any).DocuSign) {
          throw new Error('DocuSign JS not loaded');
        }

        // Load DocuSign instance
        const docusign = await (window as any).DocuSign.loadDocuSign(integrationKey);

        // Configure signing
        const signingConfiguration = {
          url: signingUrl,
          displayFormat: 'default',
          style: {
            branding: {
              primaryButton: {
                backgroundColor: '#C7DA46',
                color: '#C7DA46',
              },
            },
          },
        };

        // Create signing instance
        signingRef.current = docusign.signing(signingConfiguration);

        // Wait a bit before mounting
        await new Promise(resolve => setTimeout(resolve, 100));

        // Mount the signing session
        const container = document.getElementById('docusign-signing-container');
        if (container && signingRef.current) {
          signingRef.current.mount('#docusign-signing-container');

          // Try to set up event handlers
          try {
            if (signingRef.current.on) {
              signingRef.current.on('ready', () => {
                console.log('DocuSign ready');
                onReady?.();
              });

              signingRef.current.on('sessionEnd', (event: any) => {
                console.log('DocuSign session ended:', event);
                onSessionEnd?.(event);
              });

              signingRef.current.on('error', (event: any) => {
                console.error('DocuSign error:', event);
                onError?.(event);
              });
            }
          } catch (eventError) {
            console.warn('Could not set up event handlers:', eventError);
          }
        }
      } catch (error) {
        console.error('Failed to initialize DocuSign:', error);
        onError?.(error);
      }
    };

    if (signingUrl && integrationKey) {
      initializeSigning();
    }

    // Cleanup
    return () => {
      if (signingRef.current && signingRef.current.unmount) {
        try {
          signingRef.current.unmount();
        } catch (e) {
          console.warn('Error unmounting DocuSign:', e);
        }
      }
    };
  }, [signingUrl, integrationKey, onReady, onSessionEnd, onError]);

  return signingRef.current;
};