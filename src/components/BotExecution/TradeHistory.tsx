// CERBERUS Bot - Trade History Component
// Created: 2025-05-07 00:28:52 UTC
// Author: CERBERUSCHAINYes

import React, { useState } from 'react';
import { BotTrade } from '../../types/botExecution';
import { formatDistanceToNow } from 'date-fns';

interface TradeHistoryProps {
  trades: BotTrade[];
  isLoading: boolean;
  showPagination?: boolean;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({
  trades,
  isLoading,
  showPagination = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination
  const totalPages = Math.ceil(trades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTrades = trades.slice(startIndex, endIndex);
  
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };
  
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };
  
  const formatAmount = (amount: string, symbol: string) => {
    try {
      const numAmount = parseFloat(amount);
      return `${numAmount.toLocaleString(undefined, { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 8
      })} ${symbol}`;
    } catch (e) {
      return `${amount} ${symbol}`;
    }
  };
  
  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 bg-opacity-20 text-green-400';
      case 'pending':
        return 'bg-yellow-900 bg-opacity-20 text-yellow-400';
      case 'failed':
        return 'bg-red-900 bg-opacity-20 text-red-400';
      case 'canceled':
        return 'bg-gray-700 text-gray-400';
      default:
        return 'bg-gray-700 text-gray-400';
    }
  };
  
  const getTypeColor = (type: string, profitLoss: number) => {
    if (type === 'buy') {
      return 'text-green-400';
    } else if (type === 'sell') {
      return profitLoss >= 0 ? 'text-green-400' : 'text-red-400';
    } else {
      return 'text-blue-400';
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow">
      <div className="overflow-x-auto">
        {isLoading && trades.length === 0 ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : trades.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No trades executed yet.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-750">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Token
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  P/L
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentTrades.map(trade => (
                <tr key={trade.id} className="hover:bg-gray-750">
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="text-gray-300">{formatTime(trade.timestamp)}</div>
                    <div className="text-xs text-gray-500">{formatRelativeTime(trade.timestamp)}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`uppercase font-medium ${getTypeColor(trade.type, trade.profitLoss)}`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {trade.tokenSymbol}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formatAmount(trade.amount, trade.tokenSymbol)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formatUSD(trade.priceUsd)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formatUSD(trade.valueUsd)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {trade.profitLoss !== 0 ? (
                      <div className={trade.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                        <span>{trade.profitLoss >= 0 ? '+' : ''}{formatUSD(trade.profitLoss)}</span>
                        <span className="block text-xs">
                          {trade.profitLoss >= 0 ? '+' : ''}{trade.profitLossPercentage.toFixed(2)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trade.status)}`}>
                      {trade.status}
                    </span>
                    {trade.transactionHash && (
                      <div className="mt-1">
                        <a 
                          href={`https://etherscan.io/tx/${trade.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 hover:text-indigo-300"
                        >
                          View Tx
                        </a>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-700">
          <div className="flex-1 flex justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                ${currentPage <= 1 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                ${currentPage >= totalPages 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};