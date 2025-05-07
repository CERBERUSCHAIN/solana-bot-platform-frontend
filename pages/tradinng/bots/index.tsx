// CERBERUS Bot - Bot Listing Page
// Created: 2025-05-07 05:09:07 UTC
// Author: CERBERUSCHAIN

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout/Dashboard';

type Bot = {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'inactive';
  createdAt: Date;
  lastExecuted: Date | null;
};

export default function BotsPage() {
  const router = useRouter();
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchBots = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/bots');
        // const data = await response.json();
        
        // For demo, use mock data
        const mockBots: Bot[] = [
          {
            id: 'bot-1',
            name: 'Solana DEX Bot',
            type: 'dex-trading',
            status: 'active',
            createdAt: new Date('2025-05-01'),
            lastExecuted: new Date('2025-05-06'),
          },
          {
            id: 'bot-2',
            name: 'Arbitrage Bot',
            type: 'arbitrage',
            status: 'paused',
            createdAt: new Date('2025-04-15'),
            lastExecuted: new Date('2025-05-05'),
          },
          {
            id: 'bot-3',
            name: 'Market Maker',
            type: 'market-making',
            status: 'inactive',
            createdAt: new Date('2025-03-20'),
            lastExecuted: null,
          }
        ];
        
        setBots(mockBots);
      } catch (err) {
        console.error('Failed to fetch bots:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBots();
  }, []);
  
  const handleBotClick = (botId: string) => {
    router.push(`/trading/bots/${botId}`);
  };
  
  return (
    <Layout>
      <Head>
        <title>My Bots | CERBERUS Bot Platform</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Trading Bots</h1>
          <Link
            href="/trading/bots/create"
            data-cy="create-bot-button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
          >
            Create Bot
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : bots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
              <div
                key={bot.id}
                data-cy={`bot-card-${bot.id}`}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 cursor-pointer transition-colors"
                onClick={() => handleBotClick(bot.id)}
              >
                <div className="p-5">
                  <h2 className="text-xl font-semibold">{bot.name}</h2>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-400">{bot.type}</span>
                    <span className="mx-2 text-gray-600">•</span>
                    <span 
                      className={`text-sm ${
                        bot.status === 'active' ? 'text-green-500' : 
                        bot.status === 'paused' ? 'text-yellow-500' : 'text-gray-500'
                      }`}
                    >
                      {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="px-5 py-3 bg-gray-850 text-sm text-gray-400 flex justify-between">
                  <span>Created: {bot.createdAt.toLocaleDateString()}</span>
                  <span>
                    {bot.lastExecuted ? `Last run: ${bot.lastExecuted.toLocaleDateString()}` : 'Never executed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-2">No Bots Yet</h3>
            <p className="text-gray-400 mb-6">
              You haven't created any trading bots yet. Get started by creating your first bot.
            </p>
            <Link
              href="/trading/bots/create"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded transition-colors"
            >
              Create Your First Bot
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}