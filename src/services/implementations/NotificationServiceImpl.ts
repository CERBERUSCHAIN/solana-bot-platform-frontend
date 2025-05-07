// CERBERUS Bot - Notification Service Implementation
// Created: 2025-05-07 00:53:29 UTC
// Author: CERBERUSCHAINThank you, continue with the Notifications System to keep users informed about their bot activities and trading events.

import { NotificationService } from '../NotificationService';
import {
  Notification,
  NotificationInput,
  NotificationPreferences,
  NotificationType,
  NotificationChannel,
  NotificationSummary,
  WebhookConfig
} from '../../types/notification';
import axios from 'axios';

export class NotificationServiceImpl implements NotificationService {
  /**
   * Get headers with authentication
   */
  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem('cerberus_access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
  
  /**
   * Get all notifications for the current user
   */
  async getNotifications(options: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{
    notifications: Notification[];
    total: number;
  }> {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (options.unreadOnly) {
        params.append('unreadOnly', 'true');
      }
      
      if (options.limit) {
        params.append('limit', options.limit.toString());
      }
      
      if (options.offset) {
        params.append('offset', options.offset.toString());
      }
      
      const response = await axios.get(
        `/api/notifications?${params.toString()}`,
        { headers: this.getHeaders() }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }
  
  /**
   * Get a single notification by ID
   */
  async getNotification(notificationId: string): Promise<Notification> {
    try {
      const response = await axios.get(
        `/api/notifications/${notificationId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error getting notification ${notificationId}:`, error);
      throw error;
    }
  }
  
  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await axios.put(
        `/api/notifications/${notificationId}/read`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  }
  
  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      const response = await axios.put(
        '/api/notifications/read-all',
        {},
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
  
  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await axios.delete(
        `/api/notifications/${notificationId}`,
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete all user notifications
   */
  async deleteAllNotifications(): Promise<boolean> {
    try {
      const response = await axios.delete(
        '/api/notifications',
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }
  
  /**
   * Register for push notifications (browser-based)
   */
  async registerForPushNotifications(): Promise<boolean> {
    try {
      // Check if the browser supports push notifications
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications are not supported by this browser');
      }
      
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        throw new Error('Push notification permission not granted');
      }
      
      // Register service worker
      const registration = await navigator.serviceWorker.register('/cerberus-notification-worker.js');
      
      // Get push subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: await this.getPublicVapidKey()
      });
      
      // Send subscription to server
      const response = await axios.post(
        '/api/notifications/push-subscription',
        subscription,
        { headers: this.getHeaders() }
      );
      
      return response.data.success;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      throw error;
    }
  }
  
  /**
   * Get public VAPID key for push notifications
   */
  private async getPublicVapidKey(): Promise<Uint8Array> {
    try {
      const response = await axios.get(
        '/api/notifications/vapid-public-key',
        { headers: this.getHeaders() }
      );
      
      // Convert base64 string to Uint8Array
      const publicKey = response.data.publicKey;
      return this.urlBase64ToUint8Array(publicKey);
    } catch (error) {
      console.error('Error getting public VAPID key:', error);
      throw error;
    }
  }
  
  /**
   * Helper to convert base64 string to Uint8Array for push API
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }
  
  /**
   * Unregister from push notifications
   */
  async unregisterFromPushNotifications(): Promise<boolean> {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service workers are not supported by this browser');
      }
      
      // Get registration
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (!registration) {
        return true; // Nothing to unregister
      }
      
      // Get subscription
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Unsubscribe locally
        await subscription.unsubscribe();
        
        // Notify server
        const response = await axios.delete(
          '/api/notifications/push-subscription',
          {
            headers: this.getHeaders(),
            data: { endpoint: subscription.endpoint }
          }
        );
        
        return response.data.success;
      }
      
      return true;
    } catch (error) {
      console.error('Error unregistering from push notifications:', error);
      throw error;
    }
  }
  
  /**
   * Get user notification preferences
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await axios.get(
        '/api/notifications/preferences',
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      throw error;
    }
  }
  
  /**
   * Update user notification preferences
   */
  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const response = await axios.put(
        '/api/notifications/preferences',
        preferences,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }
  
  /**
   * Create a new notification (for testing or manual notifications)
   */
  async createNotification(notification: NotificationInput): Promise<Notification> {
    try {
      const response = await axios.post(
        '/api/notifications',
        notification,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
  
  /**
   * Get notification summary (counts)
   */
  async getNotificationSummary(): Promise<NotificationSummary> {
    try {
      const response = await axios.get(
        '/api/notifications/summary',
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting notification summary:', error);
      throw error;
    }
  }
  
  /**
   * Get webhook configurations
   */
  async getWebhookConfigs(): Promise<WebhookConfig[]> {
    try {
      const response = await axios.get(
        '/api/notifications/webhooks',
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting webhook configs:', error);
      throw error;
    }
  }
  
  /**
   * Create a webhook configuration
   */
  async createWebhookConfig(config: Omit<WebhookConfig, 'id' | 'userId' | 'createdAt' | 'failureCount'>): Promise<WebhookConfig> {
    try {
      const response = await axios.post(
        '/api/notifications/webhooks',
        config,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating webhook config:', error);
      throw error;
    }
  }
  
  /**
   * Update a webhook configuration
   */
  async updateWebhookConfig(id: string, config: Partial<WebhookConfig>): Promise<WebhookConfig> {
    try {
      const response = await axios.put(
        `/api/notifications/webhooks/${id}`,
        config,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating webhook config ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a webhook configuration
   */
  async deleteWebhookConfig(id: string): Promise<boolean> {
    try {
      const response = await axios.delete(
        `/api/notifications/webhooks/${id}`,
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error(`Error deleting webhook config ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Test a webhook configuration
   */
  async testWebhook(id: string): Promise<{
    success: boolean;
    message?: string;
    statusCode?: number;
  }> {
    try {
      const response = await axios.post(
        `/api/notifications/webhooks/${id}/test`,
        {},
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error testing webhook ${id}:`, error);
      throw error;
    }
  }
}