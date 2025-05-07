// CERBERUS Bot - Import Wallet Modal Component
// Created: 2025-05-06 02:25:55 UTC
// Author: CERBERUSCHAIN1

import React, { useState } from 'react';

interface ImportWalletModalProps {
  onImport: (privateKey: string, name: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const ImportWalletModal: React.FC<ImportWalletModalProps> = ({
  onImport,
  onCancel,
  isLoading
}) => {
  const [privateKey, setPrivateKey] = useState('');
  const [walletName, setWalletName] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleImport = () => {
    if (!privateKey.trim()) {
      setError('Please enter a private key');
      return;
    }
    
    // Validate private key format (simple check for demonstration)
    if (privateKey.length < 32) {
      setError('Invalid private key format');
      return;
    }
    
    onImport(privateKey, walletName);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Import Wallet</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="wallet-name" className="block text-sm font-medium text-gray-400 mb-1">
              Wallet Name (Optional)
            </label>
            <input
              id="wallet-name"
              type="text"
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              placeholder="My Imported Wallet"
              value={walletName}
              onChange={(e) = aria-label="Input field" aria-label="Input field"> setWalletName(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="private-key" className="block text-sm font-medium text-gray-400 mb-1">
              Private Key
            </label>
            <textarea
              id="private-key"
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              placeholder="Enter your private key"
              rows={3}
              value={privateKey}
              onChange={(e) => {
                setPrivateKey(e.target.value);
                setError(null);
              }}
            />
            {error && (
              <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
          </div>
          
          <div className="bg-yellow-900 bg-opacity-20 text-yellow-300 p-3 rounded text-sm">
            <p>
              <strong>Warning:</strong> Never share your private key with anyone. CERBERUS will never ask for your private key outside of this import function.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            onClick={handleImport}
            disabled={isLoading}
          >
            {isLoading ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
};