// CERBERUS Bot - Notification Context
// Created: 2025-05-07 00:53:29 UTC
// Author: CERBERUSCHAINThank you, continue with the Notifications System to keep users informed about their bot activities and trading events.

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Notification, 
  NotificationInput,
  NotificationPreferences,
  NotificationType,
  NotificationChannel,
  NotificationSummary,
  WebhookConfig
} from '../types/notification';
import { NotificationService } from '../services/NotificationService';
import { NotificationServiceImpl } from '../services/implementations/NotificationServiceImpl';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  // State
  notifications: Notification[];
  totalNotifications: number;
  unreadCount: number;
  preferences: NotificationPreferences | null;
  webhooks: WebhookConfig[];
  summary: NotificationSummary | null;
  isLoading: boolean;
  error: string | null;
  
  // Methods
  fetchNotifications: (options?: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  }) => Promise<{
    notifications: Notification[];
    total: number;
  }>;
  markAsRead: (notificationId: string) => Promise<Notification>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
  deleteAllNotifications: () => Promise<boolean>;
  registerForPushNotifications: () => Promise<boolean>;
  unregisterFromPushNotifications: () => Promise<boolean>;
  fetchPreferences: () => Promise<NotificationPreferences>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<NotificationPreferences>;
  createNotification: (notification: NotificationInput) => Promise<Notification>;
  fetchSummary: () => Promise<NotificationSummary>;
  fetchWebhooks: () => Promise<WebhookConfig[]>;
  createWebhook: (config: Omit<WebhookConfig, 'id' | 'userId' | 'createdAt' | 'failureCount'>) => Promise<WebhookConfig>;
  updateWebhook: (id: string, config: Partial<WebhookConfig>) => Promise<WebhookConfig>;
  deleteWebhook: (id: string) => Promise<boolean>;
  testWebhook: (id: string) => Promise<{
    success: boolean;
    message?: string;
    statusCode?: number;
  }>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [service, setService] = useState<NotificationService | null>(null);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize service when user is authenticated
  useEffect(() => {
    if (user) {
      const notificationService = new NotificationServiceImpl();
      setService(notificationService);
    }
  }, [user]);
  
  // Load initial data when service is ready
  useEffect(() => {
    if (service) {
      fetchNotifications();
      fetchSummary();
    }
  }, [service]);
  
  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user || !service) return;
    
    // Create WebSocket connection for real-time notifications
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws/notifications`;
    
    const token = localStorage.getItem('cerberus_access_token');
    const socket = new WebSocket(`${wsUrl}?token=${token}`);
    
    socket.onopen = () => {
      console.log('WebSocket connection established for notifications');
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'notification') {
          // Add new notification to the list
          const newNotification = data.notification as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          
          // Update counts
          setTotalNotifications(prev => prev + 1);
          setUnreadCount(prev => prev + 1);
          
          // Show browser notification if permitted
          if (Notification.permission === 'granted') {
            const browserNotification = new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/logo-icon.png'
            });
            
            // Close the notification after 5 seconds
            setTimeout(() => browserNotification.close(), 5000);
            
            // Handle click
            browserNotification.onclick = () => {
              window.focus();
              // TODO: Navigate to notification detail or related entity
            };
          }
        } else if (data.type === 'notification_read') {
          // Update notification in the list
          const updatedNotification = data.notification as Notification;
          setNotifications(prev => 
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          );
          
          // Update unread count
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        // Update summary if provided
        if (data.summary) {
          setSummary(data.summary);
        }
      } catch (error) {
        console.error('Error processing notification WebSocket message:', error);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (user) {
          // This effect will run again and attempt to reconnect
        }
      }, 5000);
    };
    
    return () => {
      socket.close();
    };
  }, [user, service]);
  
  /**
   * Fetch notifications
   */
  const fetchNotifications = async (options: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  } = {}) => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await service.getNotifications(options);
      setNotifications(result.notifications);
      setTotalNotifications(result.total);
      
      // Count unread notifications
      const unread = result.notifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
      
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch notifications';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Mark notification as read
   */
  const markAsRead = async (notificationId: string) => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedNotification = await service.markAsRead(notificationId);
      
      // Update notification in state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? updatedNotification : n)
      );
      
      // Update unread count
      const wasUnread = notifications.find(n => n.id === notificationId)?.isRead === false;
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      return updatedNotification;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to mark notification as read';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.markAllAsRead();
      
      if (success) {
        // Update all notifications in state
        setNotifications(prev => 
          prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
        );
        
        // Reset unread count
        setUnreadCount(0);
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to mark all notifications as read';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete notification
   */
  const deleteNotification = async (notificationId: string) => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.deleteNotification(notificationId);
      
      if (success) {
        // Remove notification from state
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        // Update counts
        setTotalNotifications(prev => Math.max(0, prev - 1));
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete notification';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete all notifications
   */
  const deleteAllNotifications = async () => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.deleteAllNotifications();
      
      if (success) {
        // Clear notifications state
        setNotifications([]);
        setTotalNotifications(0);
        setUnreadCount(0);
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete all notifications';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Register for push notifications
   */
  const registerForPushNotifications = async () => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.registerForPushNotifications();
      
      // If successful, update preferences
      if (success && preferences) {
        await fetchPreferences();
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to register for push notifications';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Unregister from push notifications
   */
  const unregisterFromPushNotifications = async () => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.unregisterFromPushNotifications();
      
      // If successful, update preferences
      if (success && preferences) {
        await fetchPreferences();
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to unregister from push notifications';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch notification preferences
   */
  const fetchPreferences = async () => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const prefs = await service.getNotificationPreferences();
      setPreferences(prefs);
      return prefs;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch notification preferences';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update notification preferences
   */
  const updatePreferences = async (prefs: Partial<NotificationPreferences>) => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedPrefs = await service.updateNotificationPreferences(prefs);
      setPreferences(updatedPrefs);
      return updatedPrefs;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update notification preferences';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create notification (for testing)
   */
  const createNotification = async (notification: NotificationInput) => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newNotification = await service.createNotification(notification);
      
      // Add to local state
      setNotifications(prev => [newNotification, ...prev]);
      setTotalNotifications(prev => prev + 1);
      setUnreadCount(prev => prev + 1);
      
      return newNotification;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create notification';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch notification summary
   */
  const fetchSummary = async () => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const notificationSummary = await service.getNotificationSummary();
      setSummary(notificationSummary);
      setUnreadCount(notificationSummary.unread);
      return notificationSummary;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch notification summary';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch webhooks
   */
  const fetchWebhooks = async () => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const configs = await service.getWebhookConfigs();
      setWebhooks(configs);
      return configs;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch webhook configurations';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create webhook
   */
  const createWebhook = async (config: Omit<WebhookConfig, 'id' | 'userId' | 'createdAt' | 'failureCount'>) => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newWebhook = await service.createWebhookConfig(config);
      setWebhooks(prev => [...prev, newWebhook]);
      return newWebhook;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create webhook';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update webhook
   */
  const updateWebhook = async (id: string, config: Partial<WebhookConfig>) => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedWebhook = await service.updateWebhookConfig(id, config);
      setWebhooks(prev => prev.map(w => w.id === id ? updatedWebhook : w));
      return updatedWebhook;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update webhook';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Delete webhook
   */
  const deleteWebhook = async (id: string) => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.deleteWebhookConfig(id);
      
      if (success) {
        setWebhooks(prev => prev.filter(w => w.id !== id));
      }
      
      return success;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete webhook';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Test webhook
   */
  const testWebhook = async (id: string) => {
    if (!service) throw new Error('Notification service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.testWebhook(id);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to test webhook';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const contextValue: NotificationContextType = {
    // State
    notifications,
    totalNotifications,
    unreadCount,
    preferences,
    webhooks,
    summary,
    isLoading,
    error,
    
    // Methods
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    registerForPushNotifications,
    unregisterFromPushNotifications,
    fetchPreferences,
    updatePreferences,
    createNotification,
    fetchSummary,
    fetchWebhooks,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    testWebhook
  };
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};