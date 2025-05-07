// CERBERUS Bot - Strategy Editor Page
// Created: 2025-05-06 21:28:38 UTC
// Author: CERBERUSCHAINContinue please.

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { useStrategy } from '../../contexts/StrategyContext';
import { useBot } from '../../contexts/BotContext';
import { StrategyCanvas } from '../../components/Strategy/StrategyCanvas';
import { ElementPalette } from '../../components/Strategy/ElementPalette';
import { ElementConfig } from '../../components/Strategy/ElementConfig';
import { BacktestPanel } from '../../components/Strategy/BacktestPanel';
import { DeployStrategyModal } from '../../components/Strategy/DeployStrategyModal';
import { SaveTemplateModal } from '../../components/Strategy/SaveTemplateModal';
import { Strategy, StrategyElementUnion } from '../../types/strategy';

export default function StrategyEditorPage() {
  const router = useRouter();
  const { id } = router.query;
  const { 
    getStrategy, 
    updateStrategy,
    exportStrategy,
    validateStrategy,
    isLoading, 
    error, 
    currentStrategy 
  } = useStrategy();
  const { bots } = useBot();
  
  const [selectedElement, setSelectedElement] = useState<StrategyElementUnion | null>(null);
  const [validationResults, setValidationResults] = useState<{
    isValid: boolean;
    errors: Array<{ elementId: string; error: string; }>;
    warnings: Array<{ elementId: string; warning: string; }>;
  } | null>(null);
  const [isBacktestOpen, setIsBacktestOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [strategyName, setStrategyName] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  
  // Fetch strategy on initial load
  useEffect(() => {
    if (id && typeof id === 'string') {
      loadStrategy(id);
    }
  }, [id]);
  
  // Update local state when strategy changes
  useEffect(() => {
    if (currentStrategy) {
      setStrategyName(currentStrategy.name);
      setStrategyDescription(currentStrategy.description || '');
    }
  }, [currentStrategy]);
  
  const loadStrategy = async (strategyId: string) => {
    try {
      await getStrategy(strategyId);
    } catch (error) {
      console.error('Error loading strategy:', error);
    }
  };
  
  const handleSaveStrategy = async () => {
    if (!currentStrategy) return;
    
    try {
      await updateStrategy(currentStrategy.id, {
        name: strategyName,
        description: strategyDescription
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving strategy:', error);
    }
  };
  
  const handleExportStrategy = async () => {
    if (!currentStrategy) return;
    
    try {
      await exportStrategy(currentStrategy.id);
    } catch (error) {
      console.error('Error exporting strategy:', error);
    }
  };
  
  const handleValidateStrategy = async () => {
    if (!currentStrategy) return;
    
    try {
      const results = await validateStrategy(currentStrategy.id);
      setValidationResults(results);
    } catch (error) {
      console.error('Error validating strategy:', error);
    }
  };
  
  if (isLoading && !currentStrategy) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Head>
          <title>
            {currentStrategy ? `${currentStrategy.name} | Strategy Editor` : 'Strategy Editor'} | CERBERUS Bot
          </title>
        </Head>
        
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 py-3 px-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/strategies')}
                className="text-gray-400 hover:text-white flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Strategies
              </button>
              
              <div className="h-6 border-r border-gray-600"></div>
              
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input 
                    type="text"
                    value={strategyName}
                    onChange={(e) => setStrategyName(e.target.value)}
                    className="bg-gray-700 text-white text-lg font-semibold rounded px-2 py-1 w-64"
                    placeholder="Strategy Name"
                  />
                  <div className="flex space-x-1">
                    <button 
                      onClick={handleSaveStrategy}
                      className="text-green-400 hover:text-green-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => {
                        setStrategyName(currentStrategy?.name || '');
                        setStrategyDescription(currentStrategy?.description || '');
                        setIsEditing(false);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-semibold">
                    {currentStrategy?.name || 'Strategy Editor'}
                  </h1>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleValidateStrategy}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Validate
              </button>
              
              <button
                onClick={() => setIsBacktestOpen(!isBacktestOpen)}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                Backtest
              </button>
              
              <button
                onClick={() => setIsDeployModalOpen(true)}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md flex items-center text-sm"
                disabled={!currentStrategy || validationResults?.isValid === false}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                Deploy
              </button>
              
              <div className="h-6 border-r border-gray-600"></div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportStrategy}
                  className="text-gray-400 hover:text-white"
                  title="Export Strategy"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </button>
                
                <button
                  onClick={() => setIsSaveTemplateModalOpen(true)}
                  className="text-gray-400 hover:text-white"
                  title="Save as Template"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex overflow-hidden">
          {error && (
            <div className="absolute top-16 left-0 right-0 bg-red-900 bg-opacity-20 text-red-500 p-4 z-10">
              {error}
            </div>
          )}
          
          {/* Element Palette */}
          <div className="w-64 border-r border-gray-700 bg-gray-800 flex flex-col">
            <ElementPalette 
              onElementSelect={(element) => {
                // Handle element selection logic
                console.log('Selected element from palette:', element);
              }}
            />
          </div>
          
          {/* Strategy Canvas */}
          <div className="flex-1 flex flex-col">
            {/* Description (when editing) */}
            {isEditing && (
              <div className="p-4 bg-gray-800 border-b border-gray-700">
                <textarea
                  value={strategyDescription}
                  onChange={(e) => setStrategyDescription(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded p-2 h-20"
                  placeholder="Strategy description (optional)"
                />
              </div>
            )}
            
            {/* Strategy Canvas */}
            <div className="flex-1 relative">
              {currentStrategy ? (
                <StrategyCanvas
                  strategy={currentStrategy}
                  onElementSelect={setSelectedElement}
                  validationResults={validationResults}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Strategy not found</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Element Configuration Panel */}
          {selectedElement && (
            <div className="w-80 border-l border-gray-700 bg-gray-800 overflow-y-auto">
              <ElementConfig
                element={selectedElement}
                strategy={currentStrategy as Strategy}
                onClose={() => setSelectedElement(null)}
                onUpdate={(updates) => {
                  // Handle element update logic
                  console.log('Element updated:', updates);
                }}
              />
            </div>
          )}
          
          {/* Backtest Panel (slides in from right) */}
          {isBacktestOpen && currentStrategy && (
            <div className="absolute top-0 right-0 bottom-0 w-96 bg-gray-800 border-l border-gray-700 shadow-lg transform transition-transform z-10">
              <BacktestPanel
                strategy={currentStrategy}
                onClose={() => setIsBacktestOpen(false)}
              />
            </div>
          )}
        </main>
        
        {/* Modals */}
        {isDeployModalOpen && currentStrategy && (
          <DeployStrategyModal
            strategy={currentStrategy}
            bots={bots}
            onClose={() => setIsDeployModalOpen(false)}
          />
        )}
        
        {isSaveTemplateModalOpen && currentStrategy && (
          <SaveTemplateModal
            strategy={currentStrategy}
            onClose={() => setIsSaveTemplateModalOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}