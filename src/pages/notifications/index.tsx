// CERBERUS Bot - Notifications Page
// Created: 2025-05-07 02:03:11 UTC
// Author: CERBERUSCHAINNotification Toast component for displaying real-time alerts is NOT complete

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { useNotification } from '../../contexts/NotificationContext';
import { NotificationType, NotificationPriority } from '../../types/notification';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const { 
    notifications, 
    totalNotifications,
    unreadCount, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    deleteAllNotifications,
    isLoading 
  } = useNotification();
  
  const [filter, setFilter] = useState<{
    type?: NotificationType;
    priority?: NotificationPriority;
    readStatus?: 'read' | 'unread';
  }>({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 20;
  
  // Load notifications on first render
  useEffect(() => {
    loadNotifications();
  }, [filter, currentPage]);
  
  // Load notifications with filters and pagination
  const loadNotifications = async () => {
    const options: any = {
      limit: notificationsPerPage,
      offset: (currentPage - 1) * notificationsPerPage
    };
    
    if (filter.readStatus === 'unread') {
      options.unreadOnly = true;
    }
    
    // Note: In a real implementation, type and priority filters would be
    // handled by the backend API. Here we're simulating it client-side.
    await fetchNotifications(options);
  };
  
  // Get filtered notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter.type && notification.type !== filter.type) {
      return false;
    }
    
    if (filter.priority && notification.priority !== filter.priority) {
      return false;
    }
    
    if (filter.readStatus === 'read' && !notification.isRead) {
      return false;
    }
    
    if (filter.readStatus === 'unread' && notification.isRead) {
      return false;
    }
    
    return true;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Format relative time for display
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };
  
  // Get notification type display name
  const getNotificationTypeDisplayName = (type: NotificationType) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };
  
  // Handle notification click
  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
    
    // In a real app, you might navigate to a related page or show a modal
    // with more details about the notification
  };
  
  // Get notification icon by type
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
  
  // Get priority badge style
  const getPriorityBadgeStyle = (priority: NotificationPriority) => {
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
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>Notifications | CERBERUS Bot</title>
        </Head>
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-gray-400">Manage your alerts and notifications</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center text-sm"
                  disabled={isLoading}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Mark All Read
                </button>
              )}
              
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete all notifications? This cannot be undone.')) {
                    deleteAllNotifications();
                  }
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md flex items-center text-sm"
                disabled={isLoading || notifications.length === 0}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Clear All
              </button>
            </div>
          </div>
          
          {/* Filter Bar */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              {/* Filter by read status */}
              <div className="w-full md:w-auto">
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  value={filter.readStatus || ''}
                  onChange={(e) => aria-label="Selection field" setFilter({
                    ...filter,
                    readStatus: e.target.value === '' ? undefined : e.target.value as 'read' | 'unread'
                  })}
                  className="w-full md:w-auto bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                >
                  <option value="">All</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                </select>
              </div>
              
              {/* Filter by type */}
              <div className="w-full md:w-auto">
                <label className="block text-sm text-gray-400 mb-1">Type</label>
                <select
                  value={filter.type || ''}
                  onChange={(e) => aria-label="Selection field" setFilter({
                    ...filter,
                    type: e.target.value === '' ? undefined : e.target.value as NotificationType
                  })}
                  className="w-full md:w-auto bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                >
                  <option value="">All Types</option>
                  {Object.values(NotificationType).map(type => (
                    <option key={type} value={type}>
                      {getNotificationTypeDisplayName(type)}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Filter by priority */}
              <div className="w-full md:w-auto">
                <label className="block text-sm text-gray-400 mb-1">Priority</label>
                <select
                  value={filter.priority || ''}
                  onChange={(e) => aria-label="Selection field" setFilter({
                    ...filter,
                    priority: e.target.value === '' ? undefined : e.target.value as NotificationPriority
                  })}
                  className="w-full md:w-auto bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-indigo-500 text-white"
                >
                  <option value="">All Priorities</option>
                  {Object.values(NotificationPriority).map(priority => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Reset filters button */}
              <div className="w-full md:w-auto flex items-end">
                <button
                  onClick={() => {
                    setFilter({});
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
                  disabled={Object.keys(filter).length === 0}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Notifications List */}
          <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
            {isLoading && filteredNotifications.length === 0 ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No notifications found.
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                    className={`p-4 hover:bg-gray-750 cursor-pointer transition-colors ${
                      !notification.isRead ? 'bg-gray-750' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-white">
                            {notification.title}
                          </p>
                          <div className="flex space-x-2">
                            <span className="text-xs text-gray-400">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-gray-500 hover:text-gray-300"
                              aria-label="Delete notification"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <p className="mt-1 text-sm text-gray-300">
                          {notification.message}
                        </p>
                        
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadgeStyle(notification.priority)}`}>
                            {notification.priority}
                          </span>
                          
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                            {getNotificationTypeDisplayName(notification.type)}
                          </span>
                          
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex ml-auto space-x-2">
                              {notification.actions.map((action, index) => (
                                <button
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (action.url) {
                                      window.location.href = action.url;
                                    }
                                    // Handle other actions if needed
                                  }}
                                  className={`text-xs ${
                                    action.actionType === 'button' 
                                      ? 'px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white' 
                                      : 'text-indigo-400 hover:text-indigo-300'
                                  }`}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalNotifications > notificationsPerPage && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-700">
                <div className="flex-1 flex justify-between">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage <= 1 || isLoading}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                      ${currentPage <= 1 || isLoading
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                  >
                    Previous
                  </button>
                  
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {Math.ceil(totalNotifications / notificationsPerPage)}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= Math.ceil(totalNotifications / notificationsPerPage) || isLoading}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                      ${currentPage >= Math.ceil(totalNotifications / notificationsPerPage) || isLoading
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
