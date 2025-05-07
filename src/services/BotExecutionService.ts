// CERBERUS Bot - Bot Execution Service Interface
// Created: 2025-05-06 23:42:15 UTC
// Author: CERBERUSCHAINYes

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
  } from '../types/botExecution';
  
  /**
   * Service for managing bot execution
   */
  export interface BotExecutionService {
    /**
     * Start a new bot execution session
     */
    startExecution(config: {
      botId: string;
      strategyId: string;
      mode: ExecutionMode;
      frequency: ExecutionFrequency;
      walletId?: string;
      config: BotExecutionConfig;
    }): Promise<BotExecutionSession>;
    
    /**
     * Stop an existing bot execution session
     */
    stopExecution(sessionId: string): Promise<BotExecutionSession>;
    
    /**
     * Pause an execution session
     */
    pauseExecution(sessionId: string): Promise<BotExecutionSession>;
    
    /**
     * Resume a paused execution session
     */
    resumeExecution(sessionId: string): Promise<BotExecutionSession>;
    
    /**
     * Get a specific execution session
     */
    getExecutionSession(sessionId: string): Promise<BotExecutionSession>;
    
    /**
     * Get all execution sessions for a bot
     */
    getBotExecutionSessions(botId: string): Promise<BotExecutionSession[]>;
    
    /**
     * Get all execution sessions for a user
     */
    getUserExecutionSessions(): Promise<BotExecutionSession[]>;
    
    /**
     * Update execution configuration
     */
    updateExecutionConfig(sessionId: string, config: Partial<BotExecutionConfig>): Promise<BotExecutionSession>;
    
    /**
     * Get execution logs
     */
    getExecutionLogs(sessionId: string, options?: {
      limit?: number;
      offset?: number;
      startTime?: string;
      endTime?: string;
      level?: string;
    }): Promise<{
      logs: ExecutionLogEntry[];
      total: number;
    }>;
    
    /**
     * Get trades executed by a bot
     */
    getBotTrades(sessionId: string, options?: {
      limit?: number;
      offset?: number;
      startTime?: string;
      endTime?: string;
      status?: string;
    }): Promise<{
      trades: BotTrade[];
      total: number;
    }>;
    
    /**
     * Manually trigger a strategy execution
     */
    triggerManualExecution(sessionId: string): Promise<ElementExecutionResult>;
    
    /**
     * Get the overall bot status summary
     */
    getBotStatusSummary(): Promise<BotStatusSummary>;
    
    /**
     * Get element execution history
     */
    getElementExecutionHistory(
      sessionId: string,
      elementId: string,
      options?: {
        limit?: number;
        offset?: number;
      }
    ): Promise<{
      executions: ElementExecutionResult[];
      total: number;
    }>;
    
    /**
     * Delete an execution session
     */
    deleteExecutionSession(sessionId: string): Promise<boolean>;
  }