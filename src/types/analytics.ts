// CERBERUS Bot - Analytics Type Definitions
// Created: 2025-05-06 16:38:28 UTC
// Author: CERBERUSCHAINWhat's next?

export interface ProfitLossData {
    netProfitLoss: number;
    percentageChange: number;
    timestamps: string[];
    values: number[];
    compareToMarket?: number; // Percentage points above/below overall market
    bestPerforming: {
      token: string;
      symbol: string;
      profit: number;
      percentageChange: number;
    };
    worstPerforming: {
      token: string;
      symbol: string;
      profit: number;
      percentageChange: number;
    };
  }
  
  export interface DistributionItem {
    id: string;
    name: string;
    value: number;
    percentage: number;
    color?: string;
  }
  
  export interface PortfolioDistribution {
    totalValue: number;
    items: DistributionItem[];
  }
  
  export interface BotPerformanceData {
    botId?: string;
    botName?: string;
    botType?: string;
    transactionsExecuted: number;
    profitLoss: number;
    profitLossPercentage: number;
    feesSpent: number;
    successRate: number;
    timeActive: number; // In seconds
    timestamps: string[];
    profitLossHistory: number[];
    volumeHistory: number[];
    topMetrics: {
      bestProfitInSingleTrade: number;
      worstLossInSingleTrade: number;
      highestVolumeDay: {
        timestamp: string;
        volume: number;
      };
      longestInactivityPeriod: {
        start: string;
        end: string;
        duration: number; // In seconds
      };
    };
  }
  
  export interface TradeHistoryItem {
    id: string;
    botId: string;
    botName: string;
    botType: string;
    tokenAddress: string;
    tokenSymbol: string;
    type: 'buy' | 'sell' | 'swap';
    amount: number;
    price: number;
    value: number;
    fee: number;
    timestamp: string;
    transactionHash: string;
    profitLoss?: number;
    profitLossPercentage?: number;
    status: 'confirmed' | 'pending' | 'failed';
    executionTime?: number; // In milliseconds
    gasUsed?: number;
    notes?: string;
  }
  
  export interface ReportConfig {
    name: string;
    description?: string;
    timeframe: 'day' | 'week' | 'month' | 'year' | 'custom';
    startDate?: string; // For custom timeframe
    endDate?: string; // For custom timeframe
    botIds?: string[]; // Filter by specific bots
    tokenAddresses?: string[]; // Filter by specific tokens
    metrics: Array<
      | 'profitLoss'
      | 'volume'
      | 'fees'
      | 'successRate'
      | 'executionTime'
      | 'tokenDistribution'
      | 'botPerformance'
      | 'tradeBreakdown'
    >;
    format: 'dashboard' | 'csv' | 'pdf';
  }
  
  export interface ReportData {
    id: string;
    name: string;
    description?: string;
    generatedAt: string;
    timeframe: {
      type: 'day' | 'week' | 'month' | 'year' | 'custom';
      startDate: string;
      endDate: string;
    };
    summary: {
      netProfitLoss: number;
      profitLossPercentage: number;
      totalVolume: number;
      totalFees: number;
      transactionCount: number;
      successRate: number;
    };
    charts: Record<string, any>; // Chart data varies based on metrics
    tables: Record<string, any>; // Table data varies based on metrics
  }
  
  export interface AnalyticsDashboardData {
    totalPortfolioValue: number;
    totalProfitLoss: {
      day: number;
      week: number;
      month: number;
      all: number;
    };
    totalProfitLossPercentage: {
      day: number;
      week: number;
      month: number;
      all: number;
    };
    activeBots: number;
    totalTransactions: number;
    totalVolume: number;
    averageSuccessRate: number;
    portfolioGrowthHistory: {
      timestamps: string[];
      values: number[];
    };
    recentTrades: TradeHistoryItem[];
    botPerformanceSummary: Array<{
      botId: string;
      botName: string;
      botType: string;
      profitLoss: number;
      profitLossPercentage: number;
      transactionsExecuted: number;
      status: 'running' | 'paused' | 'stopped' | 'error';
    }>;
  }