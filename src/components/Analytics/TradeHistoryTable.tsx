// CERBERUS Bot - Trade History Table Component
// Created: 2025-05-06 16:45:54 UTC
// Author: CERBERUSCHAINYou choose

import React from 'react';
import { TradeHistoryItem } from '../../types/analytics';

interface TradeHistoryTableProps {
  trades: TradeHistoryItem[];
  isLoading?: boolean;
}

export const TradeHistoryTable: React.FC<TradeHistoryTableProps> = ({ 
  trades, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="min-w-full">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-700 mb-2"></div>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-12 bg-gray-700 bg-opacity-50 mb-1"></div>
          ))}
        </div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400">No trade history available.</p>
      </div>
    );
  }

  return (
    <table className="min-w-full">
      <thead>
        <tr className="bg-gray-750">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bot</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Total Value</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700 bg-gray-800">
        {trades.map((trade) => (
          <tr key={trade.id} className="hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="font-medium">{trade.tokenSymbol}</div>
              <div className="text-xs text-gray-400">{`${trade.tokenAddress.substring(0, 6)}...${trade.tokenAddress.substring(trade.tokenAddress.length - 4)}`}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                trade.type === 'buy' ? 'bg-green-900 bg-opacity-20 text-green-400' :
                trade.type === 'sell' ? 'bg-red-900 bg-opacity-20 text-red-400' :
                'bg-blue-900 bg-opacity-20 text-blue-400'
              }`}>
                {trade.type.toUpperCase()}
              </span>
              <div className="text-xs text-gray-400 mt-1">
                {trade.status === 'confirmed' ? 'Completed' : 
                 trade.status === 'pending' ? 'Pending' : 'Failed'}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div>{trade.botName}</div>
              <div className="text-xs text-gray-400">{trade.botType}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
              {trade.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
              ${trade.price.toFixed(6)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              ${trade.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              {trade.profitLoss !== undefined && (
                <div className={`text-xs ${trade.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  {trade.profitLossPercentage !== undefined && ` (${trade.profitLossPercentage >= 0 ? '+' : ''}${trade.profitLossPercentage.toFixed(2)}%)`}
                </div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400">
              {new Date(trade.timestamp).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};