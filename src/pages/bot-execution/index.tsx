// CERBERUS Bot - Bot Execution Dashboard Page
// Created: 2025-05-06 23:42:15 UTC
// Author: CERBERUSCHAINYes

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { useBotExecution } from '../../contexts/BotExecutionContext';
import { BotExecutionStatus, BotExecutionSession } from '../../types/botExecution';
import { ExecutionSummary } from '../../components/BotExecution/ExecutionSummary';
import { BotSessionsTable } from '../../components/BotExecution/BotSessionsTable';
import { BotSessionStatusChart } from '../../components/BotExecution/BotSessionStatusChart';
import { StartExecutionModal } from '../../components/BotExecution/StartExecutionModal';

export default function BotExecutionDashboard() {
  const router = useRouter();
  const { 
    activeSessions, 
    statusSummary,
    loadUserSessions, 
    loadStatusSummary,
    isLoading, 
    error,
  } = useBotExecution();
  
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BotExecutionStatus | 'all'>('all');
  const [filteredSessions, setFilteredSessions] = useState<BotExecutionSession[]>(activeSessions);
  
  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadStatusSummary();
        await loadUserSessions();
      } catch (error) {
        console.error('Error loading bot execution data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Filter sessions when active sessions or filter changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredSessions(activeSessions);
    } else {
      setFilteredSessions(activeSessions.filter(session => session.status === statusFilter));
    }
  }, [activeSessions, statusFilter]);
  
  // Handle view session details
  const handleViewSession = (sessionId: string) => {
    router.push(`/bot-execution/${sessionId}`);
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>Bot Execution | CERBERUS Bot</title>
        </Head>
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bot Execution</h1>
              <p className="text-gray-400">Monitor and manage your trading bots</p>
            </div>
            
            <button
              onClick={() => setIsStartModalOpen(true)}
              className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center text-white"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Start New Execution
            </button>
          </div>
          
          {error && (
            <div className="bg-red-900 bg-opacity-20 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {/* Status Summary Section */}
          {statusSummary && (
            <ExecutionSummary summary={statusSummary} isLoading={isLoading} />
          )}
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
              <div className="h-64">
                {/* Performance chart would go here */}
                <div className="h-full flex items-center justify-center text-gray-500">
                  Performance chart will be displayed here
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Bot Status</h2>
              {statusSummary ? (
                <BotSessionStatusChart 
                  active={statusSummary.activeBots}
                  paused={statusSummary.pausedBots}
                  error={statusSummary.errorBots}
                  idle={statusSummary.totalBots - statusSummary.activeBots - statusSummary.pausedBots - statusSummary.errorBots}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Loading status data...
                </div>
              )}
            </div>
          </div>
          
          {/* Bot Sessions Table */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Active Bot Sessions</h2>
              
              <div>
                <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => aria-label="Selection field" setStatusFilter(e.target.value as BotExecutionStatus | 'all')}
                  className="bg-gray-700 border-gray-600 text-white rounded text-sm px-3 py-1.5"
                >
                  <option value="all">All Statuses</option>
                  <option value={BotExecutionStatus.RUNNING}>Running</option>
                  <option value={BotExecutionStatus.PAUSED}>Paused</option>
                  <option value={BotExecutionStatus.ERROR}>Error</option>
                  <option value={BotExecutionStatus.STOPPED}>Stopped</option>
                  <option value={BotExecutionStatus.COMPLETED}>Completed</option>
                  <option value={BotExecutionStatus.IDLE}>Idle</option>
                </select>
              </div>
            </div>
            
            {activeSessions.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-16 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-300">No bot sessions found</h3>
                <p className="mt-1 text-gray-500">
                  Start a new bot execution to begin trading
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsStartModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white"
                  >
                    Start New Execution
                  </button>
                </div>
              </div>
            ) : (
              <BotSessionsTable 
                sessions={filteredSessions}
                isLoading={isLoading}
                onViewSession={handleViewSession}
              />
            )}
          </div>
        </main>
        
        {/* Start Execution Modal */}
        {isStartModalOpen && (
          <StartExecutionModal onClose={() => setIsStartModalOpen(false)} />
        )}
      </div>
    </ProtectedRoute>
  );
}
