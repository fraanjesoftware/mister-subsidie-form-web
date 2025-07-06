import React from 'react';

interface DocuSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  signingUrl?: string;
  isLoading?: boolean;
}

export const DocuSignModal: React.FC<DocuSignModalProps> = ({ 
  isOpen, 
  onClose, 
  signingUrl,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">DocuSign Document Signing</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="relative" style={{ height: '80vh' }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-gray-600">Loading signing session...</p>
                </div>
              </div>
            )}
            
            {signingUrl && !isLoading && (
              <iframe 
                src={signingUrl}
                className="w-full h-full"
                title="DocuSign Signing"
                allow="camera; microphone"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                onLoad={() => console.log('DocuSign iframe loaded in modal')}
                onError={(e) => console.error('DocuSign iframe error in modal:', e)}
              />
            )}
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Please complete the signing process in the window above.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};