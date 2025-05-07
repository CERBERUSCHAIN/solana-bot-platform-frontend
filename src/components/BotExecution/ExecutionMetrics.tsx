// CERBERUS Bot - Execution Metrics Component
// Created: 2025-05-07 00:28:52 UTC
// Author: CERBERUSCHAINYes

import React from 'react';
import { BotPerformanceMetrics } from '../../types/botExecution';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ExecutionMetricsProps {
  metrics: BotPerformanceMetrics;
}

export const ExecutionMetrics: React.FC<ExecutionMetricsProps> = ({ metrics }) => {
  // Dummy data for profit chart - in a real app this would come from historical data
  const profitData = [
    { date: '2025-04-01', value: 0 },
    { date: '2025-04-02', value: 15 },
    { date: '2025-04-03', value: 10 },
    { date: '2025-04-04', value: 25 },
    { date: '2025-04-05', value: 20 },
    { date: '2025-04-06', value: 35 },
    { date: '2025-04-07', value: 40 },
    { date: '2025-04-08', value: 35 },
    { date: '2025-04-09', value: 50 },
    { date: '2025-04-10', value: metrics.avgProfitPerTrade * 10 }
  ];
  
  // Format numbers for display
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  const formatNumber = (value: number) => {
    return value.toLocaleString(undefined, { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold">Performance Metrics</h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="md:col-span-2 bg-gray-750 rounded-lg p-4">
            <h3 className="text-md font-medium mb-4">Profit/Loss History</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#9CA3AF' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis 
                    tick={{ fill: '#9CA3AF' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${value}`, 'Value']}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      borderColor: '#4B5563'
                    }}
                    labelStyle={{ color: '#E5E7EB' }}
                    itemStyle={{ color: '#E5E7EB' }}
                  />
                  <ReferenceLine y={0} stroke="#4B5563" />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4, strokeDasharray: '' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="bg-gray-750 rounded-lg p-4">
            <h3 className="text-md font-medium mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Win Rate</div>
                <div className="text-xl font-semibold">
                  {formatPercentage(metrics.winRate)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Profit Factor</div>
                <div className="text-xl font-semibold">
                  {formatNumber(metrics.profitFactor)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Max Drawdown</div>
                <div className="text-xl font-semibold text-red-400">
                  {formatPercentage(metrics.maxDrawdown)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Sharpe Ratio</div>
                <div className="text-xl font-semibold">
                  {formatNumber(metrics.sharpeRatio)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-750 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Total Trades</div>
            <div className="flex justify-between items-end">
              <div className="text-xl font-semibold">{metrics.totalTrades}</div>
              <div className="flex space-x-1 text-sm">
                <span className="text-green-400">{metrics.successfulTrades}</span>
                <span className="text-gray-500">/</span>
                <span className="text-red-400">{metrics.failedTrades}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Avg Profit Per Trade</div>
            <div className="flex justify-between items-end">
              <div className="text-xl font-semibold">
                {formatUSD(metrics.avgProfitPerTrade)}
              </div>
              <div className="text-green-400">
                {formatPercentage(metrics.avgProfitPerTrade / 100)}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Avg Loss Per Trade</div>
            <div className="flex justify-between items-end">
              <div className="text-xl font-semibold">
                {formatUSD(metrics.avgLossPerTrade)}
              </div>
              <div className="text-red-400">
                {formatPercentage(metrics.avgLossPerTrade / 100)}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Total Gas Cost</div>
            <div className="flex justify-between items-end">
              <div className="text-xl font-semibold">
                {formatUSD(metrics.totalGasCost)}
              </div>
              <div className="text-gray-400">
                Avg: {formatUSD(metrics.avgGasCost)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};