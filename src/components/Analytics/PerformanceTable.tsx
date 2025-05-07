// CERBERUS Bot - Performance Table Component
// Created: 2025-05-06 16:45:54 UTC
// Author: CERBERUSCHAINYou choose

import React from 'react';
import Link from 'next/link';

interface BotPerformanceRow {
  botId: string;
  botName: string;
  botType: string;
  profitLoss: number;
  profitLossPercentage: number;
  transactionsExecuted: number;
  status: 'running' | 'paused' | 'stopped' | 'error';
}

interface PerformanceTableProps {
  bots: BotPerformanceRow[];
  isLoading?: boolean;
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ 
  bots, 
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

  if (bots.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400">No bot performance data available.</p>
      </div>
    );
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 bg-opacity-20 text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
            Running
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 bg-opacity-20 text-yellow-400">
            <span className="h-2 w-2 rounded-full bg-yellow-400 mr-1"></span>
            Paused
          </span>
        );
      case 'stopped':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 bg-opacity-60 text-gray-300">
            <span className="h-2 w-2 rounded-full bg-gray-400 mr-1"></span>
            Stopped
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 bg-opacity-20 text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-400 mr-1"></span>
            Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
            Unknown
          </span>
        );
    }
  };

  return (
    <table className="min-w-full">
      <thead>
        <tr className="bg-gray-750">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bot Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Profit/Loss</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">% Change</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Transactions</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700 bg-gray-800">
        {bots.map((bot) => (
          <tr key={bot.botId} className="hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Link href={`/bots/${bot.botId}`} className="text-indigo-400 hover:text-indigo-300">
                {bot.botName}
              </Link>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {bot.botType.charAt(0).toUpperCase() + bot.botType.slice(1)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {renderStatusBadge(bot.status)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <span className={bot.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                {bot.profitLoss >= 0 ? '+' : ''}${bot.profitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
              <span className={bot.profitLossPercentage >= 0 ? 'text-green-400' : 'text-red-400'}>
                {bot.profitLossPercentage >= 0 ? '+' : ''}{bot.profitLossPercentage.toFixed(2)}%
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">
              {bot.transactionsExecuted.toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
              <Link href={`/analytics/bot/${bot.botId}`} className="text-indigo-400 hover:text-indigo-300 mx-2">
                Details
              </Link>
              <Link href={`/bots/${bot.botId}/edit`} className="text-indigo-400 hover:text-indigo-300 mx-2">
                Configure
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};