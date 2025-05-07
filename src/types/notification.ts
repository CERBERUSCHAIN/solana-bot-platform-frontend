// CERBERUS Bot - Notification Type Definitions
// Created: 2025-05-07 00:53:29 UTC
// Author: CERBERUSCHAINThank you, continue with the Notifications System to keep users informed about their bot activities and trading events.

/**
 * Enum for notification types
 */
export enum NotificationType {
    TRADE_EXECUTED = 'trade_executed',
    TRADE_FAILED = 'trade_failed',
    PROFIT_TARGET_REACHED = 'profit_target_reached',
    STOP_LOSS_TRIGGERED = 'stop_loss_triggered',
    PRICE_ALERT = 'price_alert',
    BOT_STATUS_CHANGE = 'bot_status_change',
    STRATEGY_EXECUTION_COMPLETED = 'strategy_execution_completed',
    STRATEGY_EXECUTION_FAILED = 'strategy_execution_failed',
    WALLET_CONNECTED = 'wallet_connected',
    WALLET_DISCONNECTED = 'wallet_disconnected',
    SECURITY_ALERT = 'security_alert',
    SYSTEM_MESSAGE = 'system_message',
    TRANSACTION_CONFIRMED = 'transaction_confirmed',
    FUNDS_DEPOSITED = 'funds_deposited',
    FUNDS_WITHDRAWN = 'funds_withdrawn',
  }
  
  /**
   * Enum for notification delivery channels
   */
  export enum NotificationChannel {
    IN_APP = 'in_app',
    EMAIL = 'email',
    PUSH = 'push',
    SMS = 'sms',
    WEBHOOK = 'webhook',
  }
  
  /**
   * Enum for notification priority
   */
  export enum NotificationPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
  }
  
  /**
   * Interface for notification object
   */
  export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    createdAt: string;
    readAt?: string;
    isRead: boolean;
    priority: NotificationPriority;
    data?: Record<string, any>;
    actions?: NotificationAction[];
    channels: NotificationChannel[];
  }
  
  /**
   * Interface for notification action
   */
  export interface NotificationAction {
    label: string;
    url?: string;
    actionType: 'link' | 'button';
    action?: string;
    data?: Record<string, any>;
  }
  
  /**
   * Interface for notification preferences
   */
  export interface NotificationPreferences {
    userId: string;
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
    webhookEnabled: boolean;
    emailAddress?: string;
    phoneNumber?: string;
    webhookUrl?: string;
    channels: {
      [key in NotificationType]?: {
        enabled: boolean;
        channels: NotificationChannel[];
      };
    };
  }
  
  /**
   * Interface for notification creation input
   */
  export interface NotificationInput {
    type: NotificationType;
    title: string;
    message: string;
    priority: NotificationPriority;
    data?: Record<string, any>;
    actions?: Omit<NotificationAction, 'id'>[];
    channels?: NotificationChannel[];
  }
  
  /**
   * Interface for notification status summary
   */
  export interface NotificationSummary {
    total: number;
    unread: number;
    priority: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  }
  
  /**
   * Interface for webhook configuration
   */
  export interface WebhookConfig {
    id: string;
    userId: string;
    name: string;
    url: string;
    secret: string;
    events: NotificationType[];
    isActive: boolean;
    createdAt: string;
    lastDeliveryAt?: string;
    failureCount: number;
  }