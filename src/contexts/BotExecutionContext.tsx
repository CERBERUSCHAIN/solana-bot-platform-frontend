// CERBERUS Bot - Bot Execution Context
// Created: 2025-05-06 23:42:15 UTC
// Author: CERBERUSCHAINYes

import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { BotExecutionService } from '../services/BotExecutionService';
import { BotExecutionServiceImpl } from '../services/implementations/BotExecutionServiceImpl';
import { useAuth } from './AuthContext';

interface BotExecutionContextType {
  // State
  activeSessions: BotExecutionSession[];
  currentSession: BotExecutionSession | null;
  sessionLogs: ExecutionLogEntry[];
  totalLogs: number;
  sessionTrades: BotTrade[];
  totalTrades: number;
  elementExecutions: Record<string, ElementExecutionResult[]>;
  statusSummary: BotStatusSummary | null;
  isLoading: boolean;
  error: string | null;
  
  // Methods
  startExecution: (config: {
    botId: string;
    strategyId: string;
    mode: ExecutionMode;
    frequency: ExecutionFrequency;
    walletId?: string;
    config: BotExecutionConfig;
  }) => Promise<BotExecutionSession>;
  
  stopExecution: (sessionId: string) => Promise<BotExecutionSession>;
  pauseExecution: (sessionId: string) => Promise<BotExecutionSession>;
  resumeExecution: (sessionId: string) => Promise<BotExecutionSession>;
  
  loadExecutionSession: (sessionId: string) => Promise<BotExecutionSession>;
  loadUserSessions: () => Promise<BotExecutionSession[]>;
  loadBotSessions: (botId: string) => Promise<BotExecutionSession[]>;
  
  updateExecutionConfig: (sessionId: string, config: Partial<BotExecutionConfig>) => Promise<BotExecutionSession>;
  
  loadExecutionLogs: (sessionId: string, options?: {
    limit?: number;
    offset?: number;
    startTime?: string;
    endTime?: string;
    level?: string;
  }) => Promise<{
    logs: ExecutionLogEntry[];
    total: number;
  }>;
  
  loadSessionTrades: (sessionId: string, options?: {
    limit?: number;
    offset?: number;
    startTime?: string;
    endTime?: string;
    status?: string;
  }) => Promise<{
    trades: BotTrade[];
    total: number;
  }>;
  
  triggerManualExecution: (sessionId: string) => Promise<ElementExecutionResult>;
  
  loadStatusSummary: () => Promise<BotStatusSummary>;
  
  loadElementExecutionHistory: (
    sessionId: string,
    elementId: string,
    options?: {
      limit?: number;
      offset?: number;
    }
  ) => Promise<{
    executions: ElementExecutionResult[];
    total: number;
  }>;
  
  deleteExecutionSession: (sessionId: string) => Promise<boolean>;
  
  setCurrentSession: (session: BotExecutionSession | null) => void;
}

const BotExecutionContext = createContext<BotExecutionContextType | undefined>(undefined);

export const BotExecutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [service, setService] = useState<BotExecutionService | null>(null);
  
  const [activeSessions, setActiveSessions] = useState<BotExecutionSession[]>([]);
  const [currentSession, setCurrentSession] = useState<BotExecutionSession | null>(null);
  const [sessionLogs, setSessionLogs] = useState<ExecutionLogEntry[]>([]);
  const [totalLogs, setTotalLogs] = useState<number>(0);
  const [sessionTrades, setSessionTrades] = useState<BotTrade[]>([]);
  const [totalTrades, setTotalTrades] = useState<number>(0);
  const [elementExecutions, setElementExecutions] = useState<Record<string, ElementExecutionResult[]>>({});
  const [statusSummary, setStatusSummary] = useState<BotStatusSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize service when user is authenticated
  useEffect(() => {
    if (user) {
      const botExecutionService = new BotExecutionServiceImpl();
      setService(botExecutionService);
    }
  }, [user]);
  
  // Polling for active sessions to update status
  useEffect(() => {
    if (!service || !currentSession || 
        ![BotExecutionStatus.RUNNING, BotExecutionStatus.STARTING].includes(currentSession.status)) {
      return;
    }
    
    const pollInterval = setInterval(async () => {
      try {
        const updated = await service.getExecutionSession(currentSession.id);
        setCurrentSession(updated);
        
        // Also update in the active sessions list
        setActiveSessions(prev => 
          prev.map(session => 
            session.id === updated.id ? updated : session
          )
        );
      } catch (error) {
        console.error('Error polling session status:', error);
      }
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(pollInterval);
  }, [service, currentSession]);
  
  /**
   * Start a new bot execution session
   */
  const startExecution = async (config: {
    botId: string;
    strategyId: string;
    mode: ExecutionMode;
    frequency: ExecutionFrequency;
    walletId?: string;
    config: BotExecutionConfig;
  }): Promise<BotExecutionSession> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const session = await service.startExecution(config);
      
      // Add to active sessions
      setActiveSessions(prev => [...prev, session]);
      
      // Set as current session
      setCurrentSession(session);
      
      return session;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start execution';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Stop an execution session
   */
  const stopExecution = async (sessionId: string): Promise<BotExecutionSession> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const session = await service.stopExecution(sessionId);
      
      // Update in active sessions
      setActiveSessions(prev => 
        prev.map(s => s.id === sessionId ? session : s)
      );
      
      // Update current session if it's the one being stopped
      if (currentSession && currentSession.id === sessionId) {
        setCurrentSession(session);
      }
      
      return session;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to stop execution';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Pause an execution session
   */
  const pauseExecution = async (sessionId: string): Promise<BotExecutionSession> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const session = await service.pauseExecution(sessionId);
      
      // Update in active sessions
      setActiveSessions(prev => 
        prev.map(s => s.id === sessionId ? session : s)
      );
      
      // Update current session if it's the one being paused
      if (currentSession && currentSession.id === sessionId) {
        setCurrentSession(session);
      }
      
      return session;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to pause execution';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Resume a paused execution session
   */
  const resumeExecution = async (sessionId: string): Promise<BotExecutionSession> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const session = await service.resumeExecution(sessionId);
      
      // Update in active sessions
      setActiveSessions(prev => 
        prev.map(s => s.id === sessionId ? session : s)
      );
      
      // Update current session if it's the one being resumed
      if (currentSession && currentSession.id === sessionId) {
        setCurrentSession(session);
      }
      
      return session;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to resume execution';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load a specific execution session
   */
  const loadExecutionSession = async (sessionId: string): Promise<BotExecutionSession> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const session = await service.getExecutionSession(sessionId);
      setCurrentSession(session);
      return session;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load execution session';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load all user's execution sessions
   */
  const loadUserSessions = async (): Promise<BotExecutionSession[]> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const sessions = await service.getUserExecutionSessions();
      setActiveSessions(sessions);
      return sessions;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load user execution sessions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load execution sessions for a specific bot
   */
  const loadBotSessions = async (botId: string): Promise<BotExecutionSession[]> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const sessions = await service.getBotExecutionSessions(botId);
      return sessions;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load bot execution sessions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update execution configuration
   */
  const updateExecutionConfig = async (sessionId: string, config: Partial<BotExecutionConfig>): Promise<BotExecutionSession> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const session = await service.updateExecutionConfig(sessionId, config);
      
      // Update in active sessions
      setActiveSessions(prev => 
        prev.map(s => s.id === sessionId ? session : s)
      );
      
      // Update current session if it's the one being updated
      if (currentSession && currentSession.id === sessionId) {
        setCurrentSession(session);
      }
      
      return session;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update execution config';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load execution logs
   */
  const loadExecutionLogs = async (sessionId: string, options: {
    limit?: number;
    offset?: number;
    startTime?: string;
    endTime?: string;
    level?: string;
  } = {}): Promise<{
    logs: ExecutionLogEntry[];
    total: number;
  }> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await service.getExecutionLogs(sessionId, options);
      setSessionLogs(result.logs);
      setTotalLogs(result.total);
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load execution logs';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load session trades
   */
  const loadSessionTrades = async (sessionId: string, options: {
    limit?: number;
    offset?: number;
    startTime?: string;
    endTime?: string;
    status?: string;
  } = {}): Promise<{
    trades: BotTrade[];
    total: number;
  }> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await service.getBotTrades(sessionId, options);
      setSessionTrades(result.trades);
      setTotalTrades(result.total);
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load session trades';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Trigger manual execution
   */
  const triggerManualExecution = async (sessionId: string): Promise<ElementExecutionResult> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.triggerManualExecution(sessionId);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to trigger manual execution';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load status summary
   */
  const loadStatusSummary = async (): Promise<BotStatusSummary> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const summary = await service.getBotStatusSummary();
      setStatusSummary(summary);
      return summary;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load status summary';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load element execution history
   */
  const loadElementExecutionHistory = async (
    sessionId: string,
    elementId: string,
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{
    executions: ElementExecutionResult[];
    total: number;
  }> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await service.getElementExecutionHistory(sessionId, elementId, options);
      
      setElementExecutions(prev => ({
        ...prev,
        [elementId]: result.executions
      }));
      
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load element execution history';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete execution session
   */
  const deleteExecutionSession = async (sessionId: string): Promise<boolean> => {
    if (!service) throw new Error('Bot execution service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.deleteExecutionSession(sessionId);
      
      if (success) {
        // Remove from active sessions
        setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
        
        // Clear current session if it's the one being deleted
        if (currentSession && currentSession.id === sessionId) {
          setCurrentSession(null);
        }
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete execution session';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const contextValue: BotExecutionContextType = {
    // State
    activeSessions,
    currentSession,
    sessionLogs,
    totalLogs,
    sessionTrades,
    totalTrades,
    elementExecutions,
    statusSummary,
    isLoading,
    error,
    
    // Methods
    startExecution,
    stopExecution,
    pauseExecution,
    resumeExecution,
    loadExecutionSession,
    loadUserSessions,
    loadBotSessions,
    updateExecutionConfig,
    loadExecutionLogs,
    loadSessionTrades,
    triggerManualExecution,
    loadStatusSummary,
    loadElementExecutionHistory,
    deleteExecutionSession,
    setCurrentSession
  };
  
  return (
    <BotExecutionContext.Provider value={contextValue}>
      {children}
    </BotExecutionContext.Provider>
  );
};

export const useBotExecution = () => {
  const context = useContext(BotExecutionContext);
  
  if (context === undefined) {
    throw new Error('useBotExecution must be used within a BotExecutionProvider');
  }
  
  return context;
};