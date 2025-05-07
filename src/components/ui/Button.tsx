// CERBERUS Bot - Dashboard Component
// Created: 2025-05-05 22:23:27 UTC
// Author: CERBERUSCHAINNext

import React, { useState, useEffect } from 'react';
import { BotCard } from './BotCard';
import { MetricsPanel } from './MetricsPanel';
import { FilterBar } from './FilterBar';
import { BotType, BotStatus } from '../../types/bot';

interface DashboardProps {
  userId: string;
}

export interface Bot {
  id: string;
  name: string;
  type: BotType;
  status: BotStatus;
  createdAt: string;
  token: {
    name: string;
    address: string;
    symbol?: string;
  };
  metrics: {
    transactionsExecuted: number;
    totalVolume: number;
    profitLoss: number;
    lastUpdated: string;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: 'all' as BotType | 'all',
    status: 'all' as BotStatus | 'all',
    search: '',
  });
  
  useEffect(() => {
    const fetchBots = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be an API call
        // const response = await fetch(`/api/users/${userId}/bots`);
        // const data = await response.json();
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockData = generateMockBots();
        
        setBots(mockData);
        setError(null);
      } catch (err) {
        console.error('Error fetching bots:', err);
        setError('Failed to load bots. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBots();
  }, [userId]);
  
  const totalVolume = bots.reduce((sum, bot) => sum + bot.metrics.totalVolume, 0);
  const totalProfitLoss = bots.reduce((sum, bot) => sum + bot.metrics.profitLoss, 0);
  const activeBotsCount = bots.filter(bot => bot.status === 'running').length;
  
  const filteredBots = bots.filter(bot => {
    const matchesType = filters.type === 'all' || bot.type === filters.type;
    const matchesStatus = filters.status === 'all' || bot.status === filters.status;
    const matchesSearch = filters.search === '' || 
      bot.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      bot.token.name.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });
  
  return (
    <div className="flex flex-col">
      <MetricsPanel 
        totalBots={bots.length}
        activeBots={activeBotsCount}
        totalVolume={totalVolume}
        totalProfitLoss={totalProfitLoss}
      />
      
      <FilterBar 
        filters={filters}
        onFilterChange={setFilters}
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-indigo-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <p className="mt-2">Loading bots...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredBots.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No bots match your current filters.
            </div>
          ) : (
            filteredBots.map(bot => (
              <BotCard key={bot.id} bot={bot} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to generate mock data
function generateMockBots(): Bot[] {
  const botTypes: BotType[] = ['bundle', 'bump', 'volume', 'sniper', 'comment'];
  const statuses: BotStatus[] = ['idle', 'running', 'paused', 'error', 'stopped'];
  const tokenNames = ['BONK', 'SOL', 'DUST', 'RENDER', 'WIF', 'BOME', 'NEON'];
  
  return Array.from({ length: 9 }, (_, i) => {
    const type = botTypes[Math.floor(Math.random() * botTypes.length)];
    const botNumber = i + 1;
    const volume = Math.random() * 100;
    
    return {
      id: `bot-${botNumber}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Bot ${botNumber}`,
      type,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      token: {
        name: tokenNames[Math.floor(Math.random() * tokenNames.length)],
        address: `token${Math.random().toString(36).substring(2, 10)}`,
      },
      metrics: {
        transactionsExecuted: Math.floor(Math.random() * 100),
        totalVolume: volume,
        profitLoss: volume * (Math.random() * 0.2 - 0.05), // -5% to +15%
        lastUpdated: new Date().toISOString(),
      },
    };
  });
}