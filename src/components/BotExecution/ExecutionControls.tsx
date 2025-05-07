// CERBERUS Bot - Execution Controls Component
// Created: 2025-05-06 23:59:01 UTC
// Author: CERBERUSCHAINBot Execution Details page bot-execution/[id].tsx is NOT complete

import React from 'react';
import { BotExecutionStatus } from '../../types/botExecution';

interface ExecutionControlsProps {
  status: BotExecutionStatus;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onTriggerManual: () => void;
  disabled: boolean;
}

export const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  status,
  onPause,
  onResume,
  onStop,
  onTriggerManual,
  disabled
}) => {
  const isRunning = status === BotExecutionStatus.RUNNING;
  const isPaused = status === BotExecutionStatus.PAUSED;
  const isStopped = status === BotExecutionStatus.STOPPED || 
                    status === BotExecutionStatus.COMPLETED || 
                    status === BotExecutionStatus.ERROR;
  
  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 flex flex-wrap items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          isRunning ? 'bg-green-400' : 
          isPaused ? 'bg-yellow-400' : 
          'bg-gray-400'
        }`}></div>
        <span className="font-medium">{status}</span>
      </div>
      
      <div className="flex space-x-2">
        {isRunning && (
          <button
            onClick={onPause}
            disabled={disabled}
            className={`px-3 py-1.5 rounded flex items-center ${
              disabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-yellow-700 hover:bg-yellow-600 text-white'
            }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Pause
          </button>
        )}
        
        {isPaused && (
          <button
            onClick={onResume}
            disabled={disabled}
            className={`px-3 py-1.5 rounded flex items-center ${
              disabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600 text-white'
            }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Resume
          </button>
        )}
        
        {(isRunning || isPaused) && (
          <button
            onClick={onStop}
            disabled={disabled}
            className={`px-3 py-1.5 rounded flex items-center ${
              disabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-700 hover:bg-red-600 text-white'
            }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
            </svg>
            Stop
          </button>
        )}
        
        {isStopped && (
          <button
            onClick={onTriggerManual}
            disabled={disabled}
            className={`px-3 py-1.5 rounded flex items-center ${
              disabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600 text-white'
            }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Run Now
          </button>
        )}
        
        {/* Manual execution is available in any state */}
        {!isStopped && (
          <button
            onClick={onTriggerManual}
            disabled={disabled}
            className={`px-3 py-1.5 rounded flex items-center ${
              disabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-indigo-700 hover:bg-indigo-600 text-white'
            }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Run Once
          </button>
        )}
      </div>
    </div>
  );
};