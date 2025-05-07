// CERBERUS Bot - Bot Creation Page
// Created: 2025-05-07 05:09:07 UTC
// Author: CERBERUSCHAIN

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout/Dashboard';

type BotType = 'dex-trading' | 'cex-trading' | 'arbitrage' | 'market-making';

export default function CreateBotPage() {
  const router = useRouter();
  const [botName, setBotName] = useState('');
  const [selectedType, setSelectedType] = useState<BotType | null>(null);
  const [description, setDescription] = useState('');
  const [maxDailyTrades, setMaxDailyTrades] = useState('10');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    if (!botName) {
      setError('Bot name is required');
      return;
    }
    
    if (!selectedType) {
      setError('Please select a bot type');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // API call would go here
      // const response = await fetch('/api/bots', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: botName, type: selectedType, description, maxDailyTrades: parseInt(maxDailyTrades) })
      // });
      
      // For demo, simulate API call
      await new Promise(r => setTimeout(r, 1000));
      
      // Navigate back to bots list
      router.push('/trading/bots');
    } catch (err) {
      setError('Failed to create bot');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const botTypes: { id: BotType; name: string; description: string }[] = [
    { id: 'dex-trading', name: 'DEX Trading', description: 'Automated trading on decentralized exchanges' },
    { id: 'cex-trading', name: 'CEX Trading', description: 'Automated trading on centralized exchanges' },
    { id: 'arbitrage', name: 'Arbitrage', description: 'Profit from price differences between exchanges' },
    { id: 'market-making', name: 'Market Making', description: 'Provide liquidity and earn from spreads' },
  ];
  
  return (
    <Layout>
      <Head>
        <title>Create Bot | CERBERUS Bot Platform</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create a New Bot</h1>
        
        <div data-cy="bot-creation-form" className="bg-gray-800 rounded-lg p-6">
          {error && (
            <div className="bg-red-900 bg-opacity-40 text-red-400 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Bot Name
            </label>
            <input
              data-cy="bot-name-input"
              type="text"
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              placeholder="Enter a name for your bot"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Bot Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {botTypes.map((type) => (
                <div
                  key={type.id}
                  data-cy={`bot-type-${type.id}`}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedType === type.id 
                      ? 'border-indigo-500 bg-indigo-900 bg-opacity-30' 
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <h3 className="font-medium text-white">{type.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              data-cy="description-input"
              className="w-full bg-gray-700 text-white rounded px-3 py-2 min-h-[100px]"
              placeholder="Enter a description for your bot (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Max Daily Trades
            </label>
            <input
              data-cy="max-daily-trades-input"
              type="number"
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              placeholder="10"
              value={maxDailyTrades}
              onChange={(e) => setMaxDailyTrades(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            <button
              data-cy="create-bot-submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded transition-colors"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Bot'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}