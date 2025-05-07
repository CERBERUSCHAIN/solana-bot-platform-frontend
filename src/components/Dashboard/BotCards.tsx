// CERBERUS Bot - Bot Card Component
// Created: 2025-05-05 22:23:27 UTC
// Author: CERBERUSCHAINNext

import React from 'react';
import { Bot } from './Dashboard';
import { formatSOL, formatTimeSince } from '../../utils/formatters';

interface BotCardProps {
  bot: Bot;
}

export const BotCard: React.FC<BotCardProps> = ({ bot }) => {
  const getBotTypeColor = (type: string) => {
    switch (type) {
      case 'bundle': return 'bg-blue-100 text-blue-800';
      case 'bump': return 'bg-green-100 text-green-800';
      case 'volume': return 'bg-purple-100 text-purple-800';
      case 'sniper': return 'bg-red-100 text-red-800';
      case 'comment': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getBotStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'stopped': return 'bg-gray-500';
      case 'idle': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  const isProfitable = bot.metrics.profitLoss > 0;
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-white">{bot.name}</h3>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${getBotStatusColor(bot.status)} mr-1`}></div>
            <span className="text-xs text-gray-300 capitalize">{bot.status}</span>
          </div>
        </div>
        
        <div className="flex items-center mt-1">
          <span className={`text-xs px-2 py-0.5 rounded ${getBotTypeColor(bot.type)}`}>
            {bot.type.toUpperCase()}
          </span>
          <span className="text-xs text-gray-400 ml-2">
            Created {formatTimeSince(bot.createdAt)} ago
          </span>
        </div>
        
        <div className="mt-3 pb-3 border-b border-gray-700">
          <div className="text-sm text-gray-300">Token: <span className="text-white">{bot.token.name}</span></div>
          <div className="text-xs text-gray-500 font-mono truncate">{bot.token.address}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="text-center p-2 bg-gray-700 rounded">
            <div className="text-xs text-gray-400">Volume</div>
            <div className="text-sm font-medium text-white">{formatSOL(bot.metrics.totalVolume)}</div>
          </div>
          
          <div className="text-center p-2 bg-gray-700 rounded">
            <div className="text-xs text-gray-400">Profit/Loss</div>
            <div className={`text-sm font-medium ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
              {isProfitable ? '+' : ''}{formatSOL(bot.metrics.profitLoss)}
            </div>
          </div>
          
          <div className="text-center p-2 bg-gray-700 rounded">
            <div className="text-xs text-gray-400">Transactions</div>
            <div className="text-sm font-medium text-white">{bot.metrics.transactionsExecuted}</div>
          </div>
          
          <div className="text-center p-2 bg-gray-700 rounded">
            <div className="text-xs text-gray-400">Last Update</div>
            <div className="text-sm font-medium text-white">{formatTimeSince(bot.metrics.lastUpdated)}</div>
          </div>
        </div>
      </div>
      
      <div className="flex border-t border-gray-700">
        <button 
          className="flex-1 py-2 text-center text-sm font-medium text-indigo-400 hover:bg-gray-700 transition-colors"
          onClick={() => alert(`Edit ${bot.name}`)}
        >
          Edit
        </button>
        <button 
          className="flex-1 py-2 text-center text-sm font-medium text-white hover:bg-indigo-600 transition-colors bg-indigo-700"
          onClick={() => alert(`Control ${bot.name}`)}
        >
          {bot.status === 'running' ? 'Stop' : bot.status === 'paused' ? 'Resume' : 'Start'}
        </button>
      </div>
    </div>
  );
};