// CERBERUS Bot - Token Metrics Panel Component
// Created: 2025-05-06 15:51:38 UTC
// Author: CERBERUSCHAIN

import React from 'react';
import { TokenMetrics } from '../../types/token';

interface TokenMetricsPanelProps {
  metrics: TokenMetrics | null;
  isLoading: boolean;
}

export const TokenMetricsPanel: React.FC<TokenMetricsPanelProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-700"></div>
          <div className="mt-4 text-gray-500">Loading metrics...</div>
        </div>
      </div>
    );
  }
  
  if (!metrics) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">No metrics available for this token.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Holders Section */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-medium mb-4">Holder Distribution</h3>
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">Total Holders:</span>
            <span className="text-sm font-medium">{metrics.holders.count.toLocaleString()}</span>
          </div>
          
          {/* Distribution Chart */}
          <div className="mt-4 space-y-2">
            {metrics.holders.distribution.map((dist, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-400">{dist.range}</span>
                  <span className="text-xs text-gray-400">{dist.percentage.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${dist.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Holders */}
        <h4 className="text-md font-medium mb-3">Top Holders</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Address</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Balance</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {metrics.holders.topHolders.slice(0, 5).map((holder, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-center">
                      <span className="font-mono">
                        {holder.address.substring(0, 6)}...{holder.address.substring(holder.address.length - 4)}
                      </span>
                      {holder.tag && (
                        <span className="ml-2 px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
                          {holder.tag}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-right font-mono">
                    {parseFloat(holder.balance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {holder.percentage.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Liquidity Section */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-medium mb-4">Liquidity</h3>
        <div className="flex justify-between mb-4">
          <span className="text-gray-400">Total Liquidity:</span>
          <span className="font-medium">${metrics.liquidity.total.toLocaleString()}</span>
        </div>
        
        {/* Trading Pairs */}
        <h4 className="text-md font-medium mb-3">Trading Pairs</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Pair</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Exchange</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Liquidity</th>
              </tr>
            </thead>
            <tbody>
              {metrics.liquidity.pairs.map((pair, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="px-4 py-2 text-sm">
                    {pair.token0Symbol}/{pair.token1Symbol}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    {pair.exchange}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    ${pair.liquidityUSD.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Trading Metrics */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-medium mb-4">Trading Metrics (24h)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Volume:</span>
              <span className="font-medium">${metrics.trading.volume24h.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Transactions:</span>
              <span className="font-medium">{metrics.trading.transactions24h.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Buy/Sell Ratio:</span>
              <span className="font-medium">
                {(metrics.trading.buys24h / (metrics.trading.sells24h || 1)).toFixed(2)}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Unique Buyers:</span>
              <span className="font-medium">{metrics.trading.uniqueBuyers24h.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Unique Sellers:</span>
              <span className="font-medium">{metrics.trading.uniqueSellers24h.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Avg. Trade Size:</span>
              <span className="font-medium">${metrics.trading.averageTradeSize.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Largest Trade */}
        <div className="mt-4 bg-gray-700 bg-opacity-50 p-3 rounded">
          <div className="text-sm mb-1">Largest Trade (24h):</div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">
              {new Date(metrics.trading.largestTrade24h.timestamp).toLocaleString()} ({metrics.trading.largestTrade24h.type})
            </span>
            <span className="font-medium">${metrics.trading.largestTrade24h.size.toLocaleString()}</span>
          </div>
          <div className="text-xs font-mono text-gray-500 mt-1">
            Tx: {metrics.trading.largestTrade24h.txHash.substring(0, 16)}...
          </div>
        </div>
      </div>
      
      {/* Technical Indicators */}
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Technical Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium mb-2">Momentum</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">RSI (14):</span>
                <span className={`font-medium ${
                  metrics.momentum.rsi14 < 30 ? 'text-red-400' : 
                  metrics.momentum.rsi14 > 70 ? 'text-green-400' : 
                  'text-white'
                }`}>{metrics.momentum.rsi14.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">MACD:</span>
                <span className={`font-medium ${
                  metrics.momentum.macd.histogram > 0 ? 'text-green-400' : 'text-red-400'
                }`}>{metrics.momentum.macd.value.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">OBV:</span>
                <span className="font-medium">{metrics.momentum.obv.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-md font-medium mb-2">Volatility</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Daily:</span>
                <span className="font-medium">{metrics.volatility.daily.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Weekly:</span>
                <span className="font-medium">{metrics.volatility.weekly.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly:</span>
                <span className="font-medium">{metrics.volatility.monthly.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};