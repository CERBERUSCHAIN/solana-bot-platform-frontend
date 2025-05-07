// CERBERUS Bot - Bot Execution Engine Type Definitions
// Created: 2025-05-06 23:42:15 UTC
// Author: CERBERUSCHAINYes

import { Strategy, StrategyElementType } from './strategy';
import { BlockchainNetwork } from './wallet';

/**
 * Enum for bot execution status
 */
export enum BotExecutionStatus {
  IDLE = 'idle',
  STARTING = 'starting',
  RUNNING = 'running',
  PAUSED = 'paused',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
  COMPLETED = 'completed',
  ERROR = 'error'
}

/**
 * Enum for execution mode
 */
export enum ExecutionMode {
  REAL = 'real',            // Execute real trades with actual funds
  PAPER = 'paper',          // Simulated trading with virtual funds
  BACKTEST = 'backtest',    // Historical simulation
  SANDBOX = 'sandbox'       // Testing mode with no execution
}

/**
 * Enum for execution frequency
 */
export enum ExecutionFrequency {
  CONTINUOUS = 'continuous',    // Continuously monitor and execute
  INTERVAL = 'interval',        // Execute at fixed intervals
  SCHEDULED = 'scheduled',      // Execute at specific times
  TRIGGERED = 'triggered',      // Execute on specific triggers
  MANUAL = 'manual'             // Execute only on manual trigger
}

/**
 * Enum for log level
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Interface for bot execution session
 */
export interface BotExecutionSession {
  id: string;
  botId: string;
  strategyId: string;
  userId: string;
  status: BotExecutionStatus;
  mode: ExecutionMode;
  frequency: ExecutionFrequency;
  walletId?: string;                         // Connected wallet for trading
  createdAt: string;
  startedAt?: string;
  lastActiveAt?: string;
  stoppedAt?: string;
  nextExecutionAt?: string;                 // For scheduled/interval execution
  interval?: number;                        // In milliseconds, for interval mode
  executionCount: number;                   // Number of executions performed
  successfulExecutions: number;
  failedExecutions: number;
  totalProfit: number;                      // Total profit in USD
  totalProfitPercentage: number;            // Total profit as percentage
  currentState: Record<string, any>;        // Current execution state
  config: BotExecutionConfig;               // Execution configuration
  metrics: BotPerformanceMetrics;           // Performance metrics
}

/**
 * Interface for bot execution configuration
 */
export interface BotExecutionConfig {
  maxConcurrentTrades: number;               // Maximum number of concurrent trades
  maxDailyTrades: number;                    // Maximum number of trades per day
  maxExposurePercentage: number;             // Maximum portfolio exposure percentage
  stopLossPercentage?: number;               // Global stop loss percentage
  takeProfitPercentage?: number;             // Global take profit percentage
  trailingStopLoss?: boolean;                // Whether to use trailing stop loss
  trailingStopLossOffset?: number;           // Trailing stop loss offset percentage
  slippageTolerance: number;                 // Maximum slippage tolerance percentage
  gasSettings: {
    useDefaultGas: boolean;                  // Whether to use default gas settings
    gasMultiplier: number;                   // Multiplier for gas price (1.0 = default)
    maxGasPrice?: string;                    // Maximum gas price willing to pay
  };
  retrySettings: {
    maxRetries: number;                      // Maximum number of retries for failed operations
    retryDelayMs: number;                    // Delay between retries in milliseconds
  };
  timeoutSettings: {
    executionTimeoutMs: number;              // Maximum execution time for a strategy
    transactionTimeoutMs: number;            // Maximum wait time for a transaction
  };
  notificationSettings: {
    notifyOnTrade: boolean;                  // Whether to notify on trade execution
    notifyOnError: boolean;                  // Whether to notify on errors
    notifyOnProfitTarget: boolean;           // Whether to notify on reaching profit target
    notifyOnStopLoss: boolean;               // Whether to notify on stop loss
  };
  tradingPairs: string[];                    // List of trading pairs to monitor/trade
  network: BlockchainNetwork;                // Blockchain network to execute on
  allowedStrategyElements: StrategyElementType[]; // Allowed strategy element types
}

/**
 * Interface for bot performance metrics
 */
export interface BotPerformanceMetrics {
  winRate: number;                           // Win rate (successful trades / total trades)
  avgProfitPerTrade: number;                 // Average profit per trade
  avgLossPerTrade: number;                   // Average loss per trade
  maxDrawdown: number;                       // Maximum drawdown percentage
  sharpeRatio: number;                       // Sharpe ratio
  profitFactor: number;                      // Profit factor (gross profit / gross loss)
  totalTrades: number;                       // Total number of trades
  successfulTrades: number;                  // Number of successful trades
  failedTrades: number;                      // Number of failed trades
  avgTradeTimeMs: number;                    // Average trade duration in milliseconds
  avgGasCost: number;                        // Average gas cost in native currency
  totalGasCost: number;                      // Total gas cost in native currency
}

/**
 * Interface for an execution log entry
 */
export interface ExecutionLogEntry {
  id: string;
  sessionId: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: Record<string, any>;
  element?: {
    id: string;
    type: StrategyElementType;
    name: string;
  };
  transaction?: {
    hash: string;
    status: 'pending' | 'confirmed' | 'failed';
    networkFee: string;
  };
}

/**
 * Interface for a trade executed by the bot
 */
export interface BotTrade {
  id: string;
  sessionId: string;
  botId: string;
  strategyId: string;
  walletId?: string;
  timestamp: string;
  type: 'buy' | 'sell' | 'swap';
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  tokenAddress: string;
  tokenSymbol: string;
  amount: string;
  price: number;
  priceUsd: number;
  valueUsd: number;
  profitLoss: number;
  profitLossPercentage: number;
  transactionHash?: string;
  gasUsed?: string;
  gasPrice?: string;
  gasCostUsd?: number;
  network: BlockchainNetwork;
  errorMessage?: string;
  notes?: string;
  executionTimeMs: number;
}

/**
 * Interface for a bot element execution result
 */
export interface ElementExecutionResult {
  elementId: string;
  type: StrategyElementType;
  name: string;
  executionTimeMs: number;
  successful: boolean;
  output: any;
  error?: string;
  childResults?: ElementExecutionResult[];
}

/**
 * Interface for bot status summary
 */
export interface BotStatusSummary {
  totalBots: number;
  activeBots: number;
  pausedBots: number;
  errorBots: number;
  totalProfit24h: number;
  totalTrades24h: number;
  successfulTrades24h: number;
  dailyActiveStrategies: number;
}