// CERBERUS Bot - Bot Execution Service Implementation
// Created: 2025-05-06 23:42:15 UTC
// Author: CERBERUSCHAINYes

import { BotExecutionService } from '../BotExecutionService';
import {
  BotExecutionSession,
  BotExecutionConfig,
  BotExecutionStatus,
  ExecutionMode,
  ExecutionFrequency,
  ExecutionLogEntry,
  BotTrade,
  ElementExecutionResult,
  BotStatusSummary
} from '../../types/botExecution';
import axios from 'axios';

export class BotExecutionServiceImpl implements BotExecutionService {
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
   * Start a new bot execution session
   */
  async startExecution(config: {
    botId: string;
    strategyId: string;
    mode: ExecutionMode;
    frequency: ExecutionFrequency;
    walletId?: string;
    config: BotExecutionConfig;
  }): Promise<BotExecutionSession> {
    try {
      const response = await axios.post(
        '/api/bot-execution/sessions',
        config,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error starting bot execution:', error);
      throw error;
    }
  }
  
  /**
   * Stop an existing bot execution session
   */
  async stopExecution(sessionId: string): Promise<BotExecutionSession> {
    try {
      const response = await axios.post(
        `/api/bot-execution/sessions/${sessionId}/stop`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error stopping execution session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Pause an execution session
   */
  async pauseExecution(sessionId: string): Promise<BotExecutionSession> {
    try {
      const response = await axios.post(
        `/api/bot-execution/sessions/${sessionId}/pause`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error pausing execution session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Resume a paused execution session
   */
  async resumeExecution(sessionId: string): Promise<BotExecutionSession> {
    try {
      const response = await axios.post(
        `/api/bot-execution/sessions/${sessionId}/resume`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error resuming execution session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get a specific execution session
   */
  async getExecutionSession(sessionId: string): Promise<BotExecutionSession> {
    try {
      const response = await axios.get(
        `/api/bot-execution/sessions/${sessionId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error getting execution session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get all execution sessions for a bot
   */
  async getBotExecutionSessions(botId: string): Promise<BotExecutionSession[]> {
    try {
      const response = await axios.get(
        `/api/bot-execution/sessions/bot/${botId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error getting execution sessions for bot ${botId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get all execution sessions for a user
   */
  async getUserExecutionSessions(): Promise<BotExecutionSession[]> {
    try {
      const response = await axios.get(
        '/api/bot-execution/sessions',
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting user execution sessions:', error);
      throw error;
    }
  }
  
  /**
   * Update execution configuration
   */
  async updateExecutionConfig(sessionId: string, config: Partial<BotExecutionConfig>): Promise<BotExecutionSession> {
    try {
      const response = await axios.put(
        `/api/bot-execution/sessions/${sessionId}/config`,
        config,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating execution config for session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get execution logs
   */
  async getExecutionLogs(sessionId: string, options: {
    limit?: number;
    offset?: number;
    startTime?: string;
    endTime?: string;
    level?: string;
  } = {}): Promise<{
    logs: ExecutionLogEntry[];
    total: number;
  }> {
    try {
      const params = new URLSearchParams();
      
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.offset) params.append('offset', options.offset.toString());
      if (options.startTime) params.append('startTime', options.startTime);
      if (options.endTime) params.append('endTime', options.endTime);
      if (options.level) params.append('level', options.level);
      
      const response = await axios.get(
        `/api/bot-execution/sessions/${sessionId}/logs?${params.toString()}`,
        { headers: this.getHeaders() }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error getting execution logs for session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get trades executed by a bot
   */
  async getBotTrades(sessionId: string, options: {
    limit?: number;
    offset?: number;
    startTime?: string;
    endTime?: string;
    status?: string;
  } = {}): Promise<{
    trades: BotTrade[];
    total: number;
  }> {
    try {
      const params = new URLSearchParams();
      
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.offset) params.append('offset', options.offset.toString());
      if (options.startTime) params.append('startTime', options.startTime);
      if (options.endTime) params.append('endTime', options.endTime);
      if (options.status) params.append('status', options.status);
      
      const response = await axios.get(
        `/api/bot-execution/sessions/${sessionId}/trades?${params.toString()}`,
        { headers: this.getHeaders() }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error getting bot trades for session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Manually trigger a strategy execution
   */
  async triggerManualExecution(sessionId: string): Promise<ElementExecutionResult> {
    try {
      const response = await axios.post(
        `/api/bot-execution/sessions/${sessionId}/trigger`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error triggering manual execution for session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get the overall bot status summary
   */
  async getBotStatusSummary(): Promise<BotStatusSummary> {
    try {
      const response = await axios.get(
        '/api/bot-execution/status-summary',
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting bot status summary:', error);
      throw error;
    }
  }
  
  /**
   * Get element execution history
   */
  async getElementExecutionHistory(
    sessionId: string,
    elementId: string,
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{
    executions: ElementExecutionResult[];
    total: number;
  }> {
    try {
      const params = new URLSearchParams();
      
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.offset) params.append('offset', options.offset.toString());
      
      const response = await axios.get(
        `/api/bot-execution/sessions/${sessionId}/elements/${elementId}/history?${params.toString()}`,
        { headers: this.getHeaders() }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error getting element execution history for element ${elementId} in session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete an execution session
   */
  async deleteExecutionSession(sessionId: string): Promise<boolean> {
    try {
      const response = await axios.delete(
        `/api/bot-execution/sessions/${sessionId}`,
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error(`Error deleting execution session ${sessionId}:`, error);
      throw error;
    }
  }
}