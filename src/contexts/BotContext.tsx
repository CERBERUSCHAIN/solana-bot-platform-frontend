// CERBERUS Bot - Bot Context
// Created: 2025-05-06 03:24:45 UTC
// Author: CERBERUSCHAINNext

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bot, BotConfig, BotType, BotStatus, BotMetrics, BotTransaction } from '../types/bot';
import { BotService } from '../services/BotService';
import { BotServiceImpl } from '../services/implementations/BotServiceImpl';
import { useAuth } from './AuthContext';

interface BotContextType {
  bots: Bot[];
  selectedBot: Bot | null;
  isLoading: boolean;
  error: string | null;
  
  // Core bot management
  fetchBots: () => Promise<void>;
  fetchBot: (botId: string) => Promise<Bot>;
  selectBot: (bot: Bot | null) => void;
  createBot: (config: BotConfig) => Promise<Bot>;
  updateBot: (botId: string, config: Partial<BotConfig>) => Promise<Bot>;
  deleteBot: (botId: string) => Promise<boolean>;
  
  // Bot operations
  startBot: (botId: string) => Promise<boolean>;
  stopBot: (botId: string) => Promise<boolean>;
  pauseBot: (botId: string) => Promise<boolean>;
  
  // Bot data
  fetchBotMetrics: (botId: string, timespan?: 'day' | 'week' | 'month' | 'all') => Promise<BotMetrics>;
  fetchBotTransactions: (botId: string, limit?: number, offset?: number) => Promise<BotTransaction[]>;
  fetchBotTypes: () => Promise<Record<BotType, any>>;
  simulateBot: (config: BotConfig, timespan: 'day' | 'week' | 'month') => Promise<BotMetrics>;
  
  // Wallet integration
  assignWallet: (botId: string, walletAddress: string) => Promise<boolean>;
  
  // Logs
  fetchBotLogs: (botId: string, limit?: number) => Promise<Array<{
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'debug';
    message: string;
    data?: any;
  }>>;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

export const BotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [botService, setBotService] = useState<BotService | null>(null);
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize bot service when user is available
  useEffect(() => {
    if (user) {
      const service = new BotServiceImpl(user.id);
      setBotService(service);
      
      // Fetch bots initially
      fetchBots();
      
      // Subscribe to bot updates
      const unsubscribe = service.subscribeToBotUpdates((update) => {
        if (update.botId) {
          // Update the specific bot in the list
          setBots(currentBots => 
            currentBots.map(bot => 
              bot.id === update.botId
                ? { 
                    ...bot, 
                    status: update.status,
                    metrics: update.metrics ? { ...bot.metrics, ...update.metrics } : bot.metrics
                  }
                : bot
            )
          );
          
          // Also update selected bot if it matches
          if (selectedBot && selectedBot.id === update.botId) {
            setSelectedBot(current => 
              current
                ? { 
                    ...current, 
                    status: update.status,
                    metrics: update.metrics ? { ...current.metrics, ...update.metrics } : current.metrics
                  }
                : null
            );
          }
        }
      });
      
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [user]);
  
  // Fetch all bots
  const fetchBots = async () => {
    if (!botService) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedBots = await botService.getAllBots();
      setBots(fetchedBots);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch bots');
      console.error('Error fetching bots:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch a single bot
  const fetchBot = async (botId: string): Promise<Bot> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const bot = await botService.getBotById(botId);
      
      // Update bot in list if it exists
      setBots(currentBots => 
        currentBots.map(b => b.id === botId ? bot : b)
      );
      
      // Update selected bot if it matches
      if (selectedBot && selectedBot.id === botId) {
        setSelectedBot(bot);
      }
      
      return bot;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Failed to fetch bot ${botId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Select a bot
  const selectBot = (bot: Bot | null) => {
    setSelectedBot(bot);
  };
  
  // Create a new bot
  const createBot = async (config: BotConfig): Promise<Bot> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newBot = await botService.createBot(config);
      
      // Add new bot to list
      setBots(currentBots => [...currentBots, newBot]);
      
      return newBot;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create bot');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update a bot
  const updateBot = async (botId: string, config: Partial<BotConfig>): Promise<Bot> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedBot = await botService.updateBot(botId, config);
      
      // Update bot in list
      setBots(currentBots => 
        currentBots.map(b => b.id === botId ? updatedBot : b)
      );
      
      // Update selected bot if it matches
      if (selectedBot && selectedBot.id === botId) {
        setSelectedBot(updatedBot);
      }
      
      return updatedBot;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Failed to update bot ${botId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a bot
  const deleteBot = async (botId: string): Promise<boolean> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await botService.deleteBot(botId);
      
      if (success) {
        // Remove bot from list
        setBots(currentBots => currentBots.filter(b => b.id !== botId));
        
        // Clear selected bot if it matches
        if (selectedBot && selectedBot.id === botId) {
          setSelectedBot(null);
        }
      }
      
      return success;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Failed to delete bot ${botId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Start a bot
  const startBot = async (botId: string): Promise<boolean> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await botService.startBot(botId);
      
      // Update bot status in list
      if (success) {
        setBots(currentBots => 
          currentBots.map(bot => 
            bot.id === botId
              ? { ...bot, status: 'running' }
              : bot
          )
        );
        
        // Update selected bot if it matches
        if (selectedBot && selectedBot.id === botId) {
          setSelectedBot(current => 
            current ? { ...current, status: 'running' } : null
          );
        }
      }
      
      return success;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Failed to start bot ${botId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Stop a bot
  const stopBot = async (botId: string): Promise<boolean> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await botService.stopBot(botId);
      
      // Update bot status in list
      if (success) {
        setBots(currentBots => 
          currentBots.map(bot => 
            bot.id === botId
              ? { ...bot, status: 'stopped' }
              : bot
          )
        );
        
        // Update selected bot if it matches
        if (selectedBot && selectedBot.id === botId) {
          setSelectedBot(current => 
            current ? { ...current, status: 'stopped' } : null
          );
        }
      }
      
      return success;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Failed to stop bot ${botId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Pause a bot
  const pauseBot = async (botId: string): Promise<boolean> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await botService.pauseBot(botId);
      
      // Update bot status in list
      if (success) {
        setBots(currentBots => 
          currentBots.map(bot => 
            bot.id === botId
              ? { ...bot, status: 'paused' }
              : bot
          )
        );
        
        // Update selected bot if it matches
        if (selectedBot && selectedBot.id === botId) {
          setSelectedBot(current => 
            current ? { ...current, status: 'paused' } : null
          );
        }
      }
      
      return success;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Failed to pause bot ${botId}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch bot metrics
  const fetchBotMetrics = async (botId: string, timespan?: 'day' | 'week' | 'month' | 'all'): Promise<BotMetrics> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    try {
      return await botService.getBotMetrics(botId, timespan);
    } catch (err: any) {
      console.error(`Error fetching metrics for bot ${botId}:`, err);
      throw err;
    }
  };
  
  // Fetch bot transactions
  const fetchBotTransactions = async (botId: string, limit?: number, offset?: number): Promise<BotTransaction[]> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    try {
      return await botService.getBotTransactions(botId, limit, offset);
    } catch (err: any) {
      console.error(`Error fetching transactions for bot ${botId}:`, err);
      throw err;
    }
  };
  
  // Fetch bot types
  const fetchBotTypes = async (): Promise<Record<BotType, any>> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    try {
      return await botService.getBotTypes();
    } catch (err: any) {
      console.error('Error fetching bot types:', err);
      throw err;
    }
  };
  
  // Simulate bot performance
  const simulateBot = async (config: BotConfig, timespan: 'day' | 'week' | 'month'): Promise<BotMetrics> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    try {
      return await botService.simulateBot(config, timespan);
    } catch (err: any) {
      console.error('Error simulating bot:', err);
      throw err;
    }
  };
  
  // Assign wallet to bot
  const assignWallet = async (botId: string, walletAddress: string): Promise<boolean> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    try {
      const success = await botService.assignWallet(botId, walletAddress);
      
      // Update bot in list
      if (success) {
        setBots(currentBots => 
          currentBots.map(bot => 
            bot.id === botId
              ? { ...bot, walletAddress }
              : bot
          )
        );
        
        // Update selected bot if it matches
        if (selectedBot && selectedBot.id === botId) {
          setSelectedBot(current => 
            current ? { ...current, walletAddress } : null
          );
        }
      }
      
      return success;
    } catch (err: any) {
      console.error(`Error assigning wallet to bot ${botId}:`, err);
      throw err;
    }
  };
  
  // Fetch bot logs
  const fetchBotLogs = async (botId: string, limit?: number): Promise<Array<{
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'debug';
    message: string;
    data?: any;
  }>> => {
    if (!botService) {
      throw new Error('Bot service not initialized');
    }
    
    try {
      return await botService.getBotLogs(botId, limit);
    } catch (err: any) {
      console.error(`Error fetching logs for bot ${botId}:`, err);
      throw err;
    }
  };
  
  // Context value
  const contextValue = {
    bots,
    selectedBot,
    isLoading,
    error,
    fetchBots,
    fetchBot,
    selectBot,
    createBot,
    updateBot,
    deleteBot,
    startBot,
    stopBot,
    pauseBot,
    fetchBotMetrics,
    fetchBotTransactions,
    fetchBotTypes,
    simulateBot,
    assignWallet,
    fetchBotLogs,
  };
  
  return (
    <BotContext.Provider value={contextValue}>
      {children}
    </BotContext.Provider>
  );
};

export const useBot = () => {
  const context = useContext(BotContext);
  
  if (context === undefined) {
    throw new Error('useBot must be used within a BotProvider');
  }
  
  return context;
};