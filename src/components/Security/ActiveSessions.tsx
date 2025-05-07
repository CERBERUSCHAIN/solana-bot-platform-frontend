// CERBERUS Bot - Active Sessions Component
// Created: 2025-05-06 21:03:30 UTC
// Author: CERBERUSCHAIN

import React, { useEffect, useState } from 'react';
import { useSecurity } from '../../contexts/SecurityContext';

interface SessionData {
  id: string;
  ipAddress: string;
  device: string;
  browser: string;
  location?: string;
  lastActive: string;
  current: boolean;
}

export const ActiveSessions: React.FC = () => {
  const { activeSessions, fetchActiveSessions, terminateSession, isLoading } = useSecurity();
  const [terminatingSession, setTerminatingSession] = useState<string | null>(null);
  
  useEffect(() => {
    fetchActiveSessions();
  }, []);
  
  const handleTerminateSession = async (sessionId: string) => {
    setTerminatingSession(sessionId);
    try {
      await terminateSession(sessionId);
    } catch (error) {
      console.error('Error terminating session:', error);
    } finally {
      setTerminatingSession(null);
    }
  };
  
  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Calculate difference in milliseconds
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Active Sessions</h2>
      
      <div className="mb-6">
        <p className="text-gray-400">
          These are devices that have active sessions logged into your account. You can terminate any session that you don't recognize.
        </p>
      </div>
      
      {isLoading ? (
        <div className="bg-gray-750 rounded-lg p-16 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : activeSessions.length > 0 ? (
        <div className="space-y-4">
          {activeSessions.map((session: SessionData) => (
            <div 
              key={session.id} 
              className={`bg-gray-750 rounded-lg p-4 border ${
                session.current ? 'border-indigo-500' : 'border-gray-700'
              }`}
            >
              <div className="flex justify-between">
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-gray-700 mr-4">
                    {session.device.toLowerCase().includes('mobile') ? (
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h5a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h-4v3h4V7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {session.device}
                      {session.current && (
                        <span className="ml-2 px-2 py-1 bg-indigo-900 bg-opacity-30 text-indigo-400 rounded text-xs">
                          Current Session
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      {session.browser}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 flex items-center">
                      <span className="font-mono mr-2">{session.ipAddress}</span>
                      {session.location && (
                        <span>• {session.location}</span>
                      )}
                      <span className="ml-2">• Last active {formatLastActive(session.lastActive)}</span>
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleTerminateSession(session.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                    disabled={terminatingSession === session.id}
                  >
                    {terminatingSession === session.id ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Terminating...
                      </span>
                    ) : 'Terminate Session'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-750 rounded-lg p-16 text-center">
          <p className="text-gray-400">No active sessions found.</p>
        </div>
      )}
      
      {/* Terminate All Sessions Button */}
      {activeSessions.length > 1 && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to terminate all other sessions? This will log out all devices except this one.')) {
                activeSessions
                  .filter(session => !session.current)
                  .forEach(session => handleTerminateSession(session.id));
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Terminate All Other Sessions
          </button>
        </div>
      )}
    </div>
  );
};