// CERBERUS Bot - Wallet Management Page
// Created: 2025-05-06 02:25:55 UTC
// Author: CERBERUSCHAIN1

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { WalletList } from '../components/Wallet/WalletList';
import { WalletDetails } from '../components/Wallet/WalletDetails';
import { WalletActions } from '../components/Wallet/WalletActions';
import { ImportWalletModal } from '../components/Wallet/ImportWalletModal';
import { CreateWalletModal } from '../components/Wallet/CreateWalletModal';
import { Wallet } from '../types/wallet';

// Mock wallet data
const MOCK_WALLETS: Wallet[] = [
  {
    address: '8KLCdxAFTRLkm1Ac4YMcAyxis7jy2W5Ldhp3GY8iXAyQ',
    name: 'Main Trading Wallet',
    type: 'hot',
    balanceSol: 3.542,
    lastUpdated: new Date().toISOString(),
    encrypted: true,
    tags: ['trading', 'active']
  },
  {
    address: '6HRGqvL6Ad3Yo9FqzGo3Vareo2Kee9HBsYtRBpnCJQP',
    name: 'Volume Bot Wallet',
    type: 'hot',
    balanceSol: 1.25,
    lastUpdated: new Date().toISOString(),
    encrypted: true,
    tags: ['bot', 'volume']
  },
  {
    address: '7VkJUg3D2TtEMQQxoLh3CWQUuzkQ18Ft6B3G8K3coSV',
    name: 'Bump Bot Wallet',
    type: 'hot',
    balanceSol: 0.871,
    lastUpdated: new Date().toISOString(),
    encrypted: true,
    tags: ['bot', 'bump']
  },
  {
    address: '3L9h62vzKdgGZvNHzqPFj5uXdMTiHKyZmSFTv5exhibbF',
    name: 'Cold Storage',
    type: 'cold',
    balanceSol: 12.5,
    lastUpdated: new Date().toISOString(),
    encrypted: true,
    tags: ['storage', 'longterm']
  },
  {
    address: '5r1jmHeXPHHvGqPGQTSXSGRg5VQiGFPciwSPTQrEMEf7',
    name: 'Hardware Wallet',
    type: 'hardware',
    balanceSol: 8.333,
    lastUpdated: new Date().toISOString(),
    encrypted: false,
    tags: ['secure']
  }
];

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>(MOCK_WALLETS);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // In a real app, fetch wallets from your API or wallet service
    // For now, we'll use the mock data
    
    // If there are wallets, select the first one by default
    if (wallets.length > 0 && !selectedWallet) {
      setSelectedWallet(wallets[0]);
    }
  }, [wallets]);
  
  const handleImportWallet = async (privateKey: string, name: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, you would call your wallet service
      // await walletService.importWallet(privateKey, name);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add a new mock wallet
      const newWallet: Wallet = {
        address: `imported${Math.random().toString(36).substring(2, 10)}`,
        name,
        type: 'imported',
        balanceSol: Math.random() * 2,
        lastUpdated: new Date().toISOString(),
        encrypted: true,
        tags: ['imported']
      };
      
      setWallets(prev => [...prev, newWallet]);
      setSelectedWallet(newWallet);
      setIsImportModalOpen(false);
    } catch (error) {
      console.error('Failed to import wallet:', error);
      alert('Failed to import wallet. Please check your private key and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateWallet = async (name: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, you would call your wallet service
      // await walletService.createWallet(name);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add a new mock wallet
      const newWallet: Wallet = {
        address: `created${Math.random().toString(36).substring(2, 10)}`,
        name,
        type: 'hot',
        balanceSol: 0,
        lastUpdated: new Date().toISOString(),
        encrypted: true,
        tags: ['new']
      };
      
      setWallets(prev => [...prev, newWallet]);
      setSelectedWallet(newWallet);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create wallet:', error);
      alert('Failed to create wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteWallet = async (address: string) => {
    if (!confirm('Are you sure you want to delete this wallet? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would call your wallet service
      // await walletService.deleteWallet(address);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove wallet from state
      const updatedWallets = wallets.filter(w => w.address !== address);
      setWallets(updatedWallets);
      
      // If the deleted wallet was selected, select another one
      if (selectedWallet && selectedWallet.address === address) {
        setSelectedWallet(updatedWallets.length > 0 ? updatedWallets[0] : null);
      }
    } catch (error) {
      console.error('Failed to delete wallet:', error);
      alert('Failed to delete wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRenameWallet = async (address: string, newName: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, you would call your wallet service
      // await walletService.renameWallet(address, newName);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update wallet in state
      const updatedWallets = wallets.map(w => {
        if (w.address === address) {
          return { ...w, name: newName };
        }
        return w;
      });
      
      setWallets(updatedWallets);
      
      // Update selected wallet if it was the one renamed
      if (selectedWallet && selectedWallet.address === address) {
        setSelectedWallet({ ...selectedWallet, name: newName });
      }
    } catch (error) {
      console.error('Failed to rename wallet:', error);
      alert('Failed to rename wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balanceSol, 0);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>CERBERUS Bot | Wallet Management</title>
      </Head>
      
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">CERBERUS Bot Platform</h1>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">Welcome, <span className="text-indigo-400">CERBERUSCHAIN1</span></div>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">C</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Wallet Management</h2>
          
          <div className="text-xl font-semibold text-indigo-400">
            {totalBalance.toFixed(3)} SOL
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Your Wallets</h3>
                <div className="text-sm text-gray-400">{wallets.length} wallets</div>
              </div>
              
              <WalletList 
                wallets={wallets} 
                selectedAddress={selectedWallet?.address} 
                onSelectWallet={setSelectedWallet} 
              />
              
              <div className="mt-4 flex gap-2">
                <button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
                  onClick={() => setIsCreateModalOpen(true)}
                  disabled={isLoading}
                >
                  Create Wallet
                </button>
                <button
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
                  onClick={() => setIsImportModalOpen(true)}
                  disabled={isLoading}
                >
                  Import Wallet
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedWallet ? (
              <div className="space-y-6">
                <WalletDetails wallet={selectedWallet} />
                <WalletActions 
                  wallet={selectedWallet}
                  onRename={handleRenameWallet}
                  onDelete={handleDeleteWallet}
                />
              </div>
            ) : (
              <div className="bg-gray-800 p-8 rounded-lg shadow-md text-center">
                <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                <h3 className="text-xl font-medium text-gray-400 mt-4">No Wallet Selected</h3>
                <p className="text-gray-500 mt-2">Select a wallet from the list or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-6 border-t border-gray-800">
        <p className="text-center text-gray-500 text-sm">
          CERBERUS Bot Platform | Created: 2025-05-06 02:25:55 UTC | User: CERBERUSCHAIN1
        </p>
      </footer>
      
      {isImportModalOpen && (
        <ImportWalletModal
          onImport={handleImportWallet}
          onCancel={() => setIsImportModalOpen(false)}
          isLoading={isLoading}
        />
      )}
      
      {isCreateModalOpen && (
        <CreateWalletModal
          onCreate={handleCreateWallet}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}