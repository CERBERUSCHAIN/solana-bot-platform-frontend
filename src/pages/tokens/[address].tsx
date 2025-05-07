// CERBERUS Bot - Token Detail Page
// Created: 2025-05-06 16:12:48 UTC
// Author: CERBERUSCHAINnext

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { useTokenResearch } from '../../contexts/TokenResearchContext';
import { TokenPriceChart } from '../../components/TokenResearch/TokenPriceChart';
import { TokenMetricsPanel } from '../../components/TokenResearch/TokenMetricsPanel';
import { TokenSocialFeed } from '../../components/TokenResearch/TokenSocialFeed';
import { TokenAlertForm } from '../../components/TokenResearch/TokenAlertForm';
import { TokenPairsList } from '../../components/TokenResearch/TokenPairsList';
import { TokenAnalysisSummary } from '../../components/TokenResearch/TokenAnalysisSummary';
import { BotRecommendation } from '../../components/TokenResearch/BotRecommendation';
import { Token, TokenMetrics, AlertType } from '../../types/token';
import { useBot } from '../../contexts/BotContext';
import { useAuth } from '../../contexts/AuthContext';

export default function TokenDetailPage() {
  const router = useRouter();
  const { address } = router.query;
  const { user } = useAuth();
  const { createBot } = useBot();
  const { 
    getTokenDetails, 
    getTokenPriceHistory, 
    getTokenMetrics,
    getTokenSocialActivity,
    analyzeToken,
    getTokenPairs,
    addToWatchlist,
    removeFromWatchlist,
    createAlert,
    isLoading,
    error,
    watchlist
  } = useTokenResearch();
  
  const [token, setToken] = useState<Token | null>(null);
  const [priceHistory, setPriceHistory] = useState<Array<{timestamp: number, price: number, volume: number}>>([]);
  const [metrics, setMetrics] = useState<TokenMetrics | null>(null);
  const [socialActivity, setSocialActivity] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [pairs, setPairs] = useState<any[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [timeframe, setTimeframe] = useState<'1h' | '1d' | '1w' | '1m' | 'all'>('1d');
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'social' | 'pairs' | 'analysis'>('overview');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  
  // Load token data
  useEffect(() => {
    if (address && typeof address === 'string') {
      loadTokenData(address);
    }
  }, [address]);
  
  // Check if token is in watchlist
  useEffect(() => {
    if (token) {
      setIsInWatchlist(watchlist.some(w => w.address === token.address));
    }
  }, [token, watchlist]);
  
  // Update price history when timeframe changes
  useEffect(() => {
    if (token) {
      fetchPriceHistory(token.address);
    }
  }, [timeframe]);
  
  const loadTokenData = async (tokenAddress: string) => {
    try {
      // Fetch basic token info
      const tokenData = await getTokenDetails(tokenAddress);
      setToken(tokenData);
      
      // Fetch price history
      fetchPriceHistory(tokenAddress);
      
      // Fetch metrics
      const metricsData = await getTokenMetrics(tokenAddress);
      setMetrics(metricsData);
      
      // Fetch pairs
      const pairsData = await getTokenPairs(tokenAddress);
      setPairs(pairsData);
      
      // Fetch analysis
      const analysisData = await analyzeToken(tokenAddress);
      setAnalysis(analysisData);
      
    } catch (error) {
      console.error('Error loading token data:', error);
    }
  };
  
  const fetchPriceHistory = async (tokenAddress: string) => {
    try {
      const historyData = await getTokenPriceHistory(tokenAddress, timeframe);
      setPriceHistory(historyData);
    } catch (error) {
      console.error('Error fetching price history:', error);
    }
  };
  
  const fetchSocialActivity = async () => {
    if (!token) return;
    
    try {
      const socialData = await getTokenSocialActivity(token.address, ['twitter', 'telegram', 'discord']);
      setSocialActivity(socialData);
    } catch (error) {
      console.error('Error fetching social activity:', error);
    }
  };
  
  const handleTabChange = (tab: 'overview' | 'metrics' | 'social' | 'pairs' | 'analysis') => {
    setActiveTab(tab);
    
    // Load social data only when needed
    if (tab === 'social' && !socialActivity) {
      fetchSocialActivity();
    }
  };
  
  const handleToggleWatchlist = async () => {
    if (!token) return;
    
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(token.address);
      } else {
        await addToWatchlist(token.address);
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };
  
  const handleCreateAlert = async (alertType: AlertType, threshold: number, timeframe?: string) => {
    if (!token) return;
    
    try {
      await createAlert({
        userId: user?.id || '',
        tokenAddress: token.address,
        tokenSymbol: token.symbol,
        type: alertType,
        threshold,
        timeframe,
        createdAt: new Date().toISOString(),
        active: true,
        notificationChannels: ['email', 'push']
      });
      setIsAlertModalOpen(false);
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };
  
  const handleCreateBot = async (botType: string, config: any) => {
    if (!token) return;
    
    try {
      // Integrate with the bot context to create a new bot
      const botConfig = {
        name: `${botType} Bot - ${token.symbol}`,
        type: botType,
        token: {
          address: token.address,
          name: token.name,
          symbol: token.symbol
        },
        ...config
      };
      
      await createBot(botConfig);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating bot:', error);
    }
  };
  
  if (!token && !isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Token Not Found</h2>
            <p className="text-gray-400 mb-6">The token you're looking for was not found or does not exist.</p>
            <button 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
              onClick={() => router.push('/tokens')}
            >
              Back to Token Explorer
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>{token ? `${token.name} (${token.symbol})` : 'Token'} | CERBERUS Bot</title>
        </Head>
        
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">CERBERUS Bot Platform</h1>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Welcome, <span className="text-indigo-400">{user?.username || 'CERBERUSCHAINnext'}</span>
              </div>
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{user?.username?.[0]?.toUpperCase() || 'C'}</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900 bg-opacity-20 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : token ? (
            <>
              {/* Token Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div className="flex items-center mb-4 lg:mb-0">
                  {token.logoUrl && (
                    <img 
                      src={token.logoUrl} 
                      alt={token.name} 
                      className="w-12 h-12 mr-4 rounded-full bg-gray-800"
                    />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{token.name} ({token.symbol})</h2>
                    <p className="text-gray-400 text-sm font-mono">{token.address}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">${token.price?.toFixed(6)}</div>
                    <div className={`text-sm ${token.priceChange24h && token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {token.priceChange24h && token.priceChange24h >= 0 ? '+' : ''}
                      {token.priceChange24h?.toFixed(2)}% (24h)
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      className={`px-4 py-2 rounded ${
                        isInWatchlist 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                      onClick={handleToggleWatchlist}
                    >
                      {isInWatchlist ? 'Watching' : 'Add to Watchlist'}
                    </button>
                    
                    <button
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                      onClick={() => setIsAlertModalOpen(true)}
                    >
                      Create Alert
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Token Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Market Cap</div>
                  <div className="text-lg font-medium">
                    ${token.marketCap ? token.marketCap.toLocaleString() : 'N/A'}
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">24h Volume</div>
                  <div className="text-lg font-medium">
                    ${token.volume24h ? token.volume24h.toLocaleString() : 'N/A'}
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Total Supply</div>
                  <div className="text-lg font-medium">
                    {parseInt(token.totalSupply).toLocaleString()} {token.symbol}
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Holder Count</div>
                  <div className="text-lg font-medium">
                    {metrics?.holders.count.toLocaleString() || 'Loading...'}
                  </div>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="border-b border-gray-700 mb-6">
                <div className="flex flex-wrap">
                  <button
                    className={`py-3 px-4 border-b-2 font-medium ${
                      activeTab === 'overview'
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => handleTabChange('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={