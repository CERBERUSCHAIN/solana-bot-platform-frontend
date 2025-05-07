// CERBERUS Bot - Token Research Context
// Created: 2025-05-06 04:00:28 UTC
// Author: CERBERUSCHAINNext

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Token, 
  TokenMetrics, 
  TokenAlert, 
  TokenFilter, 
  MarketTrend 
} from '../types/token';
import { TokenResearchService } from '../services/TokenResearchService';
import { TokenResearchServiceImpl } from '../services/implementations/TokenResearchServiceImpl';
import { useAuth } from './AuthContext';

interface TokenResearchContextType {
  // States
  trendingTokens: Token[];
  watchlist: Token[];
  alerts: TokenAlert[];
  marketTrends: MarketTrend[];
  isLoading: boolean;
  error: string | null;
  
  // Token search
  searchTokens: (query: string, limit?: number) => Promise<Token[]>;
  
  // Trending and discovery
  fetchTrendingTokens: (
    timeframe?: 'hour' | 'day' | 'week', 
    category?: string, 
    limit?: number
  ) => Promise<Token[]>;
  
  // Token details
  getTokenDetails: (address: string) => Promise<Token>;
  getTokenPriceHistory: (
    address: string, 
    timeframe?: '1h' | '1d' | '1w' | '1m' | 'all'
  ) => Promise<Array<{timestamp: number, price: number, volume: number}>>;
  getTokenMetrics: (address: string) => Promise<TokenMetrics>;
  getTokenSocialActivity: (
    address: string, 
    platforms?: Array<'twitter' | 'telegram' | 'discord' | 'reddit'>
  ) => Promise<Record<string, any>>;
  getTokenPairs: (address: string) => Promise<Array<{
    pairAddress: string;
    tokenAddress: string;
    tokenSymbol: string;
    liquidity: number;
    volume24h: number;
    priceChange24h: number;
  }>>;
  
  // Watchlist management
  addToWatchlist: (address: string) => Promise<boolean>;
  removeFromWatchlist: (address: string) => Promise<boolean>;
  fetchWatchlist: () => Promise<Token[]>;
  
  // Alerts management
  fetchAlerts: () => Promise<TokenAlert[]>;
  createAlert: (alert: Omit<TokenAlert, 'id'>) => Promise<TokenAlert>;
  deleteAlert: (alertId: string) => Promise<boolean>;
  
  // Advanced features
  screenTokens: (filters: TokenFilter[]) => Promise<Token[]>;
  analyzeToken: (address: string) => Promise<{
    buySignalStrength: number;
    sellSignalStrength: number;
    botRecommendations: Array<{
      botType: string;
      confidence: number;
      configuration: Record<string, any>;
    }>;
    risks: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  }>;
  
  // Market trends
  fetchMarketTrends: () => Promise<MarketTrend[]>;
}

const TokenResearchContext = createContext<TokenResearchContextType | undefined>(undefined);

export const TokenResearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [service, setService] = useState<TokenResearchService | null>(null);
  const [trendingTokens, setTrendingTokens] = useState<Token[]>([]);
  const [watchlist, setWatchlist] = useState<Token[]>([]);
  const [alerts, setAlerts] = useState<TokenAlert[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize service when user is logged in
  useEffect(() => {
    if (user) {
      const tokenResearchService = new TokenResearchServiceImpl();
      setService(tokenResearchService);
      
      // Fetch initial data
      fetchInitialData(tokenResearchService);
    }
  }, [user]);
  
  const fetchInitialData = async (service: TokenResearchService) => {
    setIsLoading(true);
    try {
      // Fetch trending tokens and watchlist in parallel
      const [trendingData, watchlistData, marketTrendsData] = await Promise.all([
        service.getTrendingTokens('day'),
        service.getWatchlist(),
        service.getMarketTrends()
      ]);
      
      setTrendingTokens(trendingData);
      setWatchlist(watchlistData);
      setMarketTrends(marketTrendsData);
      
    } catch (error) {
      console.error('Error fetching initial token data:', error);
      setError('Failed to load token data');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Search tokens by name, symbol, or address
   */
  const searchTokens = async (query: string, limit?: number): Promise<Token[]> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await service.searchTokens(query, limit);
      return results;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error searching tokens');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch trending tokens
   */
  const fetchTrendingTokens = async (
    timeframe: 'hour' | 'day' | 'week' = 'day',
    category?: string,
    limit?: number
  ): Promise<Token[]> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tokens = await service.getTrendingTokens(timeframe, category, limit);
      setTrendingTokens(tokens);
      return tokens;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error fetching trending tokens');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get token details
   */
  const getTokenDetails = async (address: string): Promise<Token> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getTokenDetails(address);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error fetching token ${address}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get token price history
   */
  const getTokenPriceHistory = async (
    address: string,
    timeframe: '1h' | '1d' | '1w' | '1m' | 'all' = '1d'
  ): Promise<Array<{timestamp: number, price: number, volume: number}>> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getTokenPriceHistory(address, timeframe);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error fetching token price history`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get token metrics
   */
  const getTokenMetrics = async (address: string): Promise<TokenMetrics> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getTokenMetrics(address);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error fetching token metrics`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get token social activity
   */
  const getTokenSocialActivity = async (
    address: string,
    platforms?: Array<'twitter' | 'telegram' | 'discord' | 'reddit'>
  ): Promise<Record<string, any>> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getTokenSocialActivity(address, platforms);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error fetching token social activity`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get token pairs
   */
  const getTokenPairs = async (address: string): Promise<Array<{
    pairAddress: string;
    tokenAddress: string;
    tokenSymbol: string;
    liquidity: number;
    volume24h: number;
    priceChange24h: number;
  }>> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getTokenPairs(address);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error fetching token pairs`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Add token to watchlist
   */
  const addToWatchlist = async (address: string): Promise<boolean> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.addToWatchlist(address);
      if (success) {
        // Refresh watchlist
        const updatedWatchlist = await service.getWatchlist();
        setWatchlist(updatedWatchlist);
      }
      return success;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error adding token to watchlist`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Remove token from watchlist
   */
  const removeFromWatchlist = async (address: string): Promise<boolean> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.removeFromWatchlist(address);
      if (success) {
        // Update local watchlist
        setWatchlist(current => current.filter(token => token.address !== address));
      }
      return success;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error removing token from watchlist`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch user's watchlist
   */
  const fetchWatchlist = async (): Promise<Token[]> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const list = await service.getWatchlist();
      setWatchlist(list);
      return list;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error fetching watchlist`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch user's token alerts
   */
  const fetchAlerts = async (): Promise<TokenAlert[]> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userAlerts = await service.getUserTokenAlerts();
      setAlerts(userAlerts);
      return userAlerts;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error fetching token alerts`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create a token alert
   */
  const createAlert = async (alert: Omit<TokenAlert, 'id'>): Promise<TokenAlert> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newAlert = await service.createTokenAlert(alert);
      setAlerts(current => [...current, newAlert]);
      return newAlert;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error creating token alert`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete a token alert
   */
  const deleteAlert = async (alertId: string): Promise<boolean> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.deleteTokenAlert(alertId);
      if (success) {
        setAlerts(current => current.filter(alert => alert.id !== alertId));
      }
      return success;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error deleting token alert`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Screen tokens based on filters
   */
  const screenTokens = async (filters: TokenFilter[]): Promise<Token[]> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.screenTokens(filters);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error screening tokens`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Analyze a token
   */
  const analyzeToken = async (address: string): Promise<{
    buySignalStrength: number;
    sellSignalStrength: number;
    botRecommendations: Array<{
      botType: string;
      confidence: number;
      configuration: Record<string, any>;
    }>;
    risks: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  }> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.analyzeToken(address);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error analyzing token`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch market trends
   */
  const fetchMarketTrends = async (): Promise<MarketTrend[]> => {
    if (!service) throw new Error('Token research service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const trends = await service.getMarketTrends();
      setMarketTrends(trends);
      return trends;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || `Error fetching market trends`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const contextValue: TokenResearchContextType = {
    // States
    trendingTokens,
    watchlist,
    alerts,
    marketTrends,
    isLoading,
    error,
    
    // Methods
    searchTokens,
    fetchTrendingTokens,
    getTokenDetails,
    getTokenPriceHistory,
    getTokenMetrics,
    getTokenSocialActivity,
    getTokenPairs,
    addToWatchlist,
    removeFromWatchlist,
    fetchWatchlist,
    fetchAlerts,
    createAlert,
    deleteAlert,
    screenTokens,
    analyzeToken,
    fetchMarketTrends
  };
  
  return (
    <TokenResearchContext.Provider value={contextValue}>
      {children}
    </TokenResearchContext.Provider>
  );
};

export const useTokenResearch = () => {
  const context = useContext(TokenResearchContext);
  
  if (context === undefined) {
    throw new Error('useTokenResearch must be used within a TokenResearchProvider');
  }
  
  return context;
};