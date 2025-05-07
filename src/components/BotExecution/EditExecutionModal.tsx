// CERBERUS Bot - Edit Execution Modal Component
// Created: 2025-05-07 00:48:50 UTC
// Author: CERBERUSCHAINYes

import React, { useState } from 'react';
import { BotExecutionSession, BotExecutionConfig, ExecutionFrequency } from '../../types/botExecution';
import { useBotExecution } from '../../contexts/BotExecutionContext';

interface EditExecutionModalProps {
  session: BotExecutionSession;
  onClose: () => void;
}

export const EditExecutionModal: React.FC<EditExecutionModalProps> = ({ session, onClose }) => {
  const { updateExecutionConfig } = useBotExecution();
  
  const [config, setConfig] = useState<BotExecutionConfig>(session.config);
  const [frequency, setFrequency] = useState<ExecutionFrequency>(session.frequency);
  const [intervalMinutes, setIntervalMinutes] = useState<number>(
    session.interval ? Math.floor(session.interval / (60 * 1000)) : 60
  );
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSave = async () => {
    setIsError(false);
    setIsSubmitting(true);
    
    // Create updated config
    const updatedConfig: Partial<BotExecutionConfig> = {
      ...config
    };
    
    try {
      await updateExecutionConfig(session.id, updatedConfig);
      
      // If frequency changed, that would require additional backend calls
      // to update the session frequency - this is a simplified version
      
      onClose();
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message || 'Failed to update execution settings');
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
    field: string, 
    isNumeric = false
  ) => {
    const value = isNumeric ? parseFloat(e.target.value) : e.target.value;
    
    // Handle nested fields
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setConfig(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof BotExecutionConfig],
          [child]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.checked;
    
    // Handle nested fields
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setConfig(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof BotExecutionConfig],
          [child]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Execution Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {isError && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-800 rounded-md text-red-400">
            {errorMessage}
          </div>
        )}
        
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          <div className="space-y-6">
            {/* Risk Management Settings */}
            <div>
              <h3 className="text-md font-semibold mb-3 pb-1 border-b border-gray-700">Risk Management</h3>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="maxExposurePercentage" className="block text-sm text-gray-400 mb-1">
                    Max Exposure (% of portfolio)
                  </label>
                  <input
                    id="maxExposurePercentage"
                    type="number"
                    value={config.maxExposurePercentage}
                    onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleInputChange(e, 'maxExposurePercentage', true)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                    min="1"
                    max="100"
                    step="0.1"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="maxConcurrentTrades" className="block text-sm text-gray-400 mb-1">
                      Max Concurrent Trades
                    </label>
                    <input
                      id="maxConcurrentTrades"
                      type="number"
                      value={config.maxConcurrentTrades}
                      onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleInputChange(e, 'maxConcurrentTrades', true)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                      min="1"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="maxDailyTrades" className="block text-sm text-gray-400 mb-1">
                      Max Daily Trades
                    </label>
                    <input
                      id="maxDailyTrades"
                      type="number"
                      value={config.maxDailyTrades}
                      onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleInputChange(e, 'maxDailyTrades', true)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                      min="1"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="stopLossPercentage" className="block text-sm text-gray-400 mb-1">
                      Global Stop Loss (%)
                    </label>
                    <input
                      id="stopLossPercentage"
                      type="number"
                      value={config.stopLossPercentage || ''}
                      onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleInputChange(e, 'stopLossPercentage', true)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                      min="0.1"
                      step="0.1"
                      placeholder="No global stop loss"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="takeProfitPercentage" className="block text-sm text-gray-400 mb-1">
                      Global Take Profit (%)
                    </label>
                    <input
                      id="takeProfitPercentage"
                      type="number"
                      value={config.takeProfitPercentage || ''}
                      onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleInputChange(e, 'takeProfitPercentage', true)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                      min="0.1"
                      step="0.1"
                      placeholder="No global take profit"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="trailingStopLoss"
                    type="checkbox"
                    checked={config.trailingStopLoss || false}
                    onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleCheckboxChange(e, 'trailingStopLoss')}
                    className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="trailingStopLoss" className="ml-2 block text-sm text-gray-400">
                    Use Trailing Stop Loss
                  </label>
                </div>
                
                {config.trailingStopLoss && (
                  <div>
                    <label htmlFor="trailingStopLossOffset" className="block text-sm text-gray-400 mb-1">
                      Trailing Offset (%)
                    </label>
                    <input
                      id="trailingStopLossOffset"
                      type="number"
                      value={config.trailingStopLossOffset || 1}
                      onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleInputChange(e, 'trailingStopLossOffset', true)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                      min="0.1"
                      step="0.1"
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Trade Execution Settings */}
            <div>
              <h3 className="text-md font-semibold mb-3 pb-1 border-b border-gray-700">Trade Execution</h3>
              
              {/* Only show frequency options if the execution is not already running */}
              {session.status !== 'running' && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Execution Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" setFrequency(e.target.value as ExecutionFrequency)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                    disabled={isSubmitting}
                  >
                    <option value={ExecutionFrequency.CONTINUOUS}>Continuous (Real-time)</option>
                    <option value={ExecutionFrequency.INTERVAL}>Interval (Fixed time periods)</option>
                    <option value={ExecutionFrequency.SCHEDULED}>Scheduled (Specific times)</option>
                    <option value={ExecutionFrequency.TRIGGERED}>Triggered (External events)</option>
                    <option value={ExecutionFrequency.MANUAL}>Manual (User triggered)</option>
                  </select>
                  
                  {frequency === ExecutionFrequency.INTERVAL && (
                    <div className="mt-3">
                      <label htmlFor="intervalMinutes" className="block text-sm text-gray-400 mb-1">
                        Interval (minutes)
                      </label>
                      <input
                        id="intervalMinutes"
                        type="number"
                        value={intervalMinutes}
                        onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setIntervalMinutes(parseInt(e.target.value) || 0)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                        min="1"
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                </div>
              )}
              
              <div>
                <label htmlFor="slippageTolerance" className="block text-sm text-gray-400 mb-1">
                  Slippage Tolerance (%)
                </label>
                <input
                  id="slippageTolerance"
                  type="number"
                  value={config.slippageTolerance}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleInputChange(e, 'slippageTolerance', true)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                  min="0.1"
                  step="0.1"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            {/* Gas Settings */}
            <div>
              <h3 className="text-md font-semibold mb-3 pb-1 border-b border-gray-700">Gas Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="useDefaultGas"
                    type="checkbox"
                    checked={config.gasSettings.useDefaultGas}
                    onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleCheckboxChange(e, 'gasSettings.useDefaultGas')}
                    className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="useDefaultGas" className="ml-2 block text-sm text-gray-400">
                    Use Default Gas Settings
                  </label>
                </div>
                
                {!config.gasSettings.useDefaultGas && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="gasMultiplier" className="block text-sm text-gray-400 mb-1">
                        Gas Price Multiplier
                      </label>
                      <input
                        id="gasMultiplier"
                        type="number"
                        value={config.gasSettings.gasMultiplier}
                        onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleInputChange(e, 'gasSettings.gasMultiplier', true)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                        min="0.1"
                        step="0.1"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Multiplier for suggested gas price (1.0 = use suggested)
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="maxGasPrice" className="block text-sm text-gray-400 mb-1">
                        Max Gas Price (Gwei)
                      </label>
                      <input
                        id="maxGasPrice"
                        type="text"
                        value={config.gasSettings.maxGasPrice || ''}
                        onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleInputChange(e, 'gasSettings.maxGasPrice')}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                        placeholder="No maximum"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Notification Settings */}
            <div>
              <h3 className="text-md font-semibold mb-3 pb-1 border-b border-gray-700">Notifications</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <input
                    id="notifyOnTrade"
                    type="checkbox"
                    checked={config.notificationSettings.notifyOnTrade}
                    onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleCheckboxChange(e, 'notificationSettings.notifyOnTrade')}
                    className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="notifyOnTrade" className="ml-2 block text-sm text-gray-400">
                    Notify on Trade
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="notifyOnError"
                    type="checkbox"
                    checked={config.notificationSettings.notifyOnError}
                    onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleCheckboxChange(e, 'notificationSettings.notifyOnError')}
                    className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="notifyOnError" className="ml-2 block text-sm text-gray-400">
                    Notify on Error
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="notifyOnProfitTarget"
                    type="checkbox"
                    checked={config.notificationSettings.notifyOnProfitTarget}
                    onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleCheckboxChange(e, 'notificationSettings.notifyOnProfitTarget')}
                    className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="notifyOnProfitTarget" className="ml-2 block text-sm text-gray-400">
                    Notify on Profit Target
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="notifyOnStopLoss"
                    type="checkbox"
                    checked={config.notificationSettings.notifyOnStopLoss}
                    onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleCheckboxChange(e, 'notificationSettings.notifyOnStopLoss')}
                    className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="notifyOnStopLoss" className="ml-2 block text-sm text-gray-400">
                    Notify on Stop Loss
                  </label>
                </div>
              </div>
            </div>
            
            {/* Trading Pairs */}
            <div>
              <h3 className="text-md font-semibold mb-3 pb-1 border-b border-gray-700">Trading Pairs</h3>
              
              <div>
                <label htmlFor="tradingPairs" className="block text-sm text-gray-400 mb-1">
                  Trading Pairs (comma separated)
                </label>
                <input
                  id="tradingPairs"
                  type="text"
                  value={config.tradingPairs.join(',')}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" {
                    const pairs = e.target.value.split(',').map(pair => pair.trim()).filter(Boolean);
                    setConfig(prev => ({ ...prev, tradingPairs: pairs }));
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="ETH/USDC, WBTC/ETH"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
