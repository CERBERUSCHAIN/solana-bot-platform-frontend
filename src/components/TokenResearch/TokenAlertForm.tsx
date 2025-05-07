// CERBERUS Bot - Token Alert Form Component
// Created: 2025-05-06 15:51:38 UTC
// Author: CERBERUSCHAIN

import React, { useState } from 'react';
import { AlertType } from '../../types/token';

interface TokenAlertFormProps {
  tokenSymbol: string;
  tokenAddress: string;
  onSubmit: (alertType: AlertType, threshold: number, timeframe?: string) => Promise<void>;
  onCancel: () => void;
}

export const TokenAlertForm: React.FC<TokenAlertFormProps> = ({ 
  tokenSymbol, 
  tokenAddress, 
  onSubmit, 
  onCancel 
}) => {
  const [alertType, setAlertType] = useState<AlertType>(AlertType.PRICE_ABOVE);
  const [threshold, setThreshold] = useState<number>(0);
  const [timeframe, setTimeframe] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (threshold <= 0) {
      alert('Please enter a valid threshold value');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(alertType, threshold, timeframe || undefined);
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create alert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderThresholdInput = () => {
    switch (alertType) {
      case AlertType.PRICE_ABOVE:
      case AlertType.PRICE_BELOW:
        return (
          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-400 mb-1">
              Price Threshold (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                id="threshold"
                type="number"
                min="0"
                step="0.000001"
                className="bg-gray-700 text-white rounded pl-8 py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={threshold}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setThreshold(parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
        );
      
      case AlertType.PERCENT_CHANGE:
        return (
          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-400 mb-1">
              Percentage Change
            </label>
            <div className="relative">
              <input
                id="threshold"
                type="number"
                min="0"
                step="0.1"
                className="bg-gray-700 text-white rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={threshold}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setThreshold(parseFloat(e.target.value))}
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
            </div>
            
            <div className="mt-3">
              <label htmlFor="timeframe" className="block text-sm font-medium text-gray-400 mb-1">
                Time Period
              </label>
              <select
                id="timeframe"
                className="bg-gray-700 text-white rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={timeframe}
                onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" setTimeframe(e.target.value)}
                required
              >
                <option value="">Select time period</option>
                <option value="5m">5 minutes</option>
                <option value="15m">15 minutes</option>
                <option value="1h">1 hour</option>
                <option value="4h">4 hours</option>
                <option value="1d">1 day</option>
              </select>
            </div>
          </div>
        );
      
      case AlertType.VOLUME_SPIKE:
        return (
          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-400 mb-1">
              Volume Increase (x multiplier)
            </label>
            <div className="relative">
              <input
                id="threshold"
                type="number"
                min="1"
                step="0.1"
                className="bg-gray-700 text-white rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={threshold}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setThreshold(parseFloat(e.target.value))}
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">x</span>
            </div>
            
            <div className="mt-3">
              <label htmlFor="timeframe" className="block text-sm font-medium text-gray-400 mb-1">
                Time Period
              </label>
              <select
                id="timeframe"
                className="bg-gray-700 text-white rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={timeframe}
                onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" setTimeframe(e.target.value)}
                required
              >
                <option value="">Select time period</option>
                <option value="5m">5 minutes</option>
                <option value="15m">15 minutes</option>
                <option value="1h">1 hour</option>
                <option value="4h">4 hours</option>
              </select>
            </div>
          </div>
        );
      
      case AlertType.LIQUIDITY_CHANGE:
        return (
          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-400 mb-1">
              Liquidity Change
            </label>
            <div className="relative">
              <input
                id="threshold"
                type="number"
                step="0.1"
                className="bg-gray-700 text-white rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={threshold}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setThreshold(parseFloat(e.target.value))}
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>
        );
      
      case AlertType.WHALE_MOVEMENT:
        return (
          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-400 mb-1">
              Transaction Value (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                id="threshold"
                type="number"
                min="0"
                className="bg-gray-700 text-white rounded pl-8 py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={threshold}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setThreshold(parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
        );
      
      case AlertType.SOCIAL_VOLUME:
        return (
          <div>
            <label htmlFor="threshold" className="block text-sm font-medium text-gray-400 mb-1">
              Social Activity Increase (x multiplier)
            </label>
            <div className="relative">
              <input
                id="threshold"
                type="number"
                min="1"
                step="0.1"
                className="bg-gray-700 text-white rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={threshold}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setThreshold(parseFloat(e.target.value))}
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">x</span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Create Alert for {tokenSymbol}</h3>
          <button
            className="text-gray-400 hover:text-white"
            onClick={onCancel}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="alertType" className="block text-sm font-medium text-gray-400 mb-1">
              Alert Type
            </label>
            <select
              id="alertType"
              className="bg-gray-700 text-white rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={alertType}
              onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" setAlertType(e.target.value as AlertType)}
              required
            >
              <option value={AlertType.PRICE_ABOVE}>Price Above</option>
              <option value={AlertType.PRICE_BELOW}>Price Below</option>
              <option value={AlertType.PERCENT_CHANGE}>Percent Change</option>
              <option value={AlertType.VOLUME_SPIKE}>Volume Spike</option>
              <option value={AlertType.LIQUIDITY_CHANGE}>Liquidity Change</option>
              <option value={AlertType.WHALE_MOVEMENT}>Whale Movement</option>
              <option value={AlertType.SOCIAL_VOLUME}>Social Volume</option>
            </select>
          </div>
          
          {renderThresholdInput()}
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
