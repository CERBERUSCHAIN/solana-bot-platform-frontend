// CERBERUS Bot - Execution Logs Component
// Created: 2025-05-06 23:59:01 UTC
// Author: CERBERUSCHAINBot Execution Details page bot-execution/[id].tsx is NOT complete

import React, { useState } from 'react';
import { ExecutionLogEntry, LogLevel } from '../../types/botExecution';
import { formatDistanceToNow } from 'date-fns';

interface ExecutionLogsProps {
  logs: ExecutionLogEntry[];
  isLoading: boolean;
  logLevel: LogLevel | 'all';
  onLogLevelChange: (level: LogLevel | 'all') => void;
  showFilters: boolean;
}

export const ExecutionLogs: React.FC<ExecutionLogsProps> = ({
  logs,
  isLoading,
  logLevel,
  onLogLevelChange,
  showFilters
}) => {
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  
  const getLogLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'text-gray-400';
      case LogLevel.INFO:
        return 'text-blue-400';
      case LogLevel.WARNING:
        return 'text-yellow-400';
      case LogLevel.ERROR:
        return 'text-red-400';
      case LogLevel.CRITICAL:
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };
  
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString();
    } catch (e) {
      return dateString;
    }
  };
  
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };
  
  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow">
      {showFilters && (
        <div className="p-4 border-b border-gray-700 flex flex-wrap items-center justify-between">
          <h2 className="text-lg font-semibold">Execution Logs</h2>
          
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => onLogLevelChange('all')}
              className={`px-2 py-1 text-xs rounded ${
                logLevel === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onLogLevelChange(LogLevel.DEBUG)}
              className={`px-2 py-1 text-xs rounded ${
                logLevel === LogLevel.DEBUG ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Debug
            </button>
            <button
              onClick={() => onLogLevelChange(LogLevel.INFO)}
              className={`px-2 py-1 text-xs rounded ${
                logLevel === LogLevel.INFO ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Info
            </button>
            <button
              onClick={() => onLogLevelChange(LogLevel.WARNING)}
              className={`px-2 py-1 text-xs rounded ${
                logLevel === LogLevel.WARNING ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Warning
            </button>
            <button
              onClick={() => onLogLevelChange(LogLevel.ERROR)}
              className={`px-2 py-1 text-xs rounded ${
                logLevel === LogLevel.ERROR ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Error
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        {isLoading && logs.length === 0 ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No logs available.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-750">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Level
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Element
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {logs.map(log => (
                <tr 
                  key={log.id} 
                  className={`hover:bg-gray-750 cursor-pointer ${expandedLogs[log.id] ? 'bg-gray-750' : ''}`}
                  onClick={() => toggleLogExpansion(log.id)}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="text-gray-300">{formatTime(log.timestamp)}</div>
                    <div className="text-xs text-gray-500">{formatRelativeTime(log.timestamp)}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getLogLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    <div className="max-w-md truncate">{log.message}</div>
                    
                    {expandedLogs[log.id] && log.details && (
                      <div className="mt-2 p-2 bg-gray-800 rounded text-xs font-mono whitespace-pre-wrap text-gray-400">
                        {JSON.stringify(log.details, null, 2)}
                      </div>
                    )}
                    
                    {expandedLogs[log.id] && log.transaction && (
                      <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Transaction:</span>
                            <a 
                              href={`https://etherscan.io/tx/${log.transaction.hash}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {log.transaction.hash.substring(0, 8)}...
                            </a>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className={
                              log.transaction.status === 'confirmed' ? 'text-green-400' : 
                              log.transaction.status === 'pending' ? 'text-yellow-400' : 
                              'text-red-400'
                            }>
                              {log.transaction.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Fee:</span>
                            <span className="text-gray-300">{log.transaction.networkFee}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {log.element ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{log.element.name}</span>
                        <span className="text-xs text-gray-400">{log.element.type}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};