// CERBERUS Bot - Dashboard Header Component
// Created: 2025-05-05 21:03:48 UTC
// Author: CERBERUSCHAIN1

import React from 'react';

interface DashboardHeaderProps {
  activeBots: number;
  wallets: number;
  volume24h: number;
  profitLoss: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeBots,
  wallets,
  volume24h,
  profitLoss
}) => {
  // Format the profit/loss with correct color and sign
  const formattedProfitLoss = profitLoss >= 0
    ? `+$${profitLoss.toFixed(2)}`
    : `-$${Math.abs(profitLoss).toFixed(2)}`;
  
  const profitLossColor = profitLoss >= 0
    ? 'text-green-500'
    : 'text-red-500';
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-white mb-4">CERBERUS Bot Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-sm text-gray-400">Active Bots</h2>
          <p className="text-2xl font-bold text-white">{activeBots}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-sm text-gray-400">Wallets</h2>
          <p className="text-2xl font-bold text-white">{wallets}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-sm text-gray-400">24H Volume</h2>
          <p className="text-2xl font-bold text-white">${volume24h.toFixed(2)}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-sm text-gray-400">Profit & Loss</h2>
          <p className={`text-2xl font-bold ${profitLossColor}`}>
            {formattedProfitLoss}
          </p>
        </div>
      </div>
    </div>
  );
};