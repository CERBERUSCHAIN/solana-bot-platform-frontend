// CERBERUS Bot - Security Event Log Component
// Created: 2025-05-06 21:03:30 UTC
// Author: CERBERUSCHAIN

import React, { useState, useEffect } from 'react';
import { useSecurity } from '../../contexts/SecurityContext';
import { SecurityEvent } from '../../types/security';

export const SecurityEventLog: React.FC = () => {
  const { securityEvents, fetchSecurityEventLog, isLoading } = useSecurity();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>('all');
  const itemsPerPage = 10;
  
  useEffect(() => {
    loadEvents();
  }, [currentPage, filter]);
  
  const loadEvents = async () => {
    await fetchSecurityEventLog(itemsPerPage, (currentPage - 1) * itemsPerPage);
  };
  
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-900 bg-opacity-20 text-red-400';
      case 'medium':
        return 'bg-yellow-900 bg-opacity-20 text-yellow-400';
      case 'low':
        return 'bg-green-900 bg-opacity-20 text-green-400';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };
  
  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'login_success':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
          </svg>
        );
      case 'login_failed':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'logout':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        );
      case 'password_changed':
      case 'email_changed':
      case 'security_settings_changed':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        );
      case 'two_factor_enabled':
      case 'two_factor_disabled':
      case 'wallet_encrypted':
      case 'wallet_decrypted':
        return (
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
          </svg>
        );
      case 'suspicious_activity':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
    }
  };
  
  const formatEventType = (eventType: string): string => {
    return eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Security Activity Log</h2>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <label htmlFor="event-filter" className="block text-sm font-medium text-gray-400 mb-1">
            Filter Events
          </label>
          <select
            id="event-filter"
            className="bg-gray-700 border-gray-600 text-white rounded text-sm px-3 py-1.5"
            value={filter}
            onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Events</option>
            <option value="login">Login Activity</option>
            <option value="settings">Settings Changes</option>
            <option value="security">Security Features</option>
            <option value="high">High Severity</option>
          </select>
        </div>
        
        <button
          onClick={loadEvents}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
        >
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </div>
        </button>
      </div>
      
      {isLoading ? (
        <div className="bg-gray-750 rounded-lg p-16 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : securityEvents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-750">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {securityEvents.map((event: SecurityEvent) => (
                <tr key={event.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getEventTypeIcon(event.eventType)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{formatEventType(event.eventType)}</div>
                        {event.details && (
                          <div className="text-xs text-gray-400">{event.details}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="font-mono">{event.ipAddress}</div>
                    {event.location && (
                      <div className="text-xs text-gray-400">{event.location}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {event.userAgent ? (
                      <div className="text-xs text-gray-400 max-w-xs truncate" title={event.userAgent}>
                        {event.userAgent}
                      </div>
                    ) : (
                      <span className="text-gray-500">Unknown</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityClass(event.severity)}`}>
                      {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, securityEvents.length)}</span> of{' '}
                <span className="font-medium">100+</span> events
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-750 rounded-lg p-16 text-center">
          <p className="text-gray-400">No security events found.</p>
        </div>
      )}
    </div>
  );
};
