// CERBERUS Bot - Metrics Panel Component
// Created: 2025-05-05 22:23:27 UTC
// Author: CERBERUSCHAINNext

import React from 'react';
import { formatSOL } from '../../utils/formatters';

interface MetricsPanelProps {
  totalBots: number;
  activeBots: number;
  totalVolume: number;
  totalProfitLoss: number;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  totalBots,
  activeBots,
  totalVolume,
  totalProfitLoss
}) => {
  const isProfitable = totalProfitLoss > 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-500 bg-opacity-20 rounded">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-400">Total Bots</h3>
            <div className="text-xl font-semibold text-white">{totalBots}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center">
          <div className="p-2 bg-green-500 bg-opacity-20 rounded">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 004.6 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path>
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-400">Active Bots</h3>
            <div className="text-xl font-semibold text-white">{activeBots}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-500 bg-opacity-20 rounded">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-400">Total Volume</h3>
            <div className="text-xl font-semibold text-white">{formatSOL(totalVolume)}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center">
          <div className={`p-2 ${isProfitable ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'} rounded`}>
            <svg className={`w-6 h-6 ${isProfitable ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isProfitable 
                ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"}>
              </path>
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-400">Profit/Loss</h3>
            <div className={`text-xl font-semibold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {isProfitable ? '+' : ''}{formatSOL(totalProfitLoss)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};