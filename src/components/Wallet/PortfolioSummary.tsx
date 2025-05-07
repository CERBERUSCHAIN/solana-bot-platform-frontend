// CERBERUS Bot - Portfolio Summary Component
// Created: 2025-05-06 23:36:46 UTC
// Author: CERBERUSCHAINPortfolio Dashboard page (portfolio.tsx) is NOT complete

import React from 'react';
import { PortfolioTotals } from '../../types/wallet';

interface PortfolioSummaryProps {
  totals: PortfolioTotals;
  timeframe: 'day' | 'week' | 'month' | 'year' | 'all';
  onTimeframeChange: (timeframe: 'day' | 'week' | 'month' | 'year' | 'all') => void;
  isLoading: boolean;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ 
  totals, 
  timeframe,
  onTimeframeChange,
  isLoading 
}) => {
  const formatUsd = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  const formatPercentage = (value: number) => {
    const isPositive = value >= 0;
    return `${isPositive ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  // Get the change for the selected timeframe
  const getChangeForTimeframe = () => {
    switch (timeframe) {
      case 'day':
        return {
          value: totals.change24h,
          percentage: totals.change24hPercentage
        };
      case 'week':
        return {
          value: totals.change7d,
          percentage: totals.change7dPercentage
        };
      case 'month':
        return {
          value: totals.change30d,
          percentage: totals.change30dPercentage
        };
      default:
        return {
          value: totals.totalProfitLossUsd,
          percentage: totals.totalProfitLossPercentage
        };
    }
  };
  
  const change = getChangeForTimeframe();
  const isPositiveChange = change.value >= 0;
  
  return (
    <div className="bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Total Balance</h2>
            {isLoading ? (
              <div className="h-8 my-2 bg-gray-700 rounded animate-pulse w-48"></div>
            ) : (
              <div className="text-3xl font-bold mt-2">{formatUsd(totals.totalBalanceUsd)}</div>
            )}
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="text-sm text-gray-400 mb-1">Change ({timeframe})</div>
            {isLoading ? (
              <div className="h-6 bg-gray-700 rounded animate-pulse w-24"></div>
            ) : (
              <div className={`flex items-center ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
                <svg 
                  className="w-5 h-5 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d={isPositiveChange ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} 
                  />
                </svg>
                <span className="font-semibold">{formatPercentage(change.percentage)}</span>
                <span className="ml-2 text-sm">{formatUsd(change.value)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTimeframeChange('day')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'day' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            24H
          </button>
          
          <button
            onClick={() => onTimeframeChange('week')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'week' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            7D
          </button>
          
          <button
            onClick={() => onTimeframeChange('month')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'month' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            30D
          </button>
          
          <button
            onClick={() => onTimeframeChange('year')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'year' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            1Y
          </button>
          
          <button
            onClick={() => onTimeframeChange('all')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
        </div>
      </div>
    </div>
  );
};