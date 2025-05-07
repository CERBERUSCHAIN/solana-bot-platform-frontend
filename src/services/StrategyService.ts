// CERBERUS Bot - Strategy Service Interface
// Created: 2025-05-06 21:17:49 UTC
// Author: CERBERUSCHAINYes please and thank you.

import { 
    Strategy, 
    StrategyTemplate, 
    StrategyElementUnion, 
    BacktestConfig, 
    StrategyPerformance,
    StrategyExecution,
    StrategyExecutionStatus
  } from '../types/strategy';
  
  /**
   * Service for managing trading strategies
   */
  export interface StrategyService {
    /**
     * Get a list of strategies for the current user
     */
    getUserStrategies(): Promise<Strategy[]>;
    
    /**
     * Get a specific strategy by ID
     */
    getStrategy(strategyId: string): Promise<Strategy>;
    
    /**
     * Create a new strategy
     */
    createStrategy(strategy: Partial<Strategy>): Promise<Strategy>;
    
    /**
     * Update an existing strategy
     */
    updateStrategy(strategyId: string, updates: Partial<Strategy>): Promise<Strategy>;
    
    /**
     * Delete a strategy
     */
    deleteStrategy(strategyId: string): Promise<boolean>;
    
    /**
     * Clone an existing strategy
     */
    cloneStrategy(strategyId: string, newName: string): Promise<Strategy>;
    
    /**
     * Fork a public strategy from another user
     */
    forkStrategy(strategyId: string, newName: string): Promise<Strategy>;
    
    /**
     * Add a new element to a strategy
     */
    addStrategyElement(strategyId: string, element: Partial<StrategyElementUnion>): Promise<StrategyElementUnion>;
    
    /**
     * Update an existing strategy element
     */
    updateStrategyElement(strategyId: string, elementId: string, updates: Partial<StrategyElementUnion>): Promise<StrategyElementUnion>;
    
    /**
     * Delete a strategy element
     */
    deleteStrategyElement(strategyId: string, elementId: string): Promise<boolean>;
    
    /**
     * Run a backtest on a strategy
     */
    runBacktest(config: BacktestConfig): Promise<StrategyPerformance>;
    
    /**
     * Get all available strategy templates
     */
    getStrategyTemplates(category?: string, difficulty?: string): Promise<StrategyTemplate[]>;
    
    /**
     * Get a specific template by ID
     */
    getStrategyTemplate(templateId: string): Promise<StrategyTemplate>;
    
    /**
     * Create a strategy from a template
     */
    createStrategyFromTemplate(templateId: string, name: string): Promise<Strategy>;
    
    /**
     * Get popular strategies from the community
     */
    getPopularStrategies(): Promise<Strategy[]>;
    
    /**
     * Share a strategy with the community
     */
    shareStrategy(strategyId: string, makePublic: boolean): Promise<boolean>;
    
    /**
     * Deploy a strategy to a bot
     */
    deployStrategy(strategyId: string, botId: string): Promise<boolean>;
    
    /**
     * Get strategy execution history
     */
    getStrategyExecutions(strategyId: string): Promise<StrategyExecution[]>;
    
    /**
     * Get a specific strategy execution
     */
    getStrategyExecution(executionId: string): Promise<StrategyExecution>;
    
    /**
     * Update strategy execution status (pause/resume)
     */
    updateStrategyExecutionStatus(
      executionId: string, 
      status: StrategyExecutionStatus.PAUSED | StrategyExecutionStatus.RUNNING
    ): Promise<StrategyExecution>;
    
    /**
     * Stop a strategy execution
     */
    stopStrategyExecution(executionId: string): Promise<boolean>;
    
    /**
     * Download strategy as JSON
     */
    exportStrategy(strategyId: string): Promise<Blob>;
    
    /**
     * Import strategy from JSON
     */
    importStrategy(file: File): Promise<Strategy>;
    
    /**
     * Save current strategy as a template
     */
    saveAsTemplate(strategyId: string, templateDetails: { 
      name: string;
      description: string;
      category: string;
      difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
      tags?: string[];
    }): Promise<StrategyTemplate>;
    
    /**
     * Validate a strategy for errors
     */
    validateStrategy(strategyId: string): Promise<{
      isValid: boolean;
      errors: Array<{
        elementId: string;
        error: string;
      }>;
      warnings: Array<{
        elementId: string;
        warning: string;
      }>;
    }>;
  }