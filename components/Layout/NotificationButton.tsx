// CERBERUS Bot - Notification Button Component
// Created: 2025-05-07 05:28:50 UTC
// Author: CERBERUSCHAIN

import React, { useState, useEffect } from 'react';
import { NotificationCenter } from '../Notification/NotificationCenter';
import { NotificationToast } from '../Notification/NotificationToast';

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

export const NotificationButton: React.FC = () => {
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newNotification, setNewNotification] = useState<Notification | null>(null);
  
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/notifications/summary');
        // const data = await response.json();
        
        // For demo, use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        setUnreadCount(2);
      } catch (err) {
        console.error('Failed to fetch notification count:', err);
      }
    };
    
    fetchNotificationCount();
    
    // Set up WebSocket connection for real-time notifications
    // In a real app, this would connect to a WebSocket server
    const setupNotifications = () => {
      // Mock WebSocket events
      document.addEventListener('cerberus:notification', (event: any) => {
        const notification = event.detail;
        setUnreadCount(prev => prev + 1);
        setNewNotification(notification);
        
        // Auto-hide the toast after 6 seconds
        setTimeout(() => {
          setNewNotification(null);
        }, 6000);
      });
    };
    
    setupNotifications();
  }, []);
  
  const toggleNotificationCenter = () => {
    setIsNotificationCenterOpen(prev => !prev);
  };
  
  return (
    <>
      <button
        data-cy="notification-button"
        className="relative p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        aria-label={`${unreadCount} unread notifications`}
        onClick={toggleNotificationCenter}
      >
        <svg 
          className="h-6 w-6" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        
        {unreadCount > 0 && (
          <span 
            data-cy="unread-badge"
            className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-white text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      <NotificationCenter 
        isOpen={isNotificationCenterOpen} 
        onClose={() => setIsNotificationCenterOpen(false)} 
      />
      
      {newNotification && (
        <NotificationToast 
          notification={newNotification} 
          onClose={() => setNewNotification(null)} 
        />
      )}
    </>
  );
};