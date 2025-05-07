// CERBERUS Bot - Transaction History Component
// Created: 2025-05-06 02:25:55 UTC
// Author: CERBERUSCHAIN1

import React from 'react';
import { TransactionInfo } from '../../types/wallet';

interface TransactionHistoryProps {
  transactions: TransactionInfo[];
  showViewAll?: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, showViewAll }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-gray-700 rounded-lg p-6 text-center">
        <p className="text-gray-400">No transactions found for this wallet.</p>
      </div>
    );
  }
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'send':
        return (
          <div className="p-2 rounded-full bg-red-900 bg-opacity-30 text-red-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </div>
        );
      case 'receive':
        return (
          <div className="p-2 rounded-full bg-green-900 bg-opacity-30 text-green-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
            </svg>
          </div>
        );
      case 'swap':
        return (
          <div className="p-2 rounded-full bg-blue-900 bg-opacity-30 text-blue-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
            </svg>
          </div>
        );
      case 'bot':
        return (
          <div className="p-2 rounded-full bg-purple-900 bg-opacity-30 text-purple-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gray-700 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
    }
  };
  
  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-600">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Transaction
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-700 divide-y divide-gray-600">
          {transactions.map((tx) => (
            <tr key={tx.signature} className="hover:bg-gray-650">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getTransactionTypeIcon(tx.type)}
                  <div className="ml-4">
                    <div className="text-sm font-medium capitalize">{tx.type}</div>
                    <div className="text-xs text-gray-400 font-mono">
                      {tx.signature.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className={`text-sm font-medium ${
                  tx.type === 'send' ? 'text-red-400' : tx.type === 'receive' ? 'text-green-400' : ''
                }`}>
                  {tx.type === 'send' ? '-' : tx.type === 'receive' ? '+' : ''}
                  {tx.amount.toFixed(5)}
                </div>
                <div className="text-xs text-gray-400">
                  {tx.tokenInfo ? tx.tokenInfo.symbol : 'SOL'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm font-medium">
                  {new Date(tx.timestamp).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  tx.status === 'confirmed' 
                    ? 'bg-green-900 bg-opacity-30 text-green-400' 
                    : tx.status === 'processing'
                    ? 'bg-yellow-900 bg-opacity-30 text-yellow-400'
                    : 'bg-red-900 bg-opacity-30 text-red-400'
                }`}>
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {showViewAll && (
        <div className="px-6 py-3 bg-gray-800 text-center">
          <button 
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            onClick={showViewAll}
          >
            View All Transactions
          </button>
        </div>
      )}
    </div>
  );
};