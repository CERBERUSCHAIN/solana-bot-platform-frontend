// CERBERUS Bot - Analytics Service
// Created: 2025-05-06 16:38:28 UTC
// Author: CERBERUSCHAINWhat's next?

import { 
    ProfitLossData, 
    PortfolioDistribution, 
    BotPerformanceData,
    TradeHistoryItem,
    ReportConfig,
    ReportData,
    AnalyticsDashboardData
  } from '../types/analytics';
  
  /**
   * Service for analytics and reporting functionality
   */
  export interface AnalyticsService {
    /**
     * Get overall profit/loss data for user portfolio
     */
    getProfitLossData(timeframe?: 'day' | 'week' | 'month' | 'year' | 'all'): Promise<ProfitLossData>;
    
    /**
     * Get portfolio distribution by token, bot type, etc.
     */
    getPortfolioDistribution(distributionType: 'tokens' | 'bots' | 'exchanges'): Promise<PortfolioDistribution>;
    
    /**
     * Get performance data for a specific bot or all bots
     */
    getBotPerformanceData(botId?: string, timeframe?: 'day' | 'week' | 'month' | 'year' | 'all'): Promise<BotPerformanceData>;
    
    /**
     * Get trade history with detailed metrics
     */
    getTradeHistory(botId?: string, limit?: number, offset?: number): Promise<TradeHistoryItem[]>;
    
    /**
     * Generate a custom report based on configuration
     */
    generateReport(config: ReportConfig): Promise<ReportData>;
    
    /**
     * Export analytics data to CSV or PDF format
     */
    exportData(data: any, format: 'csv' | 'pdf'): Promise<Blob>;
    
    /**
     * Get summary dashboard data for quick overview
     */
    getDashboardSummary(): Promise<AnalyticsDashboardData>;
    
    /**
     * Get fee expenditure data
     */
    getFeeExpenditureData(timeframe: 'day' | 'week' | 'month' | 'year' | 'all'): Promise<{
      timestamps: string[];
      amounts: number[];
      total: number;
      average: number;
    }>;
    
    /**
     * Get bot efficiency metrics (success rate, execution time, etc.)
     */
    getBotEfficiencyMetrics(botId?: string): Promise<{
      successRate: number;
      averageExecutionTime: number;
      completedTransactions: number;
      failedTransactions: number;
      botScores: Record<string, number>;
    }>;
  }