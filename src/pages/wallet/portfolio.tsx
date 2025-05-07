// CERBERUS Bot - Portfolio Dashboard Page
// Created: 2025-05-06 23:36:46 UTC
// Author: CERBERUSCHAINPortfolio Dashboard page (portfolio.tsx) is NOT complete

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { useWallet } from '../../contexts/WalletContext';
import { PortfolioSummary } from '../../components/Wallet/PortfolioSummary';
import { WalletList } from '../../components/Wallet/WalletList';
import { AssetTable } from '../../components/Wallet/AssetTable';
import { ConnectWalletModal } from '../../components/Wallet/ConnectWalletModal';
import { TransactionList } from '../../components/Wallet/TransactionList';
import { PortfolioChart } from '../../components/Wallet/PortfolioChart';
import { TokenBalance, WalletBalance } from '../../types/wallet';

export default function PortfolioPage() {
  const { 
    walletConnections, 
    walletBalances, 
    portfolioTotals, 
    activeWallet,
    setActiveWallet,
    loadWalletConnections, 
    loadWalletBalances, 
    loadPortfolioTotals,
    loadTransactions,
    isLoading,
    error
  } = useWallet();
  
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('month');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [assets, setAssets] = useState<TokenBalance[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load wallet connections, balances and totals
        await loadWalletConnections();
        await loadWalletBalances();
        await loadPortfolioTotals(timeframe);
        
        // Load recent transactions
        await loadTransactions(undefined, { limit: 10 });
      } catch (error) {
        console.error('Error loading wallet data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Update portfolio data when timeframe changes
  useEffect(() => {
    loadPortfolioTotals(timeframe);
  }, [timeframe]);
  
  // Consolidate assets from all wallets
  useEffect(() => {
    if (walletBalances.length > 0) {
      const assetsMap = new Map<string, TokenBalance>();
      
      // Collect all tokens from all wallets
      walletBalances.forEach(wallet => {
        wallet.tokens.forEach(token => {
          // If the token already exists, add to its balance
          if (assetsMap.has(token.tokenAddress)) {
            const existing = assetsMap.get(token.tokenAddress)!;
            const newBalanceUsd = existing.balanceUsd + token.balanceUsd;
            
            assetsMap.set(token.tokenAddress, {
              ...existing,
              balance: (parseFloat(existing.balance) + parseFloat(token.balance)).toString(),
              balanceUsd: newBalanceUsd
            });
          } else {
            // Otherwise add it as a new token
            assetsMap.set(token.tokenAddress, { ...token });
          }
        });
      });
      
      // Convert map to array and sort by USD value
      const consolidatedAssets = Array.from(assetsMap.values())
        .sort((a, b) => b.balanceUsd - a.balanceUsd);
      
      setAssets(consolidatedAssets);
    } else {
      setAssets([]);
    }
  }, [walletBalances]);
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>Portfolio | CERBERUS Bot</title>
        </Head>
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
              <p className="text-gray-400">Manage your wallets, assets, and transactions</p>
            </div>
            
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center text-white"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Connect Wallet
            </button>
          </div>
          
          {error && (
            <div className="bg-red-900 bg-opacity-20 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {walletConnections.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-16 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-300">No wallets connected</h3>
              <p className="mt-1 text-gray-500">
                Connect a wallet to start managing your portfolio
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsConnectModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white"
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2">
                {/* Portfolio Summary */}
                {portfolioTotals && (
                  <PortfolioSummary 
                    totals={portfolioTotals} 
                    timeframe={timeframe}
                    onTimeframeChange={setTimeframe}
                    isLoading={isLoading}
                  />
                )}
                
                {/* Portfolio Chart */}
                {portfolioTotals && (
                  <div className="bg-gray-800 rounded-lg p-6 mt-6 shadow">
                    <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
                    <PortfolioChart data={portfolioTotals.historicalBalance} timeframe={timeframe} />
                  </div>
                )}
                
                {/* Assets Table */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Assets</h2>
                    <Link href="/wallet/assets" className="text-sm text-indigo-400 hover:text-indigo-300">
                      View All
                    </Link>
                  </div>
                  
                  <AssetTable assets={assets} isLoading={isLoading} limit={5} />
                </div>
                
                {/* Recent Transactions */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recent Transactions</h2>
                    <Link href="/wallet/transactions" className="text-sm text-indigo-400 hover:text-indigo-300">
                      View All
                    </Link>
                  </div>
                  
                  <TransactionList isLoading={isLoading} limit={5} />
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* Connected Wallets */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Connected Wallets</h2>
                    <button
                      onClick={() => setIsConnectModalOpen(true)}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      Add Wallet
                    </button>
                  </div>
                  
                  <WalletList 
                    wallets={walletConnections}
                    balances={walletBalances}
                    activeWallet={activeWallet}
                    onSelectWallet={setActiveWallet}
                    isLoading={isLoading}
                  />
                </div>
                
                {/* Portfolio Allocation */}
                {portfolioTotals && (
                  <div className="bg-gray-800 rounded-lg p-6 shadow">
                    <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
                    <div className="space-y-3">
                      {portfolioTotals.assetAllocation.map((asset, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{asset.name}</span>
                            <span>{asset.percentage.toFixed(2)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${asset.percentage}%`, 
                                backgroundColor: asset.color 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Quick Actions */}
                <div className="bg-gray-800 rounded-lg p-6 shadow">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      href="/wallet/send"
                      className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-gray-750 hover:bg-gray-700"
                    >
                      <svg className="w-6 h-6 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                      <span className="text-sm">Send</span>
                    </Link>
                    
                    <Link 
                      href="/wallet/receive"
                      className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-gray-750 hover:bg-gray-700"
                    >
                      <svg className="w-6 h-6 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                      <span className="text-sm">Receive</span>
                    </Link>
                    
                    <Link 
                      href="/wallet/swap"
                      className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-gray-750 hover:bg-gray-700"
                    >
                      <svg className="w-6 h-6 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                      </svg>
                      <span className="text-sm">Swap</span>
                    </Link>
                    
                    <Link 
                      href="/wallet/buy"
                      className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-gray-750 hover:bg-gray-700"
                    >
                      <svg className="w-6 h-6 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      <span className="text-sm">Buy Crypto</span>
                    </Link>
                    
                    <Link 
                      href="/wallet/staking"
                      className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-gray-750 hover:bg-gray-700"
                    >
                      <svg className="w-6 h-6 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                      <span className="text-sm">Staking</span>
                    </Link>
                    
                    <Link 
                      href="/wallet/alerts"
                      className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-gray-750 hover:bg-gray-700"
                    >
                      <svg className="w-6 h-6 text-indigo-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                      </svg>
                      <span className="text-sm">Price Alerts</span>
                    </Link>
                  </div>
                </div>
                
                {/* Security Status */}
                <div className="bg-gray-800 rounded-lg p-6 shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Security Status</h2>
                    <Link href="/security" className="text-sm text-indigo-400 hover:text-indigo-300">
                      Settings
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="rounded-full p-1.5 bg-green-900 bg-opacity-20 mr-3">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                          </svg>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Two-Factor Authentication</div>
                          <div className="text-gray-400">Enabled</div>
                        </div>
                      </div>
                      <Link href="/security/2fa" className="text-xs text-indigo-400 hover:text-indigo-300">
                        Manage
                      </Link>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="rounded-full p-1.5 bg-red-900 bg-opacity-20 mr-3">
                          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                          </svg>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Wallet Encryption</div>
                          <div className="text-gray-400">Not configured</div>
                        </div>
                      </div>
                      <Link href="/security/wallet-encryption" className="text-xs text-indigo-400 hover:text-indigo-300">
                        Set Up
                      </Link>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="rounded-full p-1.5 bg-yellow-900 bg-opacity-20 mr-3">
                          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                          </svg>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Transaction Limits</div>
                          <div className="text-gray-400">1.0 ETH per day</div>
                        </div>
                      </div>
                      <Link href="/security/limits" className="text-xs text-indigo-400 hover:text-indigo-300">
                        Adjust
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Network Status */}
                <div className="bg-gray-800 rounded-lg p-6 shadow">
                  <h2 className="text-xl font-semibold mb-4">Network Status</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-400 mr-3"></div>
                        <span className="text-sm">Ethereum</span>
                      </div>
                      <span className="text-xs text-gray-400">22 Gwei</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-400 mr-3"></div>
                        <span className="text-sm">Binance Smart Chain</span>
                      </div>
                      <span className="text-xs text-gray-400">5 Gwei</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-400 mr-3"></div>
                        <span className="text-sm">Polygon</span>
                      </div>
                      <span className="text-xs text-gray-400">48 Gwei</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-400 mr-3"></div>
                        <span className="text-sm">Solana</span>
                      </div>
                      <span className="text-xs text-gray-400">0.00025 SOL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Connect Wallet Modal */}
          {isConnectModalOpen && (
            <ConnectWalletModal onClose={() => setIsConnectModalOpen(false)} />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}