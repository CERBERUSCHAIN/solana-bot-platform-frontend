// CERBERUS Bot - Token Explorer Page
// Created: 2025-05-06 04:00:28 UTC
// Author: CERBERUSCHAINNext

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { useTokenResearch } from '../../contexts/TokenResearchContext';
import { TokenCard } from '../../components/TokenResearch/TokenCard';
import { TokenFilter } from '../../components/TokenResearch/TokenFilter';
import { MarketTrendCard } from '../../components/TokenResearch/MarketTrendCard';
import { SearchBar } from '../../components/TokenResearch/SearchBar';
import { TokenFilter as TokenFilterType } from '../../types/token';
import { useAuth } from '../../contexts/AuthContext';

export default function TokenExplorerPage() {
  const { user } = useAuth();
  const { 
    trendingTokens, 
    watchlist, 
    marketTrends,
    isLoading, 
    error,
    fetchTrendingTokens,
    fetchWatchlist,
    fetchMarketTrends,
    searchTokens
  } = useTokenResearch();
  
  const [activeTab, setActiveTab] = useState<'trending' | 'watchlist'>('trending');
  const [timeframe, setTimeframe] = useState<'hour' | 'day' | 'week'>('day');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<TokenFilterType[]>([]);
  
  // Refresh data when tab changes
  useEffect(() => {
    if (activeTab === 'trending') {
      fetchTrendingTokens(timeframe);
    } else if (activeTab === 'watchlist') {
      fetchWatchlist();
    }
  }, [activeTab, timeframe]);
  
  // Initial data load
  useEffect(() => {
    fetchMarketTrends();
  }, []);
  
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchTokens(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleFilterChange = (newFilters: TokenFilterType[]) => {
    setFilters(newFilters);
    // In a real implementation, we would apply these filters to the token list
  };
  
  // Determine which tokens to display
  const displayTokens = searchResults.length > 0 
    ? searchResults 
    : activeTab === 'trending' 
      ? trendingTokens 
      : watchlist;
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>CERBERUS Bot | Token Explorer</title>
        </Head>
        
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">CERBERUS Bot Platform</h1>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Welcome, <span className="text-indigo-400">{user?.username || 'CERBERUSCHAINNext'}</span>
              </div>
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{user?.username?.[0]?.toUpperCase() || 'C'}</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2 className="text-2xl font-bold mb-4 lg:mb-0">Token Explorer</h2>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <SearchBar
                onSearch={handleSearch}
                isSearching={isSearching}
                placeholder="Search tokens by name, symbol, or address..."
              />
              
              <Link
                href="/tokens/screener"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white transition-colors"
              >
                Advanced Screener
              </Link>
            </div>
          </div>
          
          {/* Market Trends Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Market Trends</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : marketTrends.length > 0 ? (
                marketTrends.slice(0, 3).map(trend => (
                  <MarketTrendCard key={trend.id} trend={trend} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-400">
                  No market trends available
                </div>
              )}
            </div>
          </div>
          
          {/* Tabs for Trending/Watchlist */}
          <div className="border-b border-gray-700 mb-6">
            <div className="flex space-x-8">
              <button
                className={`py-3 border-b-2 font-medium ${
                  activeTab === 'trending'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('trending')}
              >
                Trending Tokens
              </button>
              <button
                className={`py-3 border-b-2 font-medium ${
                  activeTab === 'watchlist'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('watchlist')}
              >
                My Watchlist
              </button>
            </div>
          </div>
          
          {/* Time Selector for Trending */}
          {activeTab === 'trending' && (
            <div className="flex mb-6">
              <div className="bg-gray-800 rounded-lg inline-flex p-1">
                <button
                  className={`px-4 py-1.5 rounded text-sm font-medium ${
                    timeframe === 'hour'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setTimeframe('hour')}
                >
                  1H
                </button>
                <button
                  className={`px-4 py-1.5 rounded text-sm font-medium ${
                    timeframe === 'day'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setTimeframe('day')}
                >
                  24H
                </button>
                <button
                  className={`px-4 py-1.5 rounded text-sm font-medium ${
                    timeframe === 'week'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={() => setTimeframe('week')}
                >
                  7D
                </button>
              </div>
            </div>
          )}
          
          {/* Filter Bar */}
          <TokenFilter onFilterChange={handleFilterChange} />
          
          {/* Token List */}
          {error ? (
            <div className="bg-red-900 bg-opacity-20 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayTokens.length > 0 ? (
                displayTokens.map(token => (
                  <TokenCard 
                    key={token.address} 
                    token={token}
                    inWatchlist={watchlist.some(w => w.address === token.address)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16 text-gray-400">
                  {activeTab === 'watchlist' 
                    ? 'Your watchlist is empty. Add tokens to track them here.'
                    : 'No tokens found matching your criteria.'
                  }
                </div>
              )}
            </div>
          )}
          
          {/* Show More Button */}
          {displayTokens.length > 0 && !isSearching && (
            <div className="text-center">
              <button
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
                onClick={() => {
                  if (activeTab === 'trending') {
                    fetchTrendingTokens(timeframe, undefined, trendingTokens.length + 10);
                  }
                }}
              >
                Load More
              </button>
            </div>
          )}
        </main>
        
        <footer className="container mx-auto px-4 py-6 border-t border-gray-800">
          <p className="text-center text-gray-500 text-sm">
            CERBERUS Bot Platform | Created: 2025-05-06 04:00:28 UTC | User: CERBERUSCHAINNext
          </p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}