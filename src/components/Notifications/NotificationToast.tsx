// CERBERUS Bot - Notification Toast Component
// Created: 2025-05-07 02:03:11 UTC
// Author: CERBERUSCHAINNotification Toast component for displaying real-time alerts is NOT complete

import React, { useState, useEffect } from 'react';
import { Notification, NotificationType } from '../../types/notification';
import { useNotification } from '../../contexts/NotificationContext';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  autoCloseAfter?: number; // in milliseconds
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  autoCloseAfter = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const { markAsRead } = useNotification();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation
    }, autoCloseAfter);
    
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (autoCloseAfter / 100));
        return newProgress < 0 ? 0 : newProgress;
      });
    }, 100);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [autoCloseAfter, onClose]);
  
  const getToastBgColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TRADE_EXECUTED:
      case NotificationType.PROFIT_TARGET_REACHED:
        return 'bg-green-900 bg-opacity-80';
      case NotificationType.TRADE_FAILED:
      case NotificationType.SECURITY_ALERT:
      case NotificationType.STRATEGY_EXECUTION_FAILED:
        return 'bg-red-900 bg-opacity-80';
      case NotificationType.STOP_LOSS_TRIGGERED:
      case NotificationType.PRICE_ALERT:
        return 'bg-yellow-900 bg-opacity-80';
      case NotificationType.BOT_STATUS_CHANGE:
        return 'bg-blue-900 bg-opacity-80';
      default:
        return 'bg-gray-800 bg-opacity-80';
    }
  };
  
  const getProgressColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TRADE_EXECUTED:
      case NotificationType.PROFIT_TARGET_REACHED:
        return 'bg-green-500';
      case NotificationType.TRADE_FAILED:
      case NotificationType.SECURITY_ALERT:
      case NotificationType.STRATEGY_EXECUTION_FAILED:
        return 'bg-red-500';
      case NotificationType.STOP_LOSS_TRIGGERED:
      case NotificationType.PRICE_ALERT:
        return 'bg-yellow-500';
      case NotificationType.BOT_STATUS_CHANGE:
        return 'bg-blue-500';
      default:
        return 'bg-indigo-500';
    }
  };
  
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TRADE_EXECUTED:
        return (
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case NotificationType.TRADE_FAILED:
        return (
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case NotificationType.PRICE_ALERT:
        return (
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case NotificationType.BOT_STATUS_CHANGE:
        return (
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        );
      case NotificationType.SECURITY_ALERT:
        return (
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        );
    }
  };
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade-out animation before removing from DOM
  };
  
  const handleActionClick = (url?: string, action?: string, data?: Record<string, any>) => {
    // Mark as read when interacting with the notification
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // If there's a URL, navigate to it
    if (url) {
      window.location.href = url;
    }
    
    // If there's a custom action, handle it (could dispatch events or call functions)
    if (action) {
      console.log('Custom action triggered:', action, data);
      // Here you would handle specific actions based on the action type
      // This could include dispatching events or calling functions
    }
    
    // Close the notification
    handleClose();
  };
  
  return (
    <div
      className={`max-w-md w-full ${getToastBgColor(notification.type)} backdrop-blur-md shadow-lg rounded-md overflow-hidden transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 transition-all" style={{ width: `${progress}%`, backgroundColor: getProgressColor(notification.type) }}></div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-white">
                {notification.title}
              </p>
              <p className="mt-1 text-sm text-gray-300">
                {notification.message}
              </p>
              
              {/* Action buttons, if any */}
              {notification.actions && notification.actions.length > 0 && (
                <div className="mt-3 flex space-x-2">
                  {notification.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleActionClick(action.url, action.action, action.data)}
                      className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                        action.actionType === 'button'
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'text-indigo-300 hover:text-indigo-200'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={handleClose}
                className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-300 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};