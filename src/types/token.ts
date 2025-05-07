// CERBERUS Bot - Token Type Definitions
// Created: 2025-05-06 04:00:28 UTC
// Author: CERBERUSCHAINNext

export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  marketCap?: number;
  price?: number;
  volume24h?: number;
  priceChange24h?: number;
  priceChange7d?: number;
  logoUrl?: string;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  creationDate?: string;
  verified?: boolean;
  rank?: number;
  tags?: string[];
  isInWatchlist?: boolean;
}

export interface TokenMetrics {
  address: string;
  holders: {
    count: number;
    distribution: Array<{
      range: string;
      percentage: number;
      walletCount: number;
    }>;
    topHolders: Array<{
      address: string;
      balance: string;
      percentage: number;
      tag?: string; // e.g., "Founder", "Treasury", etc.
    }>;
  };
  liquidity: {
    total: number;
    pairs: Array<{
      pairAddress: string;
      token0: string;
      token1: string;
      token0Symbol: string;
      token1Symbol: string;
      reserve0: string;
      reserve1: string;
      liquidityUSD: number;
      exchange: string; // e.g., "Raydium", "Orca", "Jupiter", etc.
    }>;
  };
  trading: {
    volume24h: number;
    transactions24h: number;
    buys24h: number;
    sells24h: number;
    uniqueBuyers24h: number;
    uniqueSellers24h: number;
    averageTradeSize: number;
    largestTrade24h: {
      size: number;
      txHash: string;
      timestamp: number;
      type: 'buy' | 'sell';
    };
  };
  volatility: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  momentum: {
    rsi14: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
    obv: number; // On-Balance Volume
  };
  social: {
    twitterFollowers?: number;
    twitterEngagement24h?: number;
    telegramMembers?: number;
    discordMembers?: number;
    sentimentScore?: number; // -100 to 100
    socialVolume24h?: number;
    topMentions?: Array<{
      platform: string;
      url: string;
      engagement: number;
      sentiment: number;
    }>;
  };
  security: {
    score: number; // 0-100
    issues: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
    }>;
    contractAudited: boolean;
    contractVerified: boolean;
    isMutable: boolean;
    hasProxyFunctionality: boolean;
    renounced: boolean;
  };
}

export enum AlertType {
  PRICE_ABOVE = 'price_above',
  PRICE_BELOW = 'price_below',
  PERCENT_CHANGE = 'percent_change',
  VOLUME_SPIKE = 'volume_spike',
  LIQUIDITY_CHANGE = 'liquidity_change',
  WHALE_MOVEMENT = 'whale_movement',
  NEW_PAIR = 'new_pair',
  SOCIAL_VOLUME = 'social_volume'
}

export interface TokenAlert {
  id: string;
  userId: string;
  tokenAddress: string;
  tokenSymbol: string;
  type: AlertType;
  threshold: number;
  timeframe?: string;
  createdAt: string;
  lastTriggered?: string;
  active: boolean;
  notificationChannels: Array<'email' | 'push' | 'sms' | 'telegram'>;
}

export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  BETWEEN = 'between'
}

export interface TokenFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  secondaryValue?: any; // For BETWEEN operator
}

export interface MarketTrend {
  id: string;
  name: string;
  description: string;
  tokens: string[]; // Token addresses
  strength: number; // 0-100
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timeframe: 'short_term' | 'mid_term' | 'long_term';
  relatedTags: string[];
  startDate: string;
  isPredictive: boolean;
}