// CERBERUS Bot - Strategy Service Implementation
// Created: 2025-05-06 21:17:49 UTC
// Author: CERBERUSCHAINYes please and thank you.

import { StrategyService } from '../StrategyService';
import { 
  Strategy,
  StrategyTemplate, 
  StrategyElementUnion, 
  BacktestConfig, 
  StrategyPerformance,
  StrategyExecution,
  StrategyExecutionStatus
} from '../../types/strategy';
import axios from 'axios';

export class StrategyServiceImpl implements StrategyService {
  /**
   * Get headers with authentication
   */
  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem('cerberus_access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
  
  /**
   * Get a list of strategies for the current user
   */
  async getUserStrategies(): Promise<Strategy[]> {
    try {
      const response = await axios.get(
        '/api/strategies',
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user strategies:', error);
      throw error;
    }
  }
  
  /**
   * Get a specific strategy by ID
   */
  async getStrategy(strategyId: string): Promise<Strategy> {
    try {
      const response = await axios.get(
        `/api/strategies/${strategyId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching strategy ${strategyId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new strategy
   */
  async createStrategy(strategy: Partial<Strategy>): Promise<Strategy> {
    try {
      const response = await axios.post(
        '/api/strategies',
        strategy,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating strategy:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing strategy
   */
  async updateStrategy(strategyId: string, updates: Partial<Strategy>): Promise<Strategy> {
    try {
      const response = await axios.put(
        `/api/strategies/${strategyId}`,
        updates,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating strategy ${strategyId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a strategy
   */
  async deleteStrategy(strategyId: string): Promise<boolean> {
    try {
      const response = await axios.delete(
        `/api/strategies/${strategyId}`,
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error(`Error deleting strategy ${strategyId}:`, error);
      throw error;
    }
  }
  
  /**
   * Clone an existing strategy
   */
  async cloneStrategy(strategyId: string, newName: string): Promise<Strategy> {
    try {
      const response = await axios.post(
        `/api/strategies/${strategyId}/clone`,
        { name: newName },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error cloning strategy ${strategyId}:`, error);
      throw error;
    }
  }
  
  /**
   * Fork a public strategy from another user
   */
  async forkStrategy(strategyId: string, newName: string): Promise<Strategy> {
    try {
      const response = await axios.post(
        `/api/strategies/${strategyId}/fork`,
        { name: newName },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error forking strategy ${strategyId}:`, error);
      throw error;
    }
  }
  
  /**
   * Add a new element to a strategy
   */
  async addStrategyElement(strategyId: string, element: Partial<StrategyElementUnion>): Promise<StrategyElementUnion> {
    try {
      const response = await axios.post(
        `/api/strategies/${strategyId}/elements`,
        element,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding element to strategy ${strategyId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update an existing strategy element
   */
  async updateStrategyElement(
    strategyId: string, 
    elementId: string, 
    updates: Partial<StrategyElementUnion>
  ): Promise<StrategyElementUnion> {
    try {
      const response = await axios.put(
        `/api/strategies/${strategyId}/elements/${elementId}`,
        updates,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating element ${elementId} in strategy ${strategyId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a strategy element
   */
  async deleteStrategyElement(strategyId: string, elementId: string): Promise<boolean> {
    try {
      const response = await axios.delete(
        `/api/strategies/${strategyId}/elements/${elementId}`,
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error(`Error deleting element ${elementId} from strategy ${strategyId}:`, error);
      throw error;
    }
  }
  
  /**
   * Run a backtest on a strategy
   */
  async runBacktest(config: BacktestConfig): Promise<StrategyPerformance> {
    try {
      const response = await axios.post(
        '/api/strategies/backtest',
        config,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error running backtest:', error);
      throw error;
    }
  }
  
  /**
   * Get all available strategy templates
   */
  async getStrategyTemplates(category?: string, difficulty?: string): Promise<StrategyTemplate[]> {
    try {
      let url = '/api/strategies/templates';
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (difficulty) params.append('difficulty', difficulty);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      console.error('Error fetching strategy templates:', error);
      throw error;
    }
  }
  
  /**
   * Get a specific template by ID
   */
  async getStrategyTemplate(templateId: string): Promise<StrategyTemplate> {
    try {
      const response = await axios.get(
        `/api/strategies/templates/${templateId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching template ${templateId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a strategy from a template
   */
  async createStrategyFromTemplate(templateId: string, name: string): Promise<Strategy> {
    try {
      const response = await axios.post(
        `/api/strategies/templates/${templateId}/create`,
        { name },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error creating strategy from template ${templateId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get popular strategies from the community
   */
  async getPopularStrategies(): Promise<Strategy[]> {
    try {
      const response = await axios.get(
        '/api/strategies/popular',
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching popular strategies:', error);
      throw error;
    }
  }
  
  /**
   * Share a strategy with the community
   */
  async shareStrategy(strategyId: string, makePublic: boolean): Promise<boolean> {
    try {
      const response = await axios.post(
        `/api/strategies/${strategyId}/share`,
        { public: makePublic },
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error(`Error sharing strategy ${strategyId}:`, error);
      throw error;
    }
  }
  
  /**
   * Deploy a strategy to a bot
   */
  async deployStrategy(strategyId: string, botId: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `/api/strategies/${strategyId}/deploy`,
        { botId },
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error(`Error deploying strategy ${strategyId} to bot ${botId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get strategy execution history
   */
  async getStrategyExecutions(strategyId: string): Promise<StrategyExecution[]> {
    try {
      const response = await axios.get(
        `/api/strategies/${strategyId}/executions`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching executions for strategy ${strategyId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get a specific strategy execution
   */
  async getStrategyExecution(executionId: string): Promise<StrategyExecution> {
    try {
      const response = await axios.get(
        `/api/strategies/executions/${executionId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching execution ${executionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update strategy execution status (pause/resume)
   */
  async updateStrategyExecutionStatus(
    executionId: string, 
    status: StrategyExecutionStatus.PAUSED | StrategyExecutionStatus.RUNNING
  ): Promise<StrategyExecution> {
    try {
      const response = await axios.put(
        `/api/strategies/executions/${executionId}/status`,
        { status },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating execution ${executionId} status:`, error);
      throw error;
    }
  }
  
  /**
   * Stop a strategy execution
   */
  async stopStrategyExecution(executionId: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `/api/strategies/executions/${executionId}/stop`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error(`Error stopping execution ${executionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Download strategy as JSON
   */
  async exportStrategy(strategyId: string): Promise<Blob> {
    try {
      const response = await axios.get(
        `/api/strategies/${strategyId}/export`,
        { 
          headers: this.getHeaders(),
          responseType: 'blob'
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error exporting strategy ${strategyId}:`, error);
      throw error;
    }
  }
  
  /**
   * Import strategy from JSON
   */
  async importStrategy(file: File): Promise<Strategy> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const headers = this.getHeaders();
      // Remove Content-Type for multipart/form-data
      delete headers['Content-Type'];
      
      const response = await axios.post(
        '/api/strategies/import',
        formData,
        { 
          headers: {
            ...headers,
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error importing strategy:', error);
      throw error;
    }
  }
  
  /**
   * Save current strategy as a template
   */
  async saveAsTemplate(strategyId: string, templateDetails: { 
    name: string;
    description: string;
    category: string;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
  }): Promise<StrategyTemplate> {
    try {
      const response = await axios.post(
        `/api/strategies/${strategyId}/save-template`,
        templateDetails,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error saving strategy ${strategyId} as template:`, error);
      throw error;
    }
  }
  
  /**
   * Validate a strategy for errors
   */
  async validateStrategy(strategyId: string): Promise<{
    isValid: boolean;
    errors: Array<{
      elementId: string;
      error: string;
    }>;
    warnings: Array<{
      elementId: string;
      warning: string;
    }>;
  }> {
    try {
      const response = await axios.post(
        `/api/strategies/${strategyId}/validate`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error validating strategy ${strategyId}:`, error);
      throw error;
    }
  }
}