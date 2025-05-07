// CERBERUS Bot - Token Card Component
// Created: 2025-05-06 16:12:48 UTC
// Author: CERBERUSCHAINnext

import React from 'react';
import Link from 'next/link';
import { Token } from '../../types/token';
import { useTokenResearch } from '../../contexts/TokenResearchContext';

interface TokenCardProps {
  token: Token;
  inWatchlist: boolean;
}

export const TokenCard: React.FC<TokenCardProps> = ({ token, inWatchlist }) => {
  const { addToWatchlist, removeFromWatchlist } = useTokenResearch();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to token details
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(token.address);
      } else {
        await addToWatchlist(token.address);
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Link href={`/tokens/${token.address}`} legacyBehavior>
      <a className="block bg-gray-800 rounded-lg shadow-md overflow-hidden hover:bg-gray-750 transition-colors">
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {token.logoUrl ? (
                <img 
                  src={token.logoUrl} 
                  alt={token.symbol} 
                  className="w-10 h-10 rounded-full mr-3 bg-gray-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full mr-3 bg-gray-700 flex items-center justify-center">
                  <span className="font-bold text-gray-500">{token.symbol.substring(0, 2)}</span>
                </div>
              )}
              <div>
                <h3 className="font-medium">{token.name}</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 mr-2">{token.symbol}</span>
                  {token.verified && (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleToggleWatchlist}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-indigo-400 focus:outline-none"
            >
              {inWatchlist ? (
                <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
              )}
            </button>
          </div>
          
          <div className="flex justify-between mb-4">
            <div>
              <div className="text-lg font-bold">${token.price?.toFixed(6) || '—'}</div>
              {token.priceChange24h !== undefined && (
                <div className={`text-sm ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}% (24h)
                </div>
              )}
            </div>
            {token.marketCap !== undefined && (
              <div className="text-right">
                <div className="text-sm text-gray-400">Market Cap</div>
                <div className="font-medium">${token.marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
            )}
          </div>
          
          {token.volume24h !== undefined && (
            <div className="flex justify-between text-sm">
              <div>
                <div className="text-gray-400">Volume (24h)</div>
                <div>${token.volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              {token.rank !== undefined && (
                <div className="text-right">
                  <div className="text-gray-400">Rank</div>
                  <div>#{token.rank}</div>
                </div>
              )}
            </div>
          )}
          
          {token.tags && token.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {token.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-400">
                  {tag}
                </span>
              ))}
              {token.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-400">
                  +{token.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </a>
    </Link>
  );
};