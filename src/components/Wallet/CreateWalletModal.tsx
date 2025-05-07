// CERBERUS Bot - Create Wallet Modal Component
// Created: 2025-05-06 02:55:08 UTC
// Author: CERBERUSCHAINAfter 10.

import React, { useState } from 'react';

interface CreateWalletModalProps {
  onCreate: (name: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const CreateWalletModal: React.FC<CreateWalletModalProps> = ({
  onCreate,
  onCancel,
  isLoading
}) => {
  const [walletName, setWalletName] = useState('');
  
  const handleCreate = () => {
    onCreate(walletName);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Create New Wallet</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="new-wallet-name" className="block text-sm font-medium text-gray-400 mb-1">
              Wallet Name (Optional)
            </label>
            <input
              id="new-wallet-name"
              type="text"
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              placeholder="My New Wallet"
              value={walletName}
              onChange={(e) = aria-label="Input field" aria-label="Input field"> setWalletName(e.target.value)}
            />
          </div>
          
          <div className="bg-indigo-900 bg-opacity-20 text-indigo-300 p-3 rounded text-sm">
            <p>
              This will create a new hot wallet that will be encrypted and stored locally. You can use this wallet for trading bots and other operations.
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
            onClick={handleCreate}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Wallet'}
          </button>
        </div>
      </div>
    </div>
  );
};