// CERBERUS Bot - Market Trend Card Component
// Created: 2025-05-06 16:12:48 UTC
// Author: CERBERUSCHAINnext

import React from 'react';
import { MarketTrend } from '../../types/token';

interface MarketTrendCardProps {
  trend: MarketTrend;
}

export const MarketTrendCard: React.FC<MarketTrendCardProps> = ({ trend }) => {
  // Get appropriate icons and colors based on sentiment
  const getSentimentStyles = () => {
    switch (trend.sentiment) {
      case 'bullish':
        return {
          bgColor: 'bg-green-900 bg-opacity-20',
          textColor: 'text-green-400',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          )
        };
      case 'bearish':
        return {
          bgColor: 'bg-red-900 bg-opacity-20',
          textColor: 'text-red-400',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path>
            </svg>
          )
        };
      default:
        return {
          bgColor: 'bg-blue-900 bg-opacity-20',
          textColor: 'text-blue-400',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
            </svg>
          )
        };
    }
  };
  
  // Get timeframe display
  const getTimeframeDisplay = () => {
    switch (trend.timeframe) {
      case 'short_term':
        return 'Short Term';
      case 'mid_term':
        return 'Mid Term';
      case 'long_term':
        return 'Long Term';
      default:
        return trend.timeframe;
    }
  };
  
  const styles = getSentimentStyles();
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{trend.name}</h3>
          <div className={`flex items-center px-2 py-1 rounded ${styles.bgColor} ${styles.textColor}`}>
            {styles.icon}
            <span className="ml-1 text-xs capitalize">{trend.sentiment}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-400 mb-3">{trend.description}</p>
        
        <div className="flex justify-between text-sm">
          <div className="text-gray-400">
            <span className="font-medium">Started:</span>{' '}
            <span>{new Date(trend.startDate).toLocaleDateString()}</span>
          </div>
          <div className={`font-medium ${trend.isPredictive ? 'text-yellow-400' : 'text-gray-400'}`}>
            {trend.isPredictive ? 'Predicted' : 'Active'}
          </div>
        </div>
        
        <div className="mt-3">
          <div className="text-xs text-gray-400 mb-1">Trend Strength</div>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-700 rounded-full h-2 mr-2">
              <div 
                className={`h-2 rounded-full ${
                  trend.sentiment === 'bullish' ? 'bg-green-500' : 
                  trend.sentiment === 'bearish' ? 'bg-red-500' : 
                  'bg-blue-500'
                }`}
                style={{ width: `${trend.strength}%` }}
              ></div>
            </div>
            <div className="text-xs font-medium">{trend.strength}%</div>
          </div>
        </div>
        
        {trend.relatedTags && trend.relatedTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {trend.relatedTags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-400">
                {tag}
              </span>
            ))}
            {trend.relatedTags.length > 3 && (
              <span className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-400">
                +{trend.relatedTags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-700 px-4 py-2 flex justify-between items-center bg-gray-750">
        <span className="text-xs text-gray-400">
          {getTimeframeDisplay()}
        </span>
        <span className="text-xs text-gray-400">
          {trend.tokens.length} tokens
        </span>
      </div>
    </div>
  );
};