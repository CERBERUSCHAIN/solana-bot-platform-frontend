// CERBERUS Bot - Execution Summary Component
// Created: 2025-05-07 00:48:50 UTC
// Author: CERBERUSCHAINYes

import React from 'react';
import { BotStatusSummary } from '../../types/botExecution';

interface ExecutionSummaryProps {
  summary: BotStatusSummary;
  isLoading: boolean;
}

export const ExecutionSummary: React.FC<ExecutionSummaryProps> = ({
  summary,
  isLoading
}) => {
  // Format numbers for display
  const formatPercentage = (value: number) => {
    const isPositive = value >= 0;
    return `${isPositive ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  const formatNumber = (value: number) => {
    return value.toLocaleString(undefined);
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
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Bots Card */}
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm">Total Bots</h3>
            {isLoading ? (
              <div className="h-8 my-1 bg-gray-700 rounded animate-pulse w-16"></div>
            ) : (
              <p className="text-3xl font-bold">{formatNumber(summary.totalBots)}</p>
            )}
          </div>
          <div className="rounded-full p-3 bg-indigo-900 bg-opacity-30">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900 bg-opacity-30 text-green-400">
              {summary.activeBots} active
            </span>
          </div>
          
          <span className="text-gray-500">
            {summary.dailyActiveStrategies} strategies
          </span>
        </div>
      </div>
      
      {/* Profit/Loss Card */}
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm">24h Profit/Loss</h3>
            {isLoading ? (
              <div className="h-8 my-1 bg-gray-700 rounded animate-pulse w-24"></div>
            ) : (
              <p className={`text-3xl font-bold ${summary.totalProfit24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatUSD(summary.totalProfit24h)}
              </p>
            )}
          </div>
          <div className={`rounded-full p-3 ${
            summary.totalProfit24h >= 0 
              ? 'bg-green-900 bg-opacity-30' 
              : 'bg-red-900 bg-opacity-30'
          }`}>
            <svg className={`w-6 h-6 ${
              summary.totalProfit24h >= 0 
                ? 'text-green-400' 
                : 'text-red-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d={summary.totalProfit24h >= 0 
                  ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                  : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"}>
              </path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Trading Activity Card */}
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm">24h Trading Activity</h3>
            {isLoading ? (
              <div className="h-8 my-1 bg-gray-700 rounded animate-pulse w-20"></div>
            ) : (
              <p className="text-3xl font-bold">{formatNumber(summary.totalTrades24h)}</p>
            )}
          </div>
          <div className="rounded-full p-3 bg-blue-900 bg-opacity-30">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
            </svg>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900 bg-opacity-30 text-green-400">
              {summary.successfulTrades24h} successful
            </span>
          </div>
          
          <span className="text-gray-500">
            Win rate: {(summary.successfulTrades24h / (summary.totalTrades24h || 1) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
      
      {/* Bot Status Card */}
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm">Bot Status</h3>
            {isLoading ? (
              <div className="h-8 my-1 bg-gray-700 rounded animate-pulse w-28"></div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <span className="text-green-400">{summary.activeBots} active</span>
                  <span className="text-yellow-400">{summary.pausedBots} paused</span>
                  <span className="text-red-400">{summary.errorBots} error</span>
                </div>
              </div>
            )}
          </div>
          <div className="rounded-full p-3 bg-purple-900 bg-opacity-30">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};