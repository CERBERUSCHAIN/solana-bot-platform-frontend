// CERBERUS Bot - Analytics Context
// Created: 2025-05-06 16:38:28 UTC
// Author: CERBERUSCHAINWhat's next?

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProfitLossData,
  PortfolioDistribution,
  BotPerformanceData,
  TradeHistoryItem,
  ReportConfig,
  ReportData,
  AnalyticsDashboardData
} from '../types/analytics';
import { AnalyticsService } from '../services/AnalyticsService';
import { AnalyticsServiceImpl } from '../services/implementations/AnalyticsServiceImpl';
import { useAuth } from './AuthContext';

interface AnalyticsContextType {
  // State
  dashboardData: AnalyticsDashboardData | null;
  profitLossData: ProfitLossData | null;
  tradeHistory: TradeHistoryItem[];
  isLoading: boolean;
  error: string | null;
  
  // Methods
  fetchDashboardSummary: () => Promise<AnalyticsDashboardData>;
  fetchProfitLossData: (timeframe?: 'day' | 'week' | 'month' | 'year' | 'all') => Promise<ProfitLossData>;
  fetchPortfolioDistribution: (distributionType: 'tokens' | 'bots' | 'exchanges') => Promise<PortfolioDistribution>;
  fetchBotPerformance: (botId?: string, timeframe?: 'day' | 'week' | 'month' | 'year' | 'all') => Promise<BotPerformanceData>;
  fetchTradeHistory: (botId?: string, limit?: number, offset?: number) => Promise<TradeHistoryItem[]>;
  generateReport: (config: ReportConfig) => Promise<ReportData>;
  exportData: (data: any, format: 'csv' | 'pdf') => Promise<void>;
  fetchFeeExpenditureData: (timeframe: 'day' | 'week' | 'month' | 'year' | 'all') => Promise<{
    timestamps: string[];
    amounts: number[];
    total: number;
    average: number;
  }>;
  fetchBotEfficiencyMetrics: (botId?: string) => Promise<{
    successRate: number;
    averageExecutionTime: number;
    completedTransactions: number;
    failedTransactions: number;
    botScores: Record<string, number>;
  }>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [service, setService] = useState<AnalyticsService | null>(null);
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboardData | null>(null);
  const [profitLossData, setProfitLossData] = useState<ProfitLossData | null>(null);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize service when user is authenticated
  useEffect(() => {
    if (user) {
      const analyticsService = new AnalyticsServiceImpl();
      setService(analyticsService);
      
      // Fetch initial dashboard data
      fetchInitialData(analyticsService);
    }
  }, [user]);
  
  const fetchInitialData = async (service: AnalyticsService) => {
    setIsLoading(true);
    try {
      const dashboardSummary = await service.getDashboardSummary();
      setDashboardData(dashboardSummary);
      
      // Also fetch some profit/loss data
      const profitLoss = await service.getProfitLossData('month');
      setProfitLossData(profitLoss);
      
      // And some trade history
      const trades = await service.getTradeHistory(undefined, 5, 0);
      setTradeHistory(trades);
    } catch (error: any) {
      console.error('Error fetching initial analytics data:', error);
      setError(error.message || 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch dashboard summary data
   */
  const fetchDashboardSummary = async (): Promise<AnalyticsDashboardData> => {
    if (!service) throw new Error('Analytics service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await service.getDashboardSummary();
      setDashboardData(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch dashboard summary';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch profit/loss data
   */
  const fetchProfitLossData = async (
    timeframe: 'day' | 'week' | 'month' | 'year' | 'all' = 'month'
  ): Promise<ProfitLossData> => {
    if (!service) throw new Error('Analytics service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await service.getProfitLossData(timeframe);
      setProfitLossData(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profit/loss data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch portfolio distribution
   */
  const fetchPortfolioDistribution = async (
    distributionType: 'tokens' | 'bots' | 'exchanges' = 'tokens'
  ): Promise<PortfolioDistribution> => {
    if (!service) throw new Error('Analytics service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getPortfolioDistribution(distributionType);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch portfolio distribution';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch bot performance data
   */
  const fetchBotPerformance = async (
    botId?: string,
    timeframe: 'day' | 'week' | 'month' | 'year' | 'all' = 'month'
  ): Promise<BotPerformanceData> => {
    if (!service) throw new Error('Analytics service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getBotPerformanceData(botId, timeframe);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch bot performance data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch trade history
   */
  const fetchTradeHistory = async (
    botId?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<TradeHistoryItem[]> => {
    if (!service) throw new Error('Analytics service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const trades = await service.getTradeHistory(botId, limit, offset);
      setTradeHistory(trades);
      return trades;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch trade history';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Generate a report
   */
  const generateReport = async (config: ReportConfig): Promise<ReportData> => {
    if (!service) throw new Error('Analytics service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.generateReport(config);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to generate report';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Export data to CSV or PDF
   */
  const exportData = async (data: any, format: 'csv' | 'pdf'): Promise<void> => {
    if (!service) throw new Error('Analytics service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const blob = await service.exportData(data, format);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cerberus-analytics-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to export data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch fee expenditure data
   */
  const fetchFeeExpenditureData = async (
    timeframe: 'day' | 'week' | 'month' | 'year' | 'all' = 'month'
  ): Promise<{ timestamps: string[]; amounts: number[]; total: number; average: number }> => {
    if (!service) throw new Error('Analytics service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getFeeExpenditureData(timeframe);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch fee data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch bot efficiency metrics
   */
  const fetchBotEfficiencyMetrics = async (botId?: string): Promise<{
    successRate: number;
    averageExecutionTime: number;
    completedTransactions: number;
    failedTransactions: number;
    botScores: Record<string, number>;
  }> => {
    if (!service) throw new Error('Analytics service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getBotEfficiencyMetrics(botId);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch efficiency metrics';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const contextValue: AnalyticsContextType = {
    // State
    dashboardData,
    profitLossData,
    tradeHistory,
    isLoading,
    error,
    
    // Methods
    fetchDashboardSummary,
    fetchProfitLossData,
    fetchPortfolioDistribution,
    fetchBotPerformance,
    fetchTradeHistory,
    generateReport,
    exportData,
    fetchFeeExpenditureData,
    fetchBotEfficiencyMetrics,
  };
  
  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  
  return context;
};