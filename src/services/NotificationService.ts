// CERBERUS Bot - Notification Service Interface
// Created: 2025-05-07 00:53:29 UTC
// Author: CERBERUSCHAINThank you, continue with the Notifications System to keep users informed about their bot activities and trading events.

import {
    Notification,
    NotificationInput,
    NotificationPreferences,
    NotificationType,
    NotificationChannel,
    NotificationSummary,
    WebhookConfig
  } from '../types/notification';
  
  /**
   * Service for managing notifications
   */
  export interface NotificationService {
    /**
     * Get all notifications for the current user
     */
    getNotifications(options?: {
      unreadOnly?: boolean;
      limit?: number;
      offset?: number;
    }): Promise<{
      notifications: Notification[];
      total: number;
    }>;
    
    /**
     * Get a single notification by ID
     */
    getNotification(notificationId: string): Promise<Notification>;
    
    /**
     * Mark a notification as read
     */
    markAsRead(notificationId: string): Promise<Notification>;
    
    /**
     * Mark all notifications as read
     */
    markAllAsRead(): Promise<boolean>;
    
    /**
     * Delete a notification
     */
    deleteNotification(notificationId: string): Promise<boolean>;
    
    /**
     * Delete all user notifications
     */
    deleteAllNotifications(): Promise<boolean>;
    
    /**
     * Register for push notifications (browser-based)
     */
    registerForPushNotifications(): Promise<boolean>;
    
    /**
     * Unregister from push notifications
     */
    unregisterFromPushNotifications(): Promise<boolean>;
    
    /**
     * Get user notification preferences
     */
    getNotificationPreferences(): Promise<NotificationPreferences>;
    
    /**
     * Update user notification preferences
     */
    updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences>;
    
    /**
     * Create a new notification (for testing or manual notifications)
     */
    createNotification(notification: NotificationInput): Promise<Notification>;
    
    /**
     * Get notification summary (counts)
     */
    getNotificationSummary(): Promise<NotificationSummary>;
    
    /**
     * Get webhook configurations
     */
    getWebhookConfigs(): Promise<WebhookConfig[]>;
    
    /**
     * Create a webhook configuration
     */
    createWebhookConfig(config: Omit<WebhookConfig, 'id' | 'userId' | 'createdAt' | 'failureCount'>): Promise<WebhookConfig>;
    
    /**
     * Update a webhook configuration
     */
    updateWebhookConfig(id: string, config: Partial<WebhookConfig>): Promise<WebhookConfig>;
    
    /**
     * Delete a webhook configuration
     */
    deleteWebhookConfig(id: string): Promise<boolean>;
    
    /**
     * Test a webhook configuration
     */
    testWebhook(id: string): Promise<{
      success: boolean;
      message?: string;
      statusCode?: number;
    }>;
  }