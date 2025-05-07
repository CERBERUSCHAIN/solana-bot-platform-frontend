// CERBERUS Bot - Analytics Dashboard Page
// Created: 2025-05-06 16:38:28 UTC
// Author: CERBERUSCHAINWhat's next?

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { useAuth } from '../../contexts/AuthContext';
import { ProfitLossChart } from '../../components/Analytics/ProfitLossChart';
import { PortfolioDistributionChart } from '../../components/Analytics/PortfolioDistributionChart';
import { PerformanceTable } from '../../components/Analytics/PerformanceTable';
import { TradeHistoryTable } from '../../components/Analytics/TradeHistoryTable';
import { MetricCard } from '../../components/Analytics/MetricCard';
import { ReportGenerator } from '../../components/Analytics/ReportGenerator';
import { TimeframeSelector } from '../../components/Analytics/TimeframeSelector';

export default function AnalyticsDashboardPage() {
  const { user } = useAuth();
  const {
    dashboardData,
    profitLossData,
    tradeHistory,
    isLoading,
    error,
    fetchDashboardSummary,
    fetchProfitLossData,
    fetchPortfolioDistribution,
  } = useAnalytics();
  
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('month');
  const [distributionType, setDistributionType] = useState<'tokens' | 'bots' | 'exchanges'>('tokens');
  const [portfolioDistribution, setPortfolioDistribution] = useState<any>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  useEffect(() => {
    // Refresh data when timeframe changes
    if (dashboardData) {
      fetchProfitLossData(timeframe);
    }
  }, [timeframe]);
  
  useEffect(() => {
    // Fetch distribution data when type changes
    const fetchDistribution = async () => {
      try {
        const data = await fetchPortfolioDistribution(distributionType);
        setPortfolioDistribution(data);
      } catch (error) {
        console.error(`Error fetching ${distributionType} distribution:`, error);
      }
    };
    
    fetchDistribution();
  }, [distributionType]);
  
  const handleRefresh = async () => {
    try {
      await fetchDashboardSummary();
      await fetchProfitLossData(timeframe);
      await fetchPortfolioDistribution(distributionType);
    } catch (error) {
      console.error('Error refreshing analytics data:', error);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>CERBERUS Bot | Analytics Dashboard</title>
        </Head>
        
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">CERBERUS Bot Platform</h1>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Welcome, <span className="text-indigo-400">{user?.username || 'CERBERUSCHAINWhat\'s next?'}</span>
              </div>
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{user?.username?.[0]?.toUpperCase() || 'C'}</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2 className="text-2xl font-bold mb-4 lg:mb-0">Analytics Dashboard</h2>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <TimeframeSelector 
                value={timeframe}
                onChange={setTimeframe}
              />
              
              <div className="flex space-x-2">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  Refresh
                </button>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900 bg-opacity-20 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {isLoading && !dashboardData ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : dashboardData ? (
            <>
              {/* Key Metrics Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard
                  title="Portfolio Value"
                  value={`$${dashboardData.totalPortfolioValue.toLocaleString()}`}
                  change={dashboardData.totalProfitLossPercentage.day}
                  icon="portfolio"
                />
                
                <MetricCard
                  title="Total P&L (30d)"
                  value={`$${dashboardData.totalProfitLoss.month.toLocaleString()}`}
                  change={dashboardData.totalProfitLossPercentage.month}
                  icon="profit"
                />
                
                <MetricCard
                  title="Active Bots"
                  value={dashboardData.activeBots.toString()}
                  subValue={`${dashboardData.averageSuccessRate.toFixed(1)}% Success Rate`}
                  icon="bots"
                />
                
                <MetricCard
                  title="Trading Volume"
                  value={`$${dashboardData.totalVolume.toLocaleString()}`}
                  subValue={`${dashboardData.totalTransactions} Transactions`}
                  icon="volume"
                />
              </div>
              
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Profit/Loss Chart */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Profit/Loss</h3>
                    <div className="text-sm text-gray-400">
                      {timeframe === 'day' ? 'Today' :
                       timeframe === 'week' ? 'Last 7 Days' :
                       timeframe === 'month' ? 'Last 30 Days' :
                       timeframe === 'year' ? 'Last 12 Months' : 'All Time'}
                    </div>
                  </div>
                  {profitLossData ? (
                    <ProfitLossChart data={profitLossData} />
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  )}
                </div>
                
                {/* Portfolio Distribution */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Portfolio Distribution</h3>
                    <div className="flex items-center space-x-2">
                      <select
                        className="bg-gray-700 border-gray-600 text-white rounded text-sm"
                        value={distributionType}
                        onChange={(e) => aria-label="Selection field" setDistributionType(e.target.value as any)}
                      >
                        <option value="tokens">By Token</option>
                        <option value="bots">By Bot</option>
                        <option value="exchanges">By Exchange</option>
                      </select>
                    </div>
                  </div>
                  {portfolioDistribution ? (
                    <PortfolioDistributionChart data={portfolioDistribution} />
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bot Performance Table */}
              <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-lg font-medium">Bot Performance</h3>
                </div>
                <div className="overflow-x-auto">
                  <PerformanceTable bots={dashboardData.botPerformanceSummary} />
                </div>
              </div>
              
              {/* Recent Trades Table */}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recent Trades</h3>
                  <a href="/analytics/trades" className="text-indigo-400 hover:text-indigo-300 text-sm">
                    View All Trades →
                  </a>
                </div>
                <div className="overflow-x-auto">
                  <TradeHistoryTable trades={tradeHistory} />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400">No analytics data available.</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
              >
                Refresh
              </button>
            </div>
          )}
        </main>
        
        <footer className="container mx-auto px-4 py-6 border-t border-gray-800">
          <p className="text-center text-gray-500 text-sm">
            CERBERUS Bot Platform | Created: 2025-05-06 16:38:28 UTC | User: CERBERUSCHAINWhat's next?
          </p>
        </footer>
      </div>
      
      {isReportModalOpen && (
        <ReportGenerator onClose={() => setIsReportModalOpen(false)} />
      )}
    </ProtectedRoute>
  );
}
