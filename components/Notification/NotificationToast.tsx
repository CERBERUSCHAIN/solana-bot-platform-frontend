// CERBERUS Bot - Notification Toast Component
// Created: 2025-05-07 05:28:50 UTC
// Author: CERBERUSCHAIN

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  actions?: Array<{
    label: string;
    url: string;
    actionType: 'link' | 'button' | 'api';
  }>;
};

type NotificationToastProps = {
  notification: Notification;
  onClose: () => void;
};

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const router = useRouter();
  
  useEffect(() => {
    // Auto-hide the toast after 6 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const handleClick = () => {
    // Mark as read
    try {
      // In a real app, mark as read via API
      // await fetch(`/api/notifications/${notification.id}/read`, { method: 'PUT' });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
    
    // If there's an action, navigate to it
    if (notification.actions && notification.actions.length > 0) {
      router.push(notification.actions[0].url);
    }
    
    onClose();
  };
  
  return (
    <div
      data-cy="notification-toast"
      className="fixed top-4 right-4 max-w-sm w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-700"
      role="alert"
      aria-live="assertive"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <h3 className="text-sm font-medium text-white">{notification.title}</h3>
            <p className="mt-1 text-sm text-gray-300">{notification.message}</p>
            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3">
                <button 
                  className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-xs px-2 py-1 rounded"
                  onClick={handleClick}
                >
                  {notification.actions[0].label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-300 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};