import React, { useEffect } from 'react';

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
}) => {
  useEffect(() => {
    if (signingUrl && isOpen) {
      // Save current form state before redirecting
      const currentPath = window.location.pathname;
      sessionStorage.setItem('docusign_return_path', currentPath);
      sessionStorage.setItem('docusign_signing_in_progress', 'true');
      
      // Redirect to DocuSign
      window.location.href = signingUrl;
    }
  }, [signingUrl, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {isLoading ? 'Preparing documents...' : 'Redirecting to DocuSign...'}
            </h3>
            <p className="mt-2 text-gray-600">
              You will be redirected to DocuSign to complete the signing process.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};