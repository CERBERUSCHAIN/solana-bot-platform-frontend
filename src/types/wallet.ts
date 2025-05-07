// CERBERUS Bot - Wallet Type Definitions
// Created: 2025-05-06 22:19:42 UTC
// Author: CERBERUSCHAINLet's do it. Continue with implementing the Wallet/Portfolio Integration.

/**
 * Enum for wallet provider types
 */
export enum WalletProvider {
  METAMASK = 'metamask',
  COINBASE = 'coinbase',
  WALLET_CONNECT = 'wallet_connect',
  BINANCE_CHAIN = 'binance_chain',
  PHANTOM = 'phantom',
  KEPLR = 'keplr',
  SOLFLARE = 'solflare',
  LEDGER = 'ledger',
  TREZOR = 'trezor',
  CERBERUS_CUSTODIAL = 'cerberus_custodial'
}

/**
 * Enum for blockchain networks
 */
export enum BlockchainNetwork {
  ETHEREUM = 'ethereum',
  BINANCE_SMART_CHAIN = 'binance_smart_chain',
  POLYGON = 'polygon',
  SOLANA = 'solana',
  AVALANCHE = 'avalanche',
  COSMOS = 'cosmos',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism'
}

/**
 * Interface for wallet connection
 */
export interface WalletConnection {
  id: string;
  userId: string;
  provider: WalletProvider;
  address: string;
  name: string;
  network: BlockchainNetwork;
  isActive: boolean;
  permissions: {
    canView: boolean;
    canTrade: boolean;
    tradeLimit?: number;
    limitPeriod?: 'day' | 'week' | 'month';
    approvedContracts?: string[];
  };
  createdAt: string;
  lastUsed?: string;
}

/**
 * Interface for a token balance in a wallet
 */
export interface TokenBalance {
  tokenAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceUsd: number;
  price: number;
  priceChangePercentage24h: number;
  logoUrl?: string;
}

/**
 * Interface for portfolio totals
 */
export interface PortfolioTotals {
  totalBalanceUsd: number;
  totalBalanceBtc: number;
  totalProfitLossUsd: number;
  totalProfitLossPercentage: number;
  change24h: number;
  change24hPercentage: number;
  change7d: number;
  change7dPercentage: number;
  change30d: number;
  change30dPercentage: number;
  assetAllocation: {
    name: string;
    value: number;
    percentage: number;
    color: string;
  }[];
  historicalBalance: {
    date: string;
    value: number;
  }[];
}

/**
 * Interface for a portfolio transaction
 */
export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer_in' | 'transfer_out' | 'swap' | 'stake' | 'unstake' | 'claim' | 'fee';
  status: 'pending' | 'completed' | 'failed';
  hash: string;
  timestamp: string;
  walletAddress: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  amount: string;
  amountUsd: number;
  price: number;
  fee: string;
  feeUsd: number;
  from: string;
  to: string;
  network: BlockchainNetwork;
  botExecuted?: boolean;
  strategyId?: string;
  notes?: string;
}

/**
 * Interface for wallet transaction input
 */
export interface TransactionInput {
  type: 'buy' | 'sell' | 'swap' | 'transfer';
  walletAddress: string;
  tokenAddress: string;
  amount: string;
  to?: string;
  slippageTolerance?: number;
  destinationTokenAddress?: string; // For swaps
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  strategyId?: string;
  botId?: string;
}

/**
 * Interface for wallet balance
 */
export interface WalletBalance {
  walletId: string;
  address: string;
  name: string;
  network: BlockchainNetwork;
  nativeBalance: string;
  nativeBalanceUsd: number;
  tokens: TokenBalance[];
  totalBalanceUsd: number;
}

/**
 * Interface for price alert
 */
export interface PriceAlert {
  id: string;
  userId: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  condition: 'above' | 'below' | 'percentage_increase' | 'percentage_decrease';
  value: number;
  createdAt: string;
  triggered: boolean;
  triggeredAt?: string;
  notificationSent: boolean;
  notificationMethod: 'email' | 'sms' | 'push' | 'all';
  recurrence: 'once' | 'always';
}

/**
 * Interface for wallet approval
 */
export interface TokenApproval {
  id: string;
  walletAddress: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  spenderAddress: string;
  spenderName?: string;
  allowance: string;
  allowanceUsd: number;
  network: BlockchainNetwork;
  approved: string;
  txHash: string;
}