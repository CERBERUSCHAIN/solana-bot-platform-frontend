// CERBERUS Bot - Strategy Visualizer Component
// Created: 2025-05-07 00:28:52 UTC
// Author: CERBERUSCHAINYes

import React, { useState, useEffect } from 'react';
import { useStrategy } from '../../contexts/StrategyContext';
import { useBotExecution } from '../../contexts/BotExecutionContext';
import { StrategyCanvas } from '../Strategy/StrategyCanvas';
import { ElementExecutionResult } from '../../types/botExecution';

interface StrategyVisualizerProps {
  strategyId: string;
  sessionId: string;
  isLoading: boolean;
}

export const StrategyVisualizer: React.FC<StrategyVisualizerProps> = ({
  strategyId,
  sessionId,
  isLoading,
}) => {
  const { strategy, getStrategy } = useStrategy();
  const { elementExecutions, loadElementExecutionHistory } = useBotExecution();
  
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [elementResults, setElementResults] = useState<Record<string, ElementExecutionResult[]>>({});
  const [isLoadingElementHistory, setIsLoadingElementHistory] = useState(false);
  
  // Load strategy if not already loaded
  useEffect(() => {
    const loadStrategy = async () => {
      if (!strategy || strategy.id !== strategyId) {
        try {
          await getStrategy(strategyId);
        } catch (error) {
          console.error('Error loading strategy:', error);
        }
      }
    };
    
    loadStrategy();
  }, [strategyId]);
  
  // Load execution history for selected element
  useEffect(() => {
    const loadElementHistory = async () => {
      if (!selectedElementId) return;
      
      setIsLoadingElementHistory(true);
      try {
        await loadElementExecutionHistory(sessionId, selectedElementId);
      } catch (error) {
        console.error('Error loading element execution history:', error);
      } finally {
        setIsLoadingElementHistory(false);
      }
    };
    
    loadElementHistory();
  }, [selectedElementId, sessionId]);
  
  // Update element results when elementExecutions changes
  useEffect(() => {
    setElementResults(elementExecutions);
  }, [elementExecutions]);
  
  const handleSelectElement = (elementId: string) => {
    setSelectedElementId(elementId);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Strategy Visualization</h2>
        <p className="text-sm text-gray-400 mt-1">
          Select an element to see its execution history
        </p>
      </div>
      
      <div className="p-4">
        {!strategy || isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row">
            {/* Strategy Canvas */}
            <div className="lg:w-2/3 h-96">
              <StrategyCanvas 
                strategy={strategy} 
                onElementSelect={(element) => handleSelectElement(element.id)}
                executionResults={elementResults}
              />
            </div>
            
            {/* Element Execution Details */}
            <div className="lg:w-1/3 lg:pl-4 mt-4 lg:mt-0">
              <div className="bg-gray-750 rounded-lg p-4 h-full">
                {selectedElementId ? (
                  <div>
                    <h3 className="font-medium">Element Execution</h3>
                    {isLoadingElementHistory ? (
                      <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                      </div>
                    ) : elementExecutions[selectedElementId]?.length ? (
                      <div className="mt-3">
                        {elementExecutions[selectedElementId].map((result, index) => (
                          <div 
                            key={index} 
                            className={`p-3 mb-2 rounded ${
                              result.successful ? 'bg-green-900 bg-opacity-20' : 'bg-red-900 bg-opacity-20'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <span className={`font-medium ${result.successful ? 'text-green-400' : 'text-red-400'}`}>
                                  {result.name}
                                </span>
                                <span className="ml-2 text-xs text-gray-400">
                                  {result.executionTimeMs}ms
                                </span>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                result.successful ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                              }`}>
                                {result.successful ? 'SUCCESS' : 'FAILED'}
                              </span>
                            </div>
                            
                            {result.output && (
                              <div className="mt-2 text-xs bg-gray-800 p-2 rounded overflow-x-auto">
                                <pre className="text-gray-300">
                                  {JSON.stringify(result.output, null, 2)}
                                </pre>
                              </div>
                            )}
                            
                            {result.error && (
                              <div className="mt-2 text-xs bg-red-900 bg-opacity-30 p-2 rounded overflow-x-auto">
                                <pre className="text-red-400">
                                  {result.error}
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48 text-gray-400">
                        No execution data available for this element.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-gray-400">
                    Select an element to view its execution history.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};