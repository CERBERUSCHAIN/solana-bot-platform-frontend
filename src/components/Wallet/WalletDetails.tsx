// CERBERUS Bot - Wallet List Component
// Created: 2025-05-06 02:25:55 UTC
// Author: CERBERUSCHAIN1

import React from 'react';
import { Wallet } from '../../types/wallet';

interface WalletListProps {
  wallets: Wallet[];
  selectedAddress?: string;
  onSelectWallet: (wallet: Wallet) => void;
}

export const WalletList: React.FC<WalletListProps> = ({ wallets, selectedAddress, onSelectWallet }) => {
  if (wallets.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No wallets found. Create or import a wallet to get started.
      </div>
    );
  }
  
  const getWalletTypeIcon = (type: string) => {
    switch (type) {
      case 'hot':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
          </svg>
        );
      case 'cold':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        );
      case 'hardware':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
          </svg>
        );
      case 'imported':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
        );
    }
  };
  
  return (
    <div className="max-h-96 overflow-y-auto">
      {wallets.map((wallet) => (
        <div
          key={wallet.address}
          className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer ${
            selectedAddress === wallet.address ? 'bg-indigo-900' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => onSelectWallet(wallet)}
        >
          <div className={`p-2 rounded-full mr-3 ${
            selectedAddress === wallet.address ? 'bg-indigo-800' : 'bg-gray-600'
          }`}>
            {getWalletTypeIcon(wallet.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              {wallet.name || `Wallet ${wallet.address.substring(0, 4)}...${wallet.address.substring(wallet.address.length - 4)}`}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {wallet.address.substring(0, 8)}...{wallet.address.substring(wallet.address.length - 8)}
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-medium text-sm">{wallet.balanceSol.toFixed(3)}</div>
            <div className="text-xs text-gray-400">SOL</div>
          </div>
        </div>
      ))}
    </div>
  );
};