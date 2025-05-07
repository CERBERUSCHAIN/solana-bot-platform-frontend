// CERBERUS Bot - Notification Center Component
// Created: 2025-05-07 05:09:07 UTC
// Author: CERBERUSCHAIN

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type NotificationType = 'BOT_STATUS_CHANGE' | 'TRADE_EXECUTED' | 'PRICE_ALERT' | 'SYSTEM';
type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH';

type NotificationAction = {
  label: string;
  url: string;
  actionType: 'link' | 'button' | 'api';
};

type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  actions?: NotificationAction[];
};

type NotificationCenterProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/notifications');
        // const data = await response.json();
        
        // For demo, simulate API response
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockNotifications: Notification[] = [
          {
            id: 'notification-1',
            userId: 'user-1',
            type: 'BOT_STATUS_CHANGE',
            title: 'Bot Status Changed',
            message: 'Your bot "Solana DEX Bot" is now running',
            createdAt: new Date().toISOString(),
            isRead: false,
            priority: 'MEDIUM',
            channels: ['IN_APP'],
            actions: [
              {
                label: 'View Bot',
                url: '/trading/bots/bot-1',
                actionType: 'link'
              }
            ]
          },
          {
            id: 'notification-2',
            userId: 'user-1',
            type: 'TRADE_EXECUTED',
            title: 'Trade Executed',
            message: 'Successfully bought 0.5 SOL @ $150',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            isRead: false,
            priority: 'LOW',
            channels: ['IN_APP', 'EMAIL'],
            actions: [
              {
                label: 'View Trade',
                url: '/trading/trades/trade-1',
                actionType: 'link'
              }
            ]
          },
          {
            id: 'notification-3',
            userId: 'user-1',
            type: 'PRICE_ALERT',
            title: 'Price Alert',
            message: 'SOL price crossed $155',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isRead: true,
            priority: 'LOW',
            channels: ['IN_APP'],
            actions: []
          }
        ];
        
        setNotifications(mockNotifications);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        // In a real app, mark as read via API
        // await fetch(`/api/notifications/${notification.id}/read`, { method: 'PUT' });
        
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        );
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    }
    
    if (notification.actions && notification.actions.length > 0) {
      router.push(notification.actions[0].url);
      onClose();
    }
  };
  
  const markAllAsRead = async () => {
    try {
      // In a real app, mark all as read via API
      // await fetch('/api/notifications/read-all', { method: 'PUT' });
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="notification-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black bg-opacity-25" />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div 
          ref={ref}
          data-cy="notification-center"
          className="w-screen max-w-md transform transition ease-in-out duration-300"
        >
          <div className="h-full flex flex-col bg-gray-800 shadow-xl">
            <div className="px-4 py-5 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Notifications</h2>
                {unreadCount > 0 && (
                  <button
                    data-cy="mark-all-read"
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="spinner"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-10 px-4 text-gray-400">
                  <p>No notifications</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      data-cy="notification-item"
                      className={`border-b border-gray-700 px-4 py-3 cursor-pointer hover:bg-gray-750 transition-colors ${
                        !notification.isRead ? 'bg-gray-750' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          {notification.priority === 'CRITICAL' && (
                            <span className="h-2 w-2 rounded-full bg-red-500"></span>
                          )}
                          {notification.priority === 'HIGH' && (
                            <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <p className={`text-sm ${!notification.isRead ? 'text-gray-300' : 'text-gray-400'}`}>
                            {notification.message}
                          </p>
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="mt-2">
                              <button className="text-xs text-indigo-400 hover:text-indigo-300">
                                {notification.actions[0].label} →
                              </button>
                            </div>
                          )}
                        </div>
                        {!notification.isRead && (
                          <div className="ml-3 flex-shrink-0">
                            <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-700 px-4 py-3">
              <a
                href="/trading/notifications"
                className="block text-center text-sm text-indigo-400 hover:text-indigo-300"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/trading/notifications');
                  onClose();
                }}
              >
                View all notifications
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};