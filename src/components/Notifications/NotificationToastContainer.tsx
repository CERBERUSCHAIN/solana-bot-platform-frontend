// CERBERUS Bot - Notification Toast Container
// Created: 2025-05-07 02:03:11 UTC
// Author: CERBERUSCHAINNotification Toast component for displaying real-time alerts is NOT complete

import React, { useState, useEffect } from 'react';
import { NotificationToast } from './NotificationToast';
import { Notification } from '../../types/notification';
import { useNotification } from '../../contexts/NotificationContext';

export const NotificationToastContainer: React.FC = () => {
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);
  const { notifications } = useNotification();
  
  // Listen for new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      
      // Check if this notification is already shown as a toast
      const isAlreadyToast = activeToasts.some(toast => toast.id === latestNotification.id);
      
      // Only show new notifications that aren't read yet
      if (!isAlreadyToast && !latestNotification.isRead) {
        // Add to active toasts (limit to 3 visible at a time)
        setActiveToasts(prev => [latestNotification, ...prev].slice(0, 3));
      }
    }
  }, [notifications]);
  
  const removeToast = (id: string) => {
    setActiveToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
      {activeToasts.map(toast => (
        <NotificationToast
          key={toast.id}
          notification={toast}
          onClose={() => removeToast(toast.id)}
          autoCloseAfter={6000}
        />
      ))}
    </div>
  );
};