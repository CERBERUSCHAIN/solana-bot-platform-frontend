// CERBERUS Bot - Strategy Context
// Created: 2025-05-06 21:17:49 UTC
// Author: CERBERUSCHAINYes please and thank you.

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Strategy, 
  StrategyTemplate, 
  StrategyElementUnion, 
  BacktestConfig, 
  StrategyPerformance,
  StrategyExecution,
  StrategyExecutionStatus,
  StrategyElementType
} from '../types/strategy';
import { StrategyService } from '../services/StrategyService';
import { StrategyServiceImpl } from '../services/implementations/StrategyServiceImpl';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface StrategyContextType {
  // State
  strategies: Strategy[];
  currentStrategy: Strategy | null;
  templates: StrategyTemplate[];
  popularStrategies: Strategy[];
  currentExecution: StrategyExecution | null;
  backtest: StrategyPerformance | null;
  isLoading: boolean;
  error: string | null;
  
  // Methods
  loadStrategies: () => Promise<Strategy[]>;
  getStrategy: (id: string) => Promise<Strategy>;
  createStrategy: (name: string, description?: string) => Promise<Strategy>;
  updateStrategy: (strategyId: string, updates: Partial<Strategy>) => Promise<Strategy>;
  deleteStrategy: (strategyId: string) => Promise<boolean>;
  cloneStrategy: (strategyId: string, newName: string) => Promise<Strategy>;
  forkStrategy: (strategyId: string, newName: string) => Promise<Strategy>;
  
  // Strategy Elements
  addStrategyElement: (strategyId: string, element: Partial<StrategyElementUnion>) => Promise<StrategyElementUnion>;
  updateStrategyElement: (strategyId: string, elementId: string, updates: Partial<StrategyElementUnion>) => Promise<StrategyElementUnion>;
  deleteStrategyElement: (strategyId: string, elementId: string) => Promise<boolean>;
  
  // Templates
  loadTemplates: (category?: string, difficulty?: string) => Promise<StrategyTemplate[]>;
  getTemplate: (templateId: string) => Promise<StrategyTemplate>;
  createFromTemplate: (templateId: string, name: string) => Promise<Strategy>;
  saveAsTemplate: (strategyId: string, templateDetails: {
    name: string;
    description: string;
    category: string;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
  }) => Promise<StrategyTemplate>;
  
  // Backtesting
  runBacktest: (config: BacktestConfig) => Promise<StrategyPerformance>;
  
  // Execution
  loadExecutions: (strategyId: string) => Promise<StrategyExecution[]>;
  getExecution: (executionId: string) => Promise<StrategyExecution>;
  pauseExecution: (executionId: string) => Promise<StrategyExecution>;
  resumeExecution: (executionId: string) => Promise<StrategyExecution>;
  stopExecution: (executionId: string) => Promise<boolean>;
  deployStrategyToBot: (strategyId: string, botId: string) => Promise<boolean>;
  
  // Utilities
  exportStrategy: (strategyId: string) => Promise<void>;
  importStrategy: (file: File) => Promise<Strategy>;
  validateStrategy: (strategyId: string) => Promise<{
    isValid: boolean;
    errors: Array<{ elementId: string; error: string; }>;
    warnings: Array<{ elementId: string; warning: string; }>;
  }>;
  
  // Element Creation Helpers
  createIndicator: (
    strategyId: string, 
    type: StrategyElementType, 
    name: string, 
    parameters: Record<string, any>
  ) => Promise<StrategyElementUnion>;
  
  createCondition: (
    strategyId: string,
    type: StrategyElementType,
    name: string,
    leftOperandId: string,
    rightOperandId: string,
    secondaryOperandId?: string
  ) => Promise<StrategyElementUnion>;
  
  createTrigger: (
    strategyId: string,
    type: StrategyElementType,
    name: string,
    parameters: Record<string, any>
  ) => Promise<StrategyElementUnion>;
  
  createAction: (
    strategyId: string,
    type: StrategyElementType,
    name: string,
    parameters: Record<string, any>
  ) => Promise<StrategyElementUnion>;
  
  createLogic: (
    strategyId: string,
    type: StrategyElementType,
    name: string,
    childIds: string[]
  ) => Promise<StrategyElementUnion>;
  
  // Community
  loadPopularStrategies: () => Promise<Strategy[]>;
  shareStrategy: (strategyId: string, makePublic: boolean) => Promise<boolean>;
}

const StrategyContext = createContext<StrategyContextType | undefined>(undefined);

export const StrategyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [service, setService] = useState<StrategyService | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(null);
  const [templates, setTemplates] = useState<StrategyTemplate[]>([]);
  const [popularStrategies, setPopularStrategies] = useState<Strategy[]>([]);
  const [currentExecution, setCurrentExecution] = useState<StrategyExecution | null>(null);
  const [backtest, setBacktest] = useState<StrategyPerformance | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize service when user is authenticated
  useEffect(() => {
    if (user) {
      const strategyService = new StrategyServiceImpl();
      setService(strategyService);
    }
  }, [user]);
  
  /**
   * Load user's strategies
   */
  const loadStrategies = async (): Promise<Strategy[]> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userStrategies = await service.getUserStrategies();
      setStrategies(userStrategies);
      return userStrategies;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load strategies';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get a specific strategy by ID
   */
  const getStrategy = async (id: string): Promise<Strategy> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const strategy = await service.getStrategy(id);
      setCurrentStrategy(strategy);
      return strategy;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to load strategy ${id}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create a new strategy
   */
  const createStrategy = async (name: string, description?: string): Promise<Strategy> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a basic strategy structure with a root "IF-THEN" element
      const rootElementId = uuidv4();
      
      const newStrategy: Partial<Strategy> = {
        name,
        description,
        elements: {
          [rootElementId]: {
            id: rootElementId,
            type: StrategyElementType.IF_THEN,
            name: 'Root Condition',
            childIds: [],
          }
        },
        rootElementId,
        isActive: false,
        public: false
      };
      
      const createdStrategy = await service.createStrategy(newStrategy);
      setStrategies(prev => [...prev, createdStrategy]);
      setCurrentStrategy(createdStrategy);
      return createdStrategy;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create strategy';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update an existing strategy
   */
  const updateStrategy = async (strategyId: string, updates: Partial<Strategy>): Promise<Strategy> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedStrategy = await service.updateStrategy(strategyId, updates);
      setStrategies(prev => 
        prev.map(strategy => 
          strategy.id === strategyId ? updatedStrategy : strategy
        )
      );
      
      if (currentStrategy && currentStrategy.id === strategyId) {
        setCurrentStrategy(updatedStrategy);
      }
      
      return updatedStrategy;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to update strategy ${strategyId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete a strategy
   */
  const deleteStrategy = async (strategyId: string): Promise<boolean> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.deleteStrategy(strategyId);
      
      if (success) {
        setStrategies(prev => prev.filter(strategy => strategy.id !== strategyId));
        
        if (currentStrategy && currentStrategy.id === strategyId) {
          setCurrentStrategy(null);
        }
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to delete strategy ${strategyId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Clone an existing strategy
   */
  const cloneStrategy = async (strategyId: string, newName: string): Promise<Strategy> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const clonedStrategy = await service.cloneStrategy(strategyId, newName);
      setStrategies(prev => [...prev, clonedStrategy]);
      return clonedStrategy;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to clone strategy ${strategyId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fork a public strategy from another user
   */
  const forkStrategy = async (strategyId: string, newName: string): Promise<Strategy> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const forkedStrategy = await service.forkStrategy(strategyId, newName);
      setStrategies(prev => [...prev, forkedStrategy]);
      return forkedStrategy;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to fork strategy ${strategyId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Add a strategy element
   */
  const addStrategyElement = async (strategyId: string, element: Partial<StrategyElementUnion>): Promise<StrategyElementUnion> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newElement = await service.addStrategyElement(strategyId, element);
      
      if (currentStrategy && currentStrategy.id === strategyId) {
        // Update current strategy with new element
        setCurrentStrategy(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            elements: {
              ...prev.elements,
              [newElement.id]: newElement
            }
          };
        });
      }
      
      return newElement;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add strategy element';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update a strategy element
   */
  const updateStrategyElement = async (
    strategyId: string, 
    elementId: string, 
    updates: Partial<StrategyElementUnion>
  ): Promise<StrategyElementUnion> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedElement = await service.updateStrategyElement(strategyId, elementId, updates);
      
      if (currentStrategy && currentStrategy.id === strategyId) {
        // Update current strategy with updated element
        setCurrentStrategy(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            elements: {
              ...prev.elements,
              [elementId]: updatedElement
            }
          };
        });
      }
      
      return updatedElement;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to update element ${elementId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete a strategy element
   */
  const deleteStrategyElement = async (strategyId: string, elementId: string): Promise<boolean> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.deleteStrategyElement(strategyId, elementId);
      
      if (success && currentStrategy && currentStrategy.id === strategyId) {
        // Remove element from current strategy
        setCurrentStrategy(prev => {
          if (!prev) return prev;
          
          const updatedElements = { ...prev.elements };
          delete updatedElements[elementId];
          
          return {
            ...prev,
            elements: updatedElements
          };
        });
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to delete element ${elementId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load strategy templates
   */
  const loadTemplates = async (category?: string, difficulty?: string): Promise<StrategyTemplate[]> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const strategyTemplates = await service.getStrategyTemplates(category, difficulty);
      setTemplates(strategyTemplates);
      return strategyTemplates;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load strategy templates';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get a specific template
   */
  const getTemplate = async (templateId: string): Promise<StrategyTemplate> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getStrategyTemplate(templateId);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to load template ${templateId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create strategy from template
   */
  const createFromTemplate = async (templateId: string, name: string): Promise<Strategy> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newStrategy = await service.createStrategyFromTemplate(templateId, name);
      setStrategies(prev => [...prev, newStrategy]);
      setCurrentStrategy(newStrategy);
      return newStrategy;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to create strategy from template ${templateId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Save strategy as template
   */
  const saveAsTemplate = async (strategyId: string, templateDetails: {
    name: string;
    description: string;
    category: string;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
  }): Promise<StrategyTemplate> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.saveAsTemplate(strategyId, templateDetails);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to save strategy ${strategyId} as template`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Run strategy backtest
   */
  const runBacktest = async (config: BacktestConfig): Promise<StrategyPerformance> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await service.runBacktest(config);
      setBacktest(result);
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to run backtest';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load strategy executions
   */
  const loadExecutions = async (strategyId: string): Promise<StrategyExecution[]> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getStrategyExecutions(strategyId);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to load executions for strategy ${strategyId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get strategy execution
   */
  const getExecution = async (executionId: string): Promise<StrategyExecution> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const execution = await service.getStrategyExecution(executionId);
      setCurrentExecution(execution);
      return execution;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to load execution ${executionId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Pause strategy execution
   */
  const pauseExecution = async (executionId: string): Promise<StrategyExecution> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const execution = await service.updateStrategyExecutionStatus(
        executionId,
        StrategyExecutionStatus.PAUSED
      );
      
      if (currentExecution && currentExecution.id === executionId) {
        setCurrentExecution(execution);
      }
      
      return execution;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to pause execution ${executionId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Resume strategy execution
   */
  const resumeExecution = async (executionId: string): Promise<StrategyExecution> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const execution = await service.updateStrategyExecutionStatus(
        executionId,
        StrategyExecutionStatus.RUNNING
      );
      
      if (currentExecution && currentExecution.id === executionId) {
        setCurrentExecution(execution);
      }
      
      return execution;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to resume execution ${executionId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Stop strategy execution
   */
  const stopExecution = async (executionId: string): Promise<boolean> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.stopStrategyExecution(executionId);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to stop execution ${executionId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Deploy strategy to bot
   */
  const deployStrategyToBot = async (strategyId: string, botId: string): Promise<boolean> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.deployStrategy(strategyId, botId);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to deploy strategy ${strategyId} to bot ${botId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Export strategy as JSON file
   */
  const exportStrategy = async (strategyId: string): Promise<void> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const blob = await service.exportStrategy(strategyId);
      
      // Find strategy name
      const strategy = strategies.find(s => s.id === strategyId);
      const fileName = strategy 
        ? `${strategy.name.replace(/\s+/g, '_')}_strategy.json`
        : `strategy_${strategyId}.json`;
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to export strategy ${strategyId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Import strategy from JSON file
   */
  const importStrategy = async (file: File): Promise<Strategy> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const importedStrategy = await service.importStrategy(file);
      setStrategies(prev => [...prev, importedStrategy]);
      return importedStrategy;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to import strategy';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Validate strategy
   */
  const validateStrategy = async (strategyId: string): Promise<{
    isValid: boolean;
    errors: Array<{ elementId: string; error: string; }>;
    warnings: Array<{ elementId: string; warning: string; }>;
  }> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.validateStrategy(strategyId);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to validate strategy ${strategyId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load popular strategies
   */
  const loadPopularStrategies = async (): Promise<Strategy[]> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const popular = await service.getPopularStrategies();
      setPopularStrategies(popular);
      return popular;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load popular strategies';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Share strategy
   */
  const shareStrategy = async (strategyId: string, makePublic: boolean): Promise<boolean> => {
    if (!service) throw new Error('Strategy service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.shareStrategy(strategyId, makePublic);
      
      if (success) {
        // Update strategy in list
        setStrategies(prev => 
          prev.map(strategy => 
            strategy.id === strategyId ? { ...strategy, public: makePublic } : strategy
          )
        );
        
        // Update current strategy if it's the one being shared
        if (currentStrategy && currentStrategy.id === strategyId) {
          setCurrentStrategy({ ...currentStrategy, public: makePublic });
        }
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${makePublic ? 'share' : 'unshare'} strategy ${strategyId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Element Creation Helper Methods
  
  /**
   * Create indicator element
   */
  const createIndicator = async (
    strategyId: string,
    type: StrategyElementType,
    name: string,
    parameters: Record<string, any>
  ): Promise<StrategyElementUnion> => {
    const element = {
      type,
      name,
      parameters,
      id: uuidv4()
    };
    
    return addStrategyElement(strategyId, element);
  };
  
  /**
   * Create condition element
   */
  const createCondition = async (
    strategyId: string,
    type: StrategyElementType,
    name: string,
    leftOperandId: string,
    rightOperandId: string,
    secondaryOperandId?: string
  ): Promise<StrategyElementUnion> => {
    const element = {
      type,
      name,
      leftOperandId,
      rightOperandId,
      secondaryOperandId,
      id: uuidv4()
    };
    
    return addStrategyElement(strategyId, element);
  };
  
  /**
   * Create trigger element
   */
  const createTrigger = async (
    strategyId: string,
    type: StrategyElementType,
    name: string,
    parameters: Record<string, any>
  ): Promise<StrategyElementUnion> => {
    const element = {
      type,
      name,
      parameters,
      id: uuidv4()
    };
    
    return addStrategyElement(strategyId, element);
  };
  
  /**
   * Create action element
   */
  const createAction = async (
    strategyId: string,
    type: StrategyElementType,
    name: string,
    parameters: Record<string, any>
  ): Promise<StrategyElementUnion> => {
    const element = {
      type,
      name,
      parameters,
      id: uuidv4()
    };
    
    return addStrategyElement(strategyId, element);
  };
  
  /**
   * Create logic element
   */
  const createLogic = async (
    strategyId: string,
    type: StrategyElementType,
    name: string,
    childIds: string[]
  ): Promise<StrategyElementUnion> => {
    const element = {
      type,
      name,
      childIds,
      id: uuidv4()
    };
    
    return addStrategyElement(strategyId, element);
  };
  
  // Context value
  const contextValue: StrategyContextType = {
    // State
    strategies,
    currentStrategy,
    templates,
    popularStrategies,
    currentExecution,
    backtest,
    isLoading,
    error,
    
    // Methods
    loadStrategies,
    getStrategy,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    cloneStrategy,
    forkStrategy,
    
    // Strategy Elements
    addStrategyElement,
    updateStrategyElement,
    deleteStrategyElement,
    
    // Templates
    loadTemplates,
    getTemplate,
    createFromTemplate,
    saveAsTemplate,
    
    // Backtesting
    runBacktest,
    
    // Execution
    loadExecutions,
    getExecution,
    pauseExecution,
    resumeExecution,
    stopExecution,
    deployStrategyToBot,
    
    // Utilities
    exportStrategy,
    importStrategy,
    validateStrategy,
    
    // Element Creation Helpers
    createIndicator,
    createCondition,
    createTrigger,
    createAction,
    createLogic,
    
    // Community
    loadPopularStrategies,
    shareStrategy
  };
  
  return (
    <StrategyContext.Provider value={contextValue}>
      {children}
    </StrategyContext.Provider>
  );
};

export const useStrategy = () => {
  const context = useContext(StrategyContext);
  
  if (context === undefined) {
    throw new Error('useStrategy must be used within a StrategyProvider');
  }
  
  return context;
};