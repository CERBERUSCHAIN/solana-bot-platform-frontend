// CERBERUS Bot - Wallet Actions Component
// Created: 2025-05-06 02:25:55 UTC
// Author: CERBERUSCHAIN1

import React, { useState } from 'react';
import { Wallet } from '../../types/wallet';

interface WalletActionsProps {
  wallet: Wallet;
  onRename: (address: string, newName: string) => Promise<void>;
  onDelete: (address: string) => Promise<void>;
}

export const WalletActions: React.FC<WalletActionsProps> = ({ 
  wallet, 
  onRename, 
  onDelete 
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(wallet.name || '');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRename = async () => {
    if (newName.trim() === '') return;
    
    setIsLoading(true);
    try {
      await onRename(wallet.address, newName);
      setIsRenaming(false);
    } catch (error) {
      console.error('Failed to rename wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = () => {
    onDelete(wallet.address);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Wallet Actions</h3>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
            onClick={() => setIsSendModalOpen(true)}
          >
            Send Funds
          </button>
          
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(wallet.address);
              alert('Wallet address copied to clipboard!');
            }}
          >
            Copy Address
          </button>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-3">Wallet Settings</h4>
          
          {isRenaming ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="bg-gray-800 text-white text-sm rounded px-3 py-2 flex-1"
                value={newName}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setNewName(e.target.value)}
                placeholder="Enter wallet name"
                aria-label="New wallet name"
              />
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-3 rounded"
                onClick={handleRename}
                disabled={isLoading}
              >
                Save
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium py-2 px-3 rounded"
                onClick={() => setIsRenaming(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="text-indigo-400 hover:text-indigo-300 text-sm"
              onClick={() => setIsRenaming(true)}
            >
              Rename Wallet
            </button>
          )}
          
          <div className="mt-3 pt-3 border-t border-gray-600">
            <button
              className="text-red-400 hover:text-red-300 text-sm"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete Wallet
            </button>
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-3">Export Options</h4>
          
          <div className="space-y-2">
            <button
              className="w-full text-left px-2 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
              onClick={() => alert('This feature is not yet implemented')}
            >
              Export Private Key
            </button>
            
            <button
              className="w-full text-left px-2 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
              onClick={() => alert('This feature is not yet implemented')}
            >
              Export Seed Phrase
            </button>
            
            <button
              className="w-full text-left px-2 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
              onClick={() => alert('This feature is not yet implemented')}
            >
              Export Transaction History
            </button>
          </div>
        </div>
        
        <div className="text-xs text-gray-400 py-2">
          Last updated: {new Date(wallet.lastUpdated).toLocaleString()}
        </div>
      </div>
      
      {isSendModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Send Funds</h3>
            <p className="text-gray-400 mb-4">This feature is currently under development.</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                onClick={() => setIsSendModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
