// CERBERUS Bot - Start Execution Modal Component
// Created: 2025-05-07 00:42:31 UTC
// Author: CERBERUSCHAINStartExecutionModal component "StartExecutionnModal.tsx" is NOT complete

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useBot } from '../../contexts/BotContext';
import { useStrategy } from '../../contexts/StrategyContext';
import { useWallet } from '../../contexts/WalletContext';
import { useBotExecution } from '../../contexts/BotExecutionContext';
import { ExecutionFrequency, ExecutionMode, BotExecutionConfig, BlockchainNetwork } from '../../types/botExecution';

interface StartExecutionModalProps {
  onClose: () => void;
}

export const StartExecutionModal: React.FC<StartExecutionModalProps> = ({ onClose }) => {
  const router = useRouter();
  const { bots, isLoading: botsLoading } = useBot();
  const { strategies, loadStrategies, isLoading: strategiesLoading } = useStrategy();
  const { walletConnections, isLoading: walletsLoading } = useWallet();
  const { startExecution, isLoading: executionLoading } = useBotExecution();
  
  const [selectedBotId, setSelectedBotId] = useState('');
  const [selectedStrategyId, setSelectedStrategyId] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState('');
  const [executionMode, setExecutionMode] = useState<ExecutionMode>(ExecutionMode.PAPER);
  const [executionFrequency, setExecutionFrequency] = useState<ExecutionFrequency>(ExecutionFrequency.INTERVAL);
  const [intervalMinutes, setIntervalMinutes] = useState(60); // Default: 60 minutes
  const [scheduledTime, setScheduledTime] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default configuration
  const defaultConfig: BotExecutionConfig = {
    maxConcurrentTrades: 1,
    maxDailyTrades: 10,
    maxExposurePercentage: 50,
    stopLossPercentage: 5,
    takeProfitPercentage: 10,
    trailingStopLoss: false,
    slippageTolerance: 0.5,
    gasSettings: {
      useDefaultGas: true,
      gasMultiplier: 1.0
    },
    retrySettings: {
      maxRetries: 3,
      retryDelayMs: 15000
    },
    timeoutSettings: {
      executionTimeoutMs: 60000,
      transactionTimeoutMs: 30000
    },
    notificationSettings: {
      notifyOnTrade: true,
      notifyOnError: true,
      notifyOnProfitTarget: true,
      notifyOnStopLoss: true
    },
    tradingPairs: ['ETH/USDC'],
    network: BlockchainNetwork.ETHEREUM,
    allowedStrategyElements: []
  };
  
  // Load strategies if not already loaded
  useEffect(() => {
    if (!strategies || strategies.length === 0) {
      loadStrategies();
    }
  }, []);
  
  // Validate form before submission
  const validateForm = () => {
    if (!selectedBotId) {
      setErrorMessage('Please select a bot');
      setIsError(true);
      return false;
    }
    
    if (!selectedStrategyId) {
      setErrorMessage('Please select a strategy');
      setIsError(true);
      return false;
    }
    
    if (executionMode === ExecutionMode.REAL && !selectedWalletId) {
      setErrorMessage('Please select a wallet for real trading');
      setIsError(true);
      return false;
    }
    
    if (executionFrequency === ExecutionFrequency.INTERVAL && (!intervalMinutes || intervalMinutes <= 0)) {
      setErrorMessage('Please enter a valid interval in minutes');
      setIsError(true);
      return false;
    }
    
    if (executionFrequency === ExecutionFrequency.SCHEDULED && !scheduledTime) {
      setErrorMessage('Please select a scheduled time');
      setIsError(true);
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);
    
    if (!validateForm()) return;
    
    const executionConfig = {
      ...defaultConfig,
      // For interval frequency, convert minutes to milliseconds
      interval: executionFrequency === ExecutionFrequency.INTERVAL ? intervalMinutes * 60 * 1000 : undefined
    };
    
    setIsSubmitting(true);
    
    try {
      const session = await startExecution({
        botId: selectedBotId,
        strategyId: selectedStrategyId,
        mode: executionMode,
        frequency: executionFrequency,
        walletId: executionMode === ExecutionMode.REAL ? selectedWalletId : undefined,
        config: executionConfig
      });
      
      // Navigate to the execution details page
      router.push(`/bot-execution/${session.id}`);
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.message || 'Failed to start execution');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Start Bot Execution</h2>
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
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Bot Selection */}
            <div>
              <label htmlFor="bot" className="block text-sm font-medium text-gray-400 mb-1">
                Bot <span className="text-red-500">*</span>
              </label>
              <select
                id="bot"
                value={selectedBotId}
                onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" setSelectedBotId(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                required
                disabled={isSubmitting || botsLoading}
              >
                <option value="">Select a bot</option>
                {bots.map((bot) => (
                  <option key={bot.id} value={bot.id}>
                    {bot.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Strategy Selection */}
            <div>
              <label htmlFor="strategy" className="block text-sm font-medium text-gray-400 mb-1">
                Strategy <span className="text-red-500">*</span>
              </label>
              <select
                id="strategy"
                value={selectedStrategyId}
                onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" setSelectedStrategyId(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                required
                disabled={isSubmitting || strategiesLoading}
              >
                <option value="">Select a strategy</option>
                {strategies.map((strategy) => (
                  <option key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Execution Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Execution Mode <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`
                  flex items-center p-3 border rounded-md cursor-pointer
                  ${executionMode === ExecutionMode.PAPER 
                    ? 'bg-indigo-900 bg-opacity-30 border-indigo-500' 
                    : 'bg-gray-750 border-gray-600 hover:bg-gray-700'}
                `}>
                  <input
                    type="radio"
                    name="executionMode"
                    value={ExecutionMode.PAPER}
                    checked={executionMode === ExecutionMode.PAPER}
                    onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setExecutionMode(ExecutionMode.PAPER)}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">Paper Trading</span>
                    <span className="text-xs text-gray-400 mt-1">
                      Simulated trading with virtual funds
                    </span>
                  </div>
                </label>
                
                <label className={`
                  flex items-center p-3 border rounded-md cursor-pointer
                  ${executionMode === ExecutionMode.REAL 
                    ? 'bg-indigo-900 bg-opacity-30 border-indigo-500' 
                    : 'bg-gray-750 border-gray-600 hover:bg-gray-700'}
                `}>
                  <input
                    type="radio"
                    name="executionMode"
                    value={ExecutionMode.REAL}
                    checked={executionMode === ExecutionMode.REAL}
                    onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setExecutionMode(ExecutionMode.REAL)}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">Real Trading</span>
                    <span className="text-xs text-gray-400 mt-1">
                      Execute real trades with actual funds
                    </span>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Wallet Selection (only for real trading) */}
            {executionMode === ExecutionMode.REAL && (
              <div>
                <label htmlFor="wallet" className="block text-sm font-medium text-gray-400 mb-1">
                  Wallet <span className="text-red-500">*</span>
                </label>
                <select
                  id="wallet"
                  value={selectedWalletId}
                  onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" setSelectedWalletId(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                  required
                  disabled={isSubmitting || walletsLoading}
                >
                  <option value="">Select a wallet</option>
                  {walletConnections.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name} ({wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)})
                    </option>
                  ))}
                </select>
                
                {walletConnections.length === 0 && (
                  <p className="text-yellow-500 text-xs mt-1">
                    No wallets connected. Go to Portfolio to connect a wallet.
                  </p>
                )}
              </div>
            )}
            
            {/* Execution Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Execution Frequency <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <label className={`
                  flex items-center p-3 border rounded-md cursor-pointer
                  ${executionFrequency === ExecutionFrequency.CONTINUOUS 
                    ? 'bg-indigo-900 bg-opacity-30 border-indigo-500' 
                    : 'bg-gray-750 border-gray-600 hover:bg-gray-700'}
                `}>
                  <input
                    type="radio"
                    name="executionFrequency"
                    value={ExecutionFrequency.CONTINUOUS}
                    checked={executionFrequency === ExecutionFrequency.CONTINUOUS}
                    onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setExecutionFrequency(ExecutionFrequency.CONTINUOUS)}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">Continuous</span>
                    <span className="text-xs text-gray-400 mt-1">
                      Monitor and execute in real-time
                    </span>
                  </div>
                </label>
                
                <label className={`
                  flex items-center p-3 border rounded-md cursor-pointer
                  ${executionFrequency === ExecutionFrequency.INTERVAL 
                    ? 'bg-indigo-900 bg-opacity-30 border-indigo-500' 
                    : 'bg-gray-750 border-gray-600 hover:bg-gray-700'}
                `}>
                  <input
                    type="radio"
                    name="executionFrequency"
                    value={ExecutionFrequency.INTERVAL}
                    checked={executionFrequency === ExecutionFrequency.INTERVAL}
                    onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setExecutionFrequency(ExecutionFrequency.INTERVAL)}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">Interval</span>
                    <span className="text-xs text-gray-400 mt-1">
                      Execute at fixed time intervals
                    </span>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className={`
                  flex items-center p-3 border rounded-md cursor-pointer
                  ${executionFrequency === ExecutionFrequency.SCHEDULED 
                    ? 'bg-indigo-900 bg-opacity-30 border-indigo-500' 
                    : 'bg-gray-750 border-gray-600 hover:bg-gray-700'}
                `}>
                  <input
                    type="radio"
                    name="executionFrequency"
                    value={ExecutionFrequency.SCHEDULED}
                    checked={executionFrequency === ExecutionFrequency.SCHEDULED}
                    onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setExecutionFrequency(ExecutionFrequency.SCHEDULED)}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">Scheduled</span>
                    <span className="text-xs text-gray-400 mt-1">
                      Execute at specific times
                    </span>
                  </div>
                </label>
                
                <label className={`
                  flex items-center p-3 border rounded-md cursor-pointer
                  ${executionFrequency === ExecutionFrequency.TRIGGERED 
                    ? 'bg-indigo-900 bg-opacity-30 border-indigo-500' 
                    : 'bg-gray-750 border-gray-600 hover:bg-gray-700'}
                `}>
                  <input
                    type="radio"
                    name="executionFrequency"
                    value={ExecutionFrequency.TRIGGERED}
                    checked={executionFrequency === ExecutionFrequency.TRIGGERED}
                    onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setExecutionFrequency(ExecutionFrequency.TRIGGERED)}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">Triggered</span>
                    <span className="text-xs text-gray-400 mt-1">
                      Execute on external triggers
                    </span>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Interval Settings (only for INTERVAL frequency) */}
            {executionFrequency === ExecutionFrequency.INTERVAL && (
              <div>
                <label htmlFor="intervalMinutes" className="block text-sm font-medium text-gray-400 mb-1">
                  Interval (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  id="intervalMinutes"
                  type="number"
                  value={intervalMinutes}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setIntervalMinutes(parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                  min="1"
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}
            
            {/* Scheduled Time (only for SCHEDULED frequency) */}
            {executionFrequency === ExecutionFrequency.SCHEDULED && (
              <div>
                <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-400 mb-1">
                  Scheduled Time <span className="text-red-500">*</span>
                </label>
                <input
                  id="scheduledTime"
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setScheduledTime(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}
            
            {/* Advanced Options (simplified for now) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-400">Advanced Options</label>
                <button
                  type="button"
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                  onClick={() => {
                    // In a real implementation, this would toggle advanced options
                    // For now, we'll just show a message
                    alert('Advanced options would be shown here');
                  }}
                  disabled={isSubmitting}
                >
                  Configure
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Includes risk management, gas settings, and more
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded flex items-center"
              disabled={isSubmitting || botsLoading || strategiesLoading || (executionMode === ExecutionMode.REAL && walletsLoading)}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting...
                </>
              ) : (
                'Start Execution'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
