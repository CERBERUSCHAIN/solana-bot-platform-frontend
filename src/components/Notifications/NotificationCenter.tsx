// CERBERUS Bot - Notification Center Component
// Created: 2025-05-07 00:53:29 UTC
// Author: CERBERUSCHAINThank you, continue with the Notifications System to keep users informed about their bot activities and trading events.

import React, { useState, useEffect, useRef } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { Notification, NotificationType, NotificationPriority } from '../../types/notification';
import { formatDistanceToNow } from 'date-fns';

export const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    totalNotifications,
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    isLoading 
  } = useNotification();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('unread');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 10;
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fetch notifications when switching tabs
  useEffect(() => {
    if (isOpen) {
      fetchNotifications({
        unreadOnly: activeTab === 'unread',
        limit: notificationsPerPage,
        offset: 0
      });
      setCurrentPage(1);
    }
  }, [activeTab, isOpen]);
  
  // Load more notifications when scrolling
  const loadMoreNotifications = () => {
    const nextPage = currentPage + 1;
    fetchNotifications({
      unreadOnly: activeTab === 'unread',
      limit: notificationsPerPage,
      offset: (nextPage - 1) * notificationsPerPage
    }).then(() => {
      setCurrentPage(nextPage);
    });
  };
  
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // If notification has a primary action URL, navigate to it
    const primaryAction = notification.actions?.find(a => a.actionType === 'link');
    if (primaryAction?.url) {
      window.location.href = primaryAction.url;
      setIsOpen(false);
    }
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead().then(() => {
      // If on unread tab and no unread notifications, switch to all tab
      if (activeTab === 'unread' && unreadCount === 0) {
        setActiveTab('all');
      }
    });
  };
  
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TRADE_EXECUTED:
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case NotificationType.TRADE_FAILED:
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case NotificationType.PRICE_ALERT:
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case NotificationType.BOT_STATUS_CHANGE:
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        );
      case NotificationType.SECURITY_ALERT:
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        );
    }
  };
  
  const getBadgeColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.LOW:
        return 'bg-blue-900 bg-opacity-30 text-blue-400';
      case NotificationPriority.MEDIUM:
        return 'bg-yellow-900 bg-opacity-30 text-yellow-400';
      case NotificationPriority.HIGH:
        return 'bg-orange-900 bg-opacity-30 text-orange-400';
      case NotificationPriority.CRITICAL:
        return 'bg-red-900 bg-opacity-30 text-red-400';
      default:
        return 'bg-gray-700 text-gray-400';
    }
  };
  
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-800 transition-colors relative"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-indigo-400 hover:text-indigo-300"
                disabled={isLoading}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="border-b border-gray-700">
            <div className="flex">
              <button
                className={`flex-1 py-3 text-center text-sm font-medium ${
                  activeTab === 'all' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`flex-1 py-3 text-center text-sm font-medium ${
                  activeTab === 'unread' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('unread')}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                {activeTab === 'unread' ? 'No unread notifications' : 'No notifications'}
              </div>
            ) : (
              <>
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-700 hover:bg-gray-750 cursor-pointer ${
                      !notification.isRead ? 'bg-gray-750' : ''
                    }`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-white truncate">
                            {notification.title}
                          </p>
                          <span className="ml-2 flex-shrink-0 text-xs text-gray-400">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate-2-lines">
                          {notification.message}
                        </p>
                        <div className="mt-1 flex items-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor(notification.priority)}`}>
                            {notification.type.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                      
                      {!notification.isRead && (
                        <div className="ml-2">
                          <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {notifications.length < totalNotifications && (
                  <div className="p-2 text-center">
                    <button
                      onClick={loadMoreNotifications}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Load more'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="p-2 border-t border-gray-700 text-center">
            <a 
              href="/notifications" 
              onClick={() => setIsOpen(false)}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
};