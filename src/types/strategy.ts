// CERBERUS Bot - Strategy Type Definitions
// Created: 2025-05-06 21:17:49 UTC
// Author: CERBERUSCHAINYes please and thank you.

/**
 * Enum for strategy element types
 */
export enum StrategyElementType {
    // Triggers
    PRICE_MOVEMENT = 'price_movement',
    TIME_TRIGGER = 'time_trigger',
    INDICATOR_CROSS = 'indicator_cross',
    VOLUME_SPIKE = 'volume_spike',
    PRICE_THRESHOLD = 'price_threshold',
    
    // Conditions
    HIGHER_THAN = 'higher_than',
    LOWER_THAN = 'lower_than',
    BETWEEN = 'between',
    OUTSIDE = 'outside',
    EQUALS = 'equals',
    
    // Indicators
    MOVING_AVERAGE = 'moving_average',
    RSI = 'rsi',
    MACD = 'macd',
    BOLLINGER_BANDS = 'bollinger_bands',
    STOCHASTIC = 'stochastic',
    
    // Actions
    BUY = 'buy',
    SELL = 'sell',
    ALERT = 'alert',
    SWAP = 'swap',
    LIMIT_ORDER = 'limit_order',
    STOP_LOSS = 'stop_loss',
    TAKE_PROFIT = 'take_profit',
    
    // Logic
    AND = 'and',
    OR = 'or',
    NOT = 'not',
    IF_THEN = 'if_then',
    IF_THEN_ELSE = 'if_then_else'
  }
  
  /**
   * Base interface for strategy elements
   */
  export interface StrategyElement {
    id: string;
    type: StrategyElementType;
    name: string;
    description?: string;
    parentId?: string | null;
  }
  
  /**
   * Time interval options for strategies
   */
  export enum TimeInterval {
    MINUTE_1 = '1m',
    MINUTE_5 = '5m',
    MINUTE_15 = '15m',
    MINUTE_30 = '30m',
    HOUR_1 = '1h',
    HOUR_4 = '4h',
    DAY_1 = '1d',
    WEEK_1 = '1w'
  }
  
  /**
   * Interface for indicator elements
   */
  export interface IndicatorElement extends StrategyElement {
    type: StrategyElementType.MOVING_AVERAGE |
          StrategyElementType.RSI |
          StrategyElementType.MACD |
          StrategyElementType.BOLLINGER_BANDS |
          StrategyElementType.STOCHASTIC;
    parameters: Record<string, any>;
    interval: TimeInterval;
    output?: {
      value: number;
      timestamp: string;
    };
  }
  
  /**
   * Interface for condition elements
   */
  export interface ConditionElement extends StrategyElement {
    type: StrategyElementType.HIGHER_THAN |
          StrategyElementType.LOWER_THAN |
          StrategyElementType.BETWEEN |
          StrategyElementType.OUTSIDE |
          StrategyElementType.EQUALS;
    leftOperandId: string;
    rightOperandId: string;
    secondaryOperandId?: string;  // For BETWEEN and OUTSIDE conditions
    output?: boolean;
  }
  
  /**
   * Interface for trigger elements
   */
  export interface TriggerElement extends StrategyElement {
    type: StrategyElementType.PRICE_MOVEMENT |
          StrategyElementType.TIME_TRIGGER |
          StrategyElementType.INDICATOR_CROSS |
          StrategyElementType.VOLUME_SPIKE |
          StrategyElementType.PRICE_THRESHOLD;
    parameters: Record<string, any>;
    output?: boolean;
  }
  
  /**
   * Interface for action elements
   */
  export interface ActionElement extends StrategyElement {
    type: StrategyElementType.BUY |
          StrategyElementType.SELL |
          StrategyElementType.ALERT |
          StrategyElementType.SWAP |
          StrategyElementType.LIMIT_ORDER |
          StrategyElementType.STOP_LOSS |
          StrategyElementType.TAKE_PROFIT;
    parameters: Record<string, any>;
    executed?: boolean;
    result?: any;
  }
  
  /**
   * Interface for logic elements
   */
  export interface LogicElement extends StrategyElement {
    type: StrategyElementType.AND |
          StrategyElementType.OR |
          StrategyElementType.NOT |
          StrategyElementType.IF_THEN |
          StrategyElementType.IF_THEN_ELSE;
    childIds: string[];
    output?: boolean;
  }
  
  /**
   * Union type for all strategy element types
   */
  export type StrategyElementUnion = 
    | IndicatorElement
    | ConditionElement
    | TriggerElement
    | ActionElement
    | LogicElement;
  
  /**
   * Interface for a strategy
   */
  export interface Strategy {
    id: string;
    userId: string;
    name: string;
    description?: string;
    elements: Record<string, StrategyElementUnion>;
    rootElementId: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    version: number;
    public: boolean;
    tags?: string[];
    forkFrom?: string;
    performance?: StrategyPerformance;
  }
  
  /**
   * Interface for strategy performance metrics
   */
  export interface StrategyPerformance {
    backtestResults?: {
      totalProfit: number;
      profitPercentage: number;
      winRate: number;
      totalTrades: number;
      successfulTrades: number;
      failedTrades: number;
      averageProfitPerTrade: number;
      maxDrawdown: number;
      sharpeRatio: number;
      duration: number; // In milliseconds
      timeframe: string;
    };
    liveResults?: {
      startDate: string;
      profit: number;
      profitPercentage: number;
      totalTrades: number;
      successfulTrades: number;
      failedTrades: number;
    };
  }
  
  /**
   * Interface for strategy template
   */
  export interface StrategyTemplate {
    id: string;
    name: string;
    description: string;
    strategySnapshot: Omit<Strategy, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isActive'>;
    category: string;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    popularity: number;
    authorId: string;
    authorName: string;
    createdAt: string;
    tags?: string[];
  }
  
  /**
   * Interface for backtesting configuration
   */
  export interface BacktestConfig {
    strategyId: string;
    startDate: string;
    endDate: string;
    initialCapital: number;
    tokenAddress: string;
    timeInterval: TimeInterval;
    fees: {
      maker: number;
      taker: number;
      slippage: number;
    };
    maxTradesPerDay?: number;
    stopLoss?: number; // Percentage
    takeProfit?: number; // Percentage
  }
  
  /**
   * Enum for strategy execution status
   */
  export enum StrategyExecutionStatus {
    IDLE = 'idle',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed',
    PAUSED = 'paused'
  }
  
  /**
   * Interface for strategy execution details
   */
  export interface StrategyExecution {
    id: string;
    strategyId: string;
    botId?: string;
    startTime: string;
    endTime?: string;
    status: StrategyExecutionStatus;
    transactions: Array<{
      id: string;
      type: 'buy' | 'sell' | 'swap' | 'limit' | 'stop';
      amount: number;
      price: number;
      timestamp: string;
      successful: boolean;
      hash?: string;
      error?: string;
    }>;
    currentState: Record<string, any>;
    logs: Array<{
      level: 'info' | 'warning' | 'error';
      message: string;
      timestamp: string;
      data?: any;
    }>;
  }