// CERBERUS Bot - Wallet Context
// Created: 2025-05-06 22:19:42 UTC
// Author: CERBERUSCHAINLet's do it. Continue with implementing the Wallet/Portfolio Integration.

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  WalletConnection, 
  WalletBalance, 
  PortfolioTotals,
  Transaction,
  TransactionInput,
  TokenApproval,
  PriceAlert,
  WalletProvider,
  BlockchainNetwork
} from '../types/wallet';
import { WalletService } from '../services/WalletService';
import { WalletServiceImpl } from '../services/implementations/WalletServiceImpl';
import { useAuth } from './AuthContext';

interface WalletContextType {
  // State
  walletConnections: WalletConnection[];
  walletBalances: WalletBalance[];
  portfolioTotals: PortfolioTotals | null;
  transactions: Transaction[];
  totalTransactions: number;
  priceAlerts: PriceAlert[];
  isLoading: boolean;
  error: string | null;
  
  // Methods
  connectWallet: (provider: WalletProvider, network: BlockchainNetwork) => Promise<WalletConnection>;
  disconnectWallet: (walletId: string) => Promise<boolean>;
  loadWalletConnections: () => Promise<WalletConnection[]>;
  updateWalletConnection: (walletId: string, updates: Partial<WalletConnection>) => Promise<WalletConnection>;
  loadWalletBalances: () => Promise<WalletBalance[]>;
  getWalletBalance: (walletId: string) => Promise<WalletBalance>;
  loadPortfolioTotals: (timeframe?: 'day' | 'week' | 'month' | 'year' | 'all') => Promise<PortfolioTotals>;
  loadTransactions: (walletId?: string, filter?: {
    type?: Transaction['type'] | Transaction['type'][];
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) => Promise<{ transactions: Transaction[]; total: number }>;
  executeTransaction: (input: TransactionInput) => Promise<Transaction>;
  getTokenApprovals: (walletId: string) => Promise<TokenApproval[]>;
  revokeTokenApproval: (approvalId: string) => Promise<boolean>;
  createPriceAlert: (alert: Omit<PriceAlert, 'id' | 'userId' | 'createdAt' | 'triggered' | 'triggeredAt' | 'notificationSent'>) => Promise<PriceAlert>;
  loadPriceAlerts: () => Promise<PriceAlert[]>;
  deletePriceAlert: (alertId: string) => Promise<boolean>;
  getSupportedNetworks: () => Promise<{
    networks: BlockchainNetwork[];
    providers: { network: BlockchainNetwork; providers: WalletProvider[] }[];
  }>;
  getGasEstimate: (network: BlockchainNetwork) => Promise<{
    slow: { price: string; estimatedSeconds: number };
    average: { price: string; estimatedSeconds: number };
    fast: { price: string; estimatedSeconds: number };
  }>;
  
  // Active wallet
  activeWallet: WalletConnection | null;
  setActiveWallet: (wallet: WalletConnection | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [service, setService] = useState<WalletService | null>(null);
  
  const [walletConnections, setWalletConnections] = useState<WalletConnection[]>([]);
  const [walletBalances, setWalletBalances] = useState<WalletBalance[]>([]);
  const [portfolioTotals, setPortfolioTotals] = useState<PortfolioTotals | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeWallet, setActiveWallet] = useState<WalletConnection | null>(null);
  
  // Initialize service when user is authenticated
  useEffect(() => {
    if (user) {
      const walletService = new WalletServiceImpl();
      setService(walletService);
    }
  }, [user]);
  
  // Load wallet connections on mount
  useEffect(() => {
    if (service) {
      loadWalletConnections();
    }
  }, [service]);
  
  // Set active wallet when connections change
  useEffect(() => {
    if (walletConnections.length > 0 && !activeWallet) {
      // Find the most recently used active wallet
      const active = walletConnections
        .filter(w => w.isActive)
        .sort((a, b) => {
          if (!a.lastUsed) return 1;
          if (!b.lastUsed) return -1;
          return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
        })[0];
      
      if (active) {
        setActiveWallet(active);
      }
    } else if (walletConnections.length === 0) {
      setActiveWallet(null);
    }
  }, [walletConnections]);
  
  /**
   * Load wallet connections
   */
  const loadWalletConnections = async (): Promise<WalletConnection[]> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const connections = await service.getWalletConnections();
      setWalletConnections(connections);
      return connections;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load wallet connections';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Connect wallet
   */
  const connectWallet = async (provider: WalletProvider, network: BlockchainNetwork): Promise<WalletConnection> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const connection = await service.connectWallet(provider, network);
      setWalletConnections(prev => [...prev, connection]);
      return connection;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to connect wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Disconnect wallet
   */
  const disconnectWallet = async (walletId: string): Promise<boolean> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.removeWalletConnection(walletId);
      
      if (success) {
        setWalletConnections(prev => prev.filter(w => w.id !== walletId));
        
        // If the active wallet is disconnected, set a new one
        if (activeWallet && activeWallet.id === walletId) {
          setActiveWallet(null);
        }
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to disconnect wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update wallet connection
   */
  const updateWalletConnection = async (walletId: string, updates: Partial<WalletConnection>): Promise<WalletConnection> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = await service.updateWalletConnection(walletId, updates);
      
      setWalletConnections(prev => 
        prev.map(conn => conn.id === walletId ? updated : conn)
      );
      
      // Update active wallet if it's the one being changed
      if (activeWallet && activeWallet.id === walletId) {
        setActiveWallet(updated);
      }
      
      return updated;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update wallet connection';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load wallet balances
   */
  const loadWalletBalances = async (): Promise<WalletBalance[]> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const balances = await service.getAllWalletBalances();
      setWalletBalances(balances);
      return balances;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load wallet balances';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get single wallet balance
   */
  const getWalletBalance = async (walletId: string): Promise<WalletBalance> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const balance = await service.getWalletBalance(walletId);
      
      // Update the wallet balance in the state
      setWalletBalances(prev => {
        const index = prev.findIndex(b => b.walletId === walletId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = balance;
          return updated;
        }
        return [...prev, balance];
      });
      
      return balance;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to load balance for wallet ${walletId}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load portfolio totals
   */
  const loadPortfolioTotals = async (timeframe: 'day' | 'week' | 'month' | 'year' | 'all' = 'month'): Promise<PortfolioTotals> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const totals = await service.getPortfolioTotals(timeframe);
      setPortfolioTotals(totals);
      return totals;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load portfolio totals';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load transactions
   */
  const loadTransactions = async (
    walletId?: string, 
    filter: {
      type?: Transaction['type'] | Transaction['type'][];
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ transactions: Transaction[]; total: number }> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await service.getTransactionHistory(walletId, filter);
      setTransactions(result.transactions);
      setTotalTransactions(result.total);
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load transactions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Execute transaction
   */
  const executeTransaction = async (input: TransactionInput): Promise<Transaction> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const transaction = await service.executeTransaction(input);
      
      // Add new transaction to list if it's for the currently viewed wallet
      if (!input.walletAddress || transactions.some(t => t.walletAddress === input.walletAddress)) {
        setTransactions(prev => [transaction, ...prev]);
      }
      
      return transaction;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to execute transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get token approvals
   */
  const getTokenApprovals = async (walletId: string): Promise<TokenApproval[]> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getTokenApprovals(walletId);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to get token approvals';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Revoke token approval
   */
  const revokeTokenApproval = async (approvalId: string): Promise<boolean> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.revokeTokenApproval(approvalId);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to revoke token approval';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create price alert
   */
  const createPriceAlert = async (alert: Omit<PriceAlert, 'id' | 'userId' | 'createdAt' | 'triggered' | 'triggeredAt' | 'notificationSent'>): Promise<PriceAlert> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newAlert = await service.createPriceAlert(alert);
      setPriceAlerts(prev => [...prev, newAlert]);
      return newAlert;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create price alert';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Load price alerts
   */
  const loadPriceAlerts = async (): Promise<PriceAlert[]> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const alerts = await service.getPriceAlerts();
      setPriceAlerts(alerts);
      return alerts;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load price alerts';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete price alert
   */
  const deletePriceAlert = async (alertId: string): Promise<boolean> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.deletePriceAlert(alertId);
      
      if (success) {
        setPriceAlerts(prev => prev.filter(alert => alert.id !== alertId));
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete price alert';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get supported networks
   */
  const getSupportedNetworks = async (): Promise<{
    networks: BlockchainNetwork[];
    providers: { network: BlockchainNetwork; providers: WalletProvider[] }[];
  }> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getSupportedNetworksAndProviders();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to get supported networks';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Get gas estimate
   */
  const getGasEstimate = async (network: BlockchainNetwork): Promise<{
    slow: { price: string; estimatedSeconds: number };
    average: { price: string; estimatedSeconds: number };
    fast: { price: string; estimatedSeconds: number };
  }> => {
    if (!service) throw new Error('Wallet service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.getGasPrice(network);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to get gas estimate';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const contextValue: WalletContextType = {
    // State
    walletConnections,
    walletBalances,
    portfolioTotals,
    transactions,
    totalTransactions,
    priceAlerts,
    isLoading,
    error,
    activeWallet,
    setActiveWallet,
    
    // Methods
    connectWallet,
    disconnectWallet,
    loadWalletConnections,
    updateWalletConnection,
    loadWalletBalances,
    getWalletBalance,
    loadPortfolioTotals,
    loadTransactions,
    executeTransaction,
    getTokenApprovals,
    revokeTokenApproval,
    createPriceAlert,
    loadPriceAlerts,
    deletePriceAlert,
    getSupportedNetworks,
    getGasEstimate
  };
  
  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  
  return context;
};