// CERBERUS Bot - Execution Settings Component
// Created: 2025-05-07 00:28:52 UTC
// Author: CERBERUSCHAINYes

import React, { useState } from 'react';
import { BotExecutionSession, BotExecutionConfig, BlockchainNetwork } from '../../types/botExecution';

interface ExecutionSettingsProps {
  session: BotExecutionSession;
  onSaveSettings: (sessionId: string, config: Partial<BotExecutionConfig>) => Promise<BotExecutionSession>;
  isLoading: boolean;
}

export const ExecutionSettings: React.FC<ExecutionSettingsProps> = ({
  session,
  onSaveSettings,
  isLoading
}) => {
  const [config, setConfig] = useState<BotExecutionConfig>(session.config);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setErrorMessage('');
    
    try {
      await onSaveSettings(session.id, config);
      setIsEditing(false);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleResetSettings = () => {
    setConfig(session.config);
    setIsEditing(false);
    setErrorMessage('');
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
    
    // Mark as editing when value changes
    if (!isEditing) {
      setIsEditing(true);
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
    
    // Mark as editing when value changes
    if (!isEditing) {
      setIsEditing(true);
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Execution Settings</h2>
        
        {isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleResetSettings}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded flex items-center text-sm"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded flex items-center text-sm"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Settings'}
            </button>
          </div>
        )}
      </div>
      
      {errorMessage && (
        <div className="mx-6 mt-4 p-3 bg-red-900 bg-opacity-20 text-red-500 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Trade Limits */}
          <div className="bg-gray-750 p-4 rounded-md">
            <h3 className="text-md font-medium mb-3">Trade Limits</h3>
            
            <div className="space-y-3">
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
                />
              </div>
              
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
                />
              </div>
            </div>
          </div>
          
          {/* Risk Management */}
          <div className="bg-gray-750 p-4 rounded-md">
            <h3 className="text-md font-medium mb-3">Risk Management</h3>
            
            <div className="space-y-3">
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
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="trailingStopLoss"
                  type="checkbox"
                  checked={config.trailingStopLoss || false}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleCheckboxChange(e, 'trailingStopLoss')}
                  className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
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
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Gas Settings */}
          <div className="bg-gray-750 p-4 rounded-md">
            <h3 className="text-md font-medium mb-3">Gas Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="useDefaultGas"
                  type="checkbox"
                  checked={config.gasSettings.useDefaultGas}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleCheckboxChange(e, 'gasSettings.useDefaultGas')}
                  className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                />
                <label htmlFor="useDefaultGas" className="ml-2 block text-sm text-gray-400">
                  Use Default Gas Settings
                </label>
              </div>
              
              {!config.gasSettings.useDefaultGas && (
                <>
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
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Network & Trading Pairs */}
          <div className="bg-gray-750 p-4 rounded-md">
            <h3 className="text-md font-medium mb-3">Network & Trading Pairs</h3>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="network" className="block text-sm text-gray-400 mb-1">
                  Blockchain Network
                </label>
                <select
                  id="network"
                  value={config.network}
                  onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" handleInputChange(e, 'network')}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                >
                  {Object.values(BlockchainNetwork).map((network) => (
                    <option key={network} value={network}>
                      {network.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
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
                />
              </div>
              
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
                    if (!isEditing) setIsEditing(true);
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="ETH/USDC, WBTC/ETH"
                />
              </div>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="bg-gray-750 p-4 rounded-md">
            <h3 className="text-md font-medium mb-3">Notifications</h3>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="notifyOnTrade"
                  type="checkbox"
                  checked={config.notificationSettings.notifyOnTrade}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleCheckboxChange(e, 'notificationSettings.notifyOnTrade')}
                  className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                />
                <label htmlFor="notifyOnTrade" className="ml-2 block text-sm text-gray-400">
                  Notify on Trade Execution
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="notifyOnError"
                  type="checkbox"
                  checked={config.notificationSettings.notifyOnError}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleCheckboxChange(e, 'notificationSettings.notifyOnError')}
                  className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
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
                />
                <label htmlFor="notifyOnProfitTarget" className="ml-2 block text-sm text-gray-400">
                  Notify on Profit Target Reached
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="notifyOnStopLoss"
                  type="checkbox"
                  checked={config.notificationSettings.notifyOnStopLoss}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleCheckboxChange(e, 'notificationSettings.notifyOnStopLoss')}
                  className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-700"
                />
                <label htmlFor="notifyOnStopLoss" className="ml-2 block text-sm text-gray-400">
                  Notify on Stop Loss Triggered
                </label>
              </div>
            </div>
          </div>
          
          {/* Execution Timeouts */}
          <div className="bg-gray-750 p-4 rounded-md">
            <h3 className="text-md font-medium mb-3">Execution Timeouts</h3>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="executionTimeoutMs" className="block text-sm text-gray-400 mb-1">
                  Strategy Execution Timeout (ms)
                </label>
                <input
                  id="executionTimeoutMs"
                  type="number"
                  value={config.timeoutSettings.executionTimeoutMs}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleInputChange(e, 'timeoutSettings.executionTimeoutMs', true)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                  min="1000"
                  step="1000"
                />
              </div>
              
              <div>
                <label htmlFor="transactionTimeoutMs" className="block text-sm text-gray-400 mb-1">
                  Transaction Timeout (ms)
                </label>
                <input
                  id="transactionTimeoutMs"
                  type="number"
                  value={config.timeoutSettings.transactionTimeoutMs}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleInputChange(e, 'timeoutSettings.transactionTimeoutMs', true)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                  min="1000"
                  step="1000"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Button (when editing) - for mobile view */}
        {isEditing && (
          <div className="mt-6 md:hidden">
            <button
              onClick={handleSaveSettings}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white flex items-center justify-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
