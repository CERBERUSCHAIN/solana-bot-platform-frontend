// CERBERUS Bot - Wallet Service Interface
// Created: 2025-05-06 22:19:42 UTC
// Author: CERBERUSCHAINLet's do it. Continue with implementing the Wallet/Portfolio Integration.

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

/**
 * Service for wallet and portfolio management
 */
export interface WalletService {
  /**
   * Connect a new wallet
   */
  connectWallet(provider: WalletProvider, network: BlockchainNetwork): Promise<WalletConnection>;
  
  /**
   * Get all wallet connections for the current user
   */
  getWalletConnections(): Promise<WalletConnection[]>;
  
  /**
   * Get a specific wallet connection by ID
   */
  getWalletConnection(walletId: string): Promise<WalletConnection>;
  
  /**
   * Update wallet connection details
   */
  updateWalletConnection(walletId: string, updates: Partial<WalletConnection>): Promise<WalletConnection>;
  
  /**
   * Remove a wallet connection
   */
  removeWalletConnection(walletId: string): Promise<boolean>;
  
  /**
   * Get wallet balances by wallet ID
   */
  getWalletBalance(walletId: string): Promise<WalletBalance>;
  
  /**
   * Get balances for all connected wallets
   */
  getAllWalletBalances(): Promise<WalletBalance[]>;
  
  /**
   * Get portfolio total value and performance metrics
   */
  getPortfolioTotals(timeframe?: 'day' | 'week' | 'month' | 'year' | 'all'): Promise<PortfolioTotals>;
  
  /**
   * Get transaction history
   */
  getTransactionHistory(
    walletId?: string,
    filter?: {
      type?: Transaction['type'] | Transaction['type'][];
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ transactions: Transaction[]; total: number }>;
  
  /**
   * Execute a transaction
   */
  executeTransaction(input: TransactionInput): Promise<Transaction>;
  
  /**
   * Get token approvals for a wallet
   */
  getTokenApprovals(walletId: string): Promise<TokenApproval[]>;
  
  /**
   * Revoke a token approval
   */
  revokeTokenApproval(approvalId: string): Promise<boolean>;
  
  /**
   * Create a price alert
   */
  createPriceAlert(alert: Omit<PriceAlert, 'id' | 'userId' | 'createdAt' | 'triggered' | 'triggeredAt' | 'notificationSent'>): Promise<PriceAlert>;
  
  /**
   * Get all price alerts
   */
  getPriceAlerts(): Promise<PriceAlert[]>;
  
  /**
   * Delete a price alert
   */
  deletePriceAlert(alertId: string): Promise<boolean>;
  
  /**
   * Get gas price estimates for a specific network
   */
  getGasPrice(network: BlockchainNetwork): Promise<{
    slow: { price: string; estimatedSeconds: number };
    average: { price: string; estimatedSeconds: number };
    fast: { price: string; estimatedSeconds: number };
  }>;
  
  /**
   * Get supported networks and providers
   */
  getSupportedNetworksAndProviders(): Promise<{
    networks: BlockchainNetwork[];
    providers: { network: BlockchainNetwork; providers: WalletProvider[] }[];
  }>;
}