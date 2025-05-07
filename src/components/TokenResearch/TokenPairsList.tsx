// CERBERUS Bot - Token Pairs List Component
// Created: 2025-05-06 15:51:38 UTC
// Author: CERBERUSCHAIN

import React from 'react';

interface TokenPair {
  pairAddress: string;
  tokenAddress: string;
  tokenSymbol: string;
  liquidity: number;
  volume24h: number;
  priceChange24h: number;
}

interface TokenPairsListProps {
  pairs: TokenPair[];
  isLoading: boolean;
}

export const TokenPairsList: React.FC<TokenPairsListProps> = ({ pairs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-700"></div>
          <div className="mt-4 text-gray-500">Loading pairs data...</div>
        </div>
      </div>
    );
  }
  
  if (!pairs || pairs.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">No trading pairs available for this token.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Trading Pairs</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Pair
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Liquidity
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Volume (24h)
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price Change (24h)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {pairs.map((pair, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <span className="font-medium">{pair.tokenSymbol}</span>
                      <span className="text-gray-400 text-xs ml-2">
                        {pair.pairAddress.substring(0, 6)}...{pair.pairAddress.substring(pair.pairAddress.length - 4)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    ${pair.liquidity.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    ${pair.volume24h.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    <span className={pair.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {pair.priceChange24h >= 0 ? '+' : ''}{pair.priceChange24h.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};