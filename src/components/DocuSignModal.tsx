import React, { useState, useEffect } from 'react';
import { useDocuSignEmbedded } from '../hooks/useDocuSignEmbedded';

interface DocuSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  signingUrl?: string;
  isLoading?: boolean;
  onSigningComplete?: () => void;
  onSigningCancelled?: () => void;
}

export const DocuSignModal: React.FC<DocuSignModalProps> = ({ 
  isOpen, 
  onClose, 
  signingUrl,
  isLoading = false,
  onSigningComplete,
  onSigningCancelled
}) => {
  const [signingStatus, setSigningStatus] = useState<'idle' | 'loading' | 'ready' | 'completed' | 'cancelled' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [shouldMountDocuSign, setShouldMountDocuSign] = useState(false);

  // Check if integration key is set
  const integrationKey = import.meta.env.VITE_DOCUSIGN_INTEGRATION_KEY;
  
  useEffect(() => {
    // Debug: Log the environment variable status
    console.log('Environment check:', {
      integrationKey: integrationKey ? 'Set (hidden)' : 'Not set',
      env: import.meta.env,
      mode: import.meta.env.MODE
    });
    
    if (!integrationKey) {
      console.error('VITE_DOCUSIGN_INTEGRATION_KEY is not set in environment variables');
      setSigningStatus('error');
      setErrorMessage('DocuSign integration key is missing. Please check Azure App Settings configuration.');
    }
  }, [integrationKey]);

  const signing = useDocuSignEmbedded({
    signingUrl: signingUrl || '',
    integrationKey: integrationKey || '',
    enabled: shouldMountDocuSign && !!signingUrl && !!integrationKey,
    onReady: () => {
      console.log('DocuSign SDK is ready');
      setSigningStatus('ready');
    },
    onSessionEnd: (event) => {
      console.log('DocuSign session ended:', event);
      if (event?.status === 'signing_complete') {
        setSigningStatus('completed');
        setTimeout(() => {
          onSigningComplete?.();
          onClose();
        }, 2000);
      } else if (event?.status === 'cancel' || event?.status === 'decline') {
        setSigningStatus('cancelled');
        setTimeout(() => {
          onSigningCancelled?.();
          onClose();
        }, 2000);
      }
    },
    onError: (error) => {
      console.error('DocuSign error:', error);
      setSigningStatus('error');
      setErrorMessage(error?.message || 'An error occurred during signing');
    }
  });

  useEffect(() => {
    if (signingUrl && isOpen) {
      console.log('Modal opened with signing URL:', signingUrl);
      setSigningStatus('loading');
      // Delay mounting to ensure DOM is ready
      setTimeout(() => {
        setShouldMountDocuSign(true);
      }, 100);
    }
    
    return () => {
      setShouldMountDocuSign(false);
    };
  }, [signingUrl, isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl">
         
          
          {/* Content */}
          <div className="relative" style={{ height: '80vh' }}>
            {/* Loading State */}
            {(isLoading || signingStatus === 'loading') && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-gray-600">Loading signing session...</p>
                </div>
              </div>
            )}
            
            {/* Completed State */}
            {signingStatus === 'completed' && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="text-green-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Signing Complete!</h3>
                  <p className="mt-2 text-gray-600">Your document has been successfully signed.</p>
                </div>
              </div>
            )}
            
            {/* Cancelled State */}
            {signingStatus === 'cancelled' && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="text-yellow-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Signing Cancelled</h3>
                  <p className="mt-2 text-gray-600">The signing process was cancelled.</p>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {signingStatus === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="text-red-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Error</h3>
                  <p className="mt-2 text-gray-600">{errorMessage}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
            
            {/* DocuSign Container - SDK will mount here */}
            {/* Always render the container when we have a signing URL to avoid race conditions */}
            {signingUrl && (
              <div 
                id="docusign-signing-container" 
                className="w-full h-full" 
                style={{ 
                  display: (signingStatus === 'completed' || signingStatus === 'cancelled' || signingStatus === 'error') ? 'none' : 'block' 
                }}
              />
            )}
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              {signingStatus === 'ready' && 'Please complete the signing process in the window above.'}
              {signingStatus === 'loading' && 'Preparing your documents...'}
              {signingStatus === 'completed' && 'Document signed successfully!'}
              {signingStatus === 'cancelled' && 'Signing process was cancelled.'}
              {signingStatus === 'error' && 'An error occurred. Please try again.'}
            </p>
            {signingStatus !== 'completed' && signingStatus !== 'cancelled' && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};