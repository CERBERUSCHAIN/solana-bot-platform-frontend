// CERBERUS Bot - Create Strategy Modal Component
// Created: 2025-05-06 21:59:40 UTC
// Author: CERBERUSCHAINYes

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useStrategy } from '../../contexts/StrategyContext';

interface CreateStrategyModalProps {
  onClose: () => void;
}

export const CreateStrategyModal: React.FC<CreateStrategyModalProps> = ({ onClose }) => {
  const router = useRouter();
  const { createStrategy, isLoading } = useStrategy();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please provide a name for your strategy');
      return;
    }
    
    setError(null);
    try {
      const strategy = await createStrategy(name, description);
      router.push(`/strategies/${strategy.id}`);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to create strategy. Please try again.');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Create New Strategy</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900 bg-opacity-20 text-red-500 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="strategy-name" className="block text-sm font-medium text-gray-400 mb-1">
            Strategy Name *
          </label>
          <input
            id="strategy-name"
            type="text"
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setName(e.target.value)}
            placeholder="Enter a name for your strategy"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="strategy-description" className="block text-sm font-medium text-gray-400 mb-1">
            Description (optional)
          </label>
          <textarea
            id="strategy-description"
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your strategy's purpose and logic"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Create Strategy'}
          </button>
        </div>
      </div>
    </div>
  );
};
