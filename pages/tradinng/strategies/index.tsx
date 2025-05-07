// CERBERUS Bot - Strategy Listing Page
// Created: 2025-05-07 05:09:07 UTC
// Author: CERBERUSCHAIN

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout/Dashboard';

type Strategy = {
  id: string;
  name: string;
  type: string;
  timeframe: string;
  createdAt: Date;
  performance?: {
    winRate: number;
    totalTrades: number;
  };
};

export default function StrategiesPage() {
  const router = useRouter();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStrategies = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/strategies');
        // const data = await response.json();
        
        // For demo, use mock data
        const mockStrategies: Strategy[] = [
          {
            id: 'strat-1',
            name: 'Golden Cross',
            type: 'TREND_FOLLOWING',
            timeframe: '1h',
            createdAt: new Date('2025-05-01'),
            performance: {
              winRate: 65,
              totalTrades: 42
            }
          },
          {
            id: 'strat-2',
            name: 'RSI Reversal',
            type: 'MEAN_REVERSION',
            timeframe: '15m',
            createdAt: new Date('2025-04-15'),
            performance: {
              winRate: 58,
              totalTrades: 67
            }
          },
          {
            id: 'strat-3',
            name: 'MACD Momentum',
            type: 'MOMENTUM',
            timeframe: '4h',
            createdAt: new Date('2025-03-20')
          }
        ];
        
        setStrategies(mockStrategies);
      } catch (err) {
        console.error('Failed to fetch strategies:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStrategies();
  }, []);
  
  const handleStrategyClick = (strategyId: string) => {
    router.push(`/trading/strategies/${strategyId}`);
  };
  
  return (
    <Layout>
      <Head>
        <title>Trading Strategies | CERBERUS Bot Platform</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Trading Strategies</h1>
          <Link
            href="/trading/strategies/create"
            data-cy="create-strategy-button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
          >
            Create Strategy
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : strategies.length > 0 ? (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-750">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Timeframe</th>
                  <th className="text-left py-3 px-4 font-medium">Win Rate</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {strategies.map((strategy) => (
                  <tr
                    key={strategy.id}
                    data-cy={`strategy-row-${strategy.id}`}
                    className="border-t border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors"
                    onClick={() => handleStrategyClick(strategy.id)}
                  >
                    <td className="py-3 px-4 font-medium">{strategy.name}</td>
                    <td className="py-3 px-4">{strategy.type.replace('_', ' ')}</td>
                    <td className="py-3 px-4">{strategy.timeframe}</td>
                    <td className="py-3 px-4">
                      {strategy.performance ? (
                        <span className={strategy.performance.winRate >= 60 ? 'text-green-500' : 'text-yellow-500'}>
                          {strategy.performance.winRate}% ({strategy.performance.totalTrades} trades)
                        </span>
                      ) : (
                        <span className="text-gray-500">No data</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{strategy.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-2">No Strategies Yet</h3>
            <p className="text-gray-400 mb-6">
              You haven't created any trading strategies yet. Get started by creating your first strategy.
            </p>
            <Link
              href="/trading/strategies/create"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded transition-colors"
            >
              Create Your First Strategy
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}