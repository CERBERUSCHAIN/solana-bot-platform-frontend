// CERBERUS Bot - Bot Execution Details Page
// Created: 2025-05-06 23:59:01 UTC
// Author: CERBERUSCHAINBot Execution Details page bot-execution/[id].tsx is NOT complete

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { useBotExecution } from '../../contexts/BotExecutionContext';
import { BotExecutionStatus, ExecutionLogEntry, LogLevel } from '../../types/botExecution';
import { ExecutionControls } from '../../components/BotExecution/ExecutionControls';
import { ExecutionLogs } from '../../components/BotExecution/ExecutionLogs';
import { ExecutionMetrics } from '../../components/BotExecution/ExecutionMetrics';
import { TradeHistory } from '../../components/BotExecution/TradeHistory';
import { StrategyVisualizer } from '../../components/BotExecution/StrategyVisualizer';
import { ExecutionSettings } from '../../components/BotExecution/ExecutionSettings';
import { EditExecutionModal } from '../../components/BotExecution/EditExecutionModal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { useStrategy } from '../../contexts/StrategyContext';

export default function BotExecutionDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { 
    currentSession,
    loadExecutionSession,
    loadExecutionLogs,
    loadSessionTrades,
    pauseExecution,
    resumeExecution,
    stopExecution,
    triggerManualExecution,
    deleteExecutionSession,
    isLoading,
    error
  } = useBotExecution();
  const { getStrategy } = useStrategy();
  
  const [activeTab, setActiveTab] = useState<
    'overview' | 'logs' | 'trades' | 'strategy' | 'settings'
  >('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [logLevel, setLogLevel] = useState<LogLevel | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Load session data when id is available
  useEffect(() => {
    if (id && typeof id === 'string') {
      loadSessionData(id);
    }
  }, [id]);
  
  const loadSessionData = async (sessionId: string) => {
    try {
      await loadExecutionSession(sessionId);
      await loadExecutionLogs(sessionId, { limit: 100 });
      await loadSessionTrades(sessionId, { limit: 10 });
      
      // Load strategy details if sessionId exists
      if (currentSession?.strategyId) {
        await getStrategy(currentSession.strategyId);
      }
    } catch (error) {
      console.error('Error loading bot execution data:', error);
    }
  };
  
  // Auto-refresh logs if session is running
  useEffect(() => {
    if (!currentSession || 
        currentSession.status !== BotExecutionStatus.RUNNING || 
        activeTab !== 'logs') {
      return;
    }
    
    const refreshInterval = setInterval(async () => {
      if (id && typeof id === 'string') {
        try {
          await loadExecutionLogs(id, { limit: 100, level: logLevel === 'all' ? undefined : logLevel });
        } catch (error) {
          console.error('Error refreshing logs:', error);
        }
      }
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(refreshInterval);
  }, [currentSession, activeTab, logLevel]);
  
  const handleRefreshData = async () => {
    if (!id || typeof id !== 'string') return;
    
    setIsRefreshing(true);
    try {
      await loadSessionData(id);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handlePauseExecution = async () => {
    if (!currentSession) return;
    
    try {
      await pauseExecution(currentSession.id);
    } catch (error) {
      console.error('Error pausing execution:', error);
    }
  };
  
  const handleResumeExecution = async () => {
    if (!currentSession) return;
    
    try {
      await resumeExecution(currentSession.id);
    } catch (error) {
      console.error('Error resuming execution:', error);
    }
  };
  
  const handleStopExecution = async () => {
    if (!currentSession) return;
    
    try {
      await stopExecution(currentSession.id);
    } catch (error) {
      console.error('Error stopping execution:', error);
    }
  };
  
  const handleTriggerManualExecution = async () => {
    if (!currentSession) return;
    
    try {
      await triggerManualExecution(currentSession.id);
      // Refresh logs to show the execution results
      if (id && typeof id === 'string') {
        await loadExecutionLogs(id, { limit: 100 });
      }
    } catch (error) {
      console.error('Error triggering manual execution:', error);
    }
  };
  
  const handleDeleteSession = async () => {
    if (!currentSession) return;
    
    try {
      const success = await deleteExecutionSession(currentSession.id);
      if (success) {
        router.push('/bot-execution');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };
  
  if (isLoading && !currentSession) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </ProtectedRoute>
    );
  }
  
  if (!currentSession) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-900 text-white">
          <Head>
            <title>Bot Session Not Found | CERBERUS Bot</title>
          </Head>
          
          <main className="container mx-auto px-4 py-8">
            <div className="bg-gray-800 rounded-lg p-16 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-300">Bot Session Not Found</h3>
              <p className="mt-1 text-gray-500">
                The bot execution session you're looking for doesn't exist or has been deleted.
              </p>
              <div className="mt-6">
                <Link href="/bot-execution" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white">
                  Back to Bot Execution Dashboard
                </Link>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>Bot Execution Details | CERBERUS Bot</title>
        </Head>
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center">
                <Link href="/bot-execution" className="text-gray-400 hover:text-white mr-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                </Link>
                <h1 className="text-3xl font-bold">Bot Execution Details</h1>
              </div>
              <div className="mt-2 flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${currentSession.status === BotExecutionStatus.RUNNING ? 'bg-green-900 text-green-400' :
                  currentSession.status === BotExecutionStatus.PAUSED ? 'bg-yellow-900 text-yellow-400' :
                  currentSession.status === BotExecutionStatus.ERROR ? 'bg-red-900 text-red-400' :
                  'bg-gray-700 text-gray-400'}`}
                >
                  {currentSession.status}
                </span>
                <span className="ml-2 text-gray-400">
                  Session ID: {currentSession.id.substring(0, 8)}...
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <button
                onClick={handleRefreshData}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center text-sm"
                disabled={isRefreshing}
              >
                <svg className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </button>
              
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                Edit
              </button>
              
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded-md flex items-center text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900 bg-opacity-20 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {/* Execution Control Bar */}
          <ExecutionControls 
            status={currentSession.status}
            onPause={handlePauseExecution}
            onResume={handleResumeExecution}
            onStop={handleStopExecution}
            onTriggerManual={handleTriggerManualExecution}
            disabled={isLoading}
          />
          
          {/* Tabs Navigation */}
          <div className="border-b border-gray-700 mb-6 mt-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'logs'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                Logs
              </button>
              <button
                onClick={() => setActiveTab('trades')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'trades'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                Trades
              </button>
              <button
                onClick={() => setActiveTab('strategy')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'strategy'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                Strategy
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="mt-4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Session Info */}
                <div className="bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Session Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm text-gray-400">Bot ID</h3>
                      <p className="font-medium">{currentSession.botId}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400">Strategy ID</h3>
                      <p className="font-medium">{currentSession.strategyId}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400">Created</h3>
                      <p className="font-medium">{formatDate(currentSession.createdAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400">Last Active</h3>
                      <p className="font-medium">{formatDate(currentSession.lastActiveAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400">Mode</h3>
                      <p className="font-medium capitalize">{currentSession.mode}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400">Frequency</h3>
                      <p className="font-medium capitalize">{currentSession.frequency}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400">Status</h3>
                      <p className={`font-medium ${
                        currentSession.status === BotExecutionStatus.RUNNING ? 'text-green-400' :
                        currentSession.status === BotExecutionStatus.PAUSED ? 'text-yellow-400' :
                        currentSession.status === BotExecutionStatus.ERROR ? 'text-red-400' :
                        'text-gray-300'
                      }`}>
                        {currentSession.status}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400">Connected Wallet</h3>
                      <p className="font-medium">{currentSession.walletId || 'None'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-400">Network</h3>
                      <p className="font-medium">{currentSession.config.network}</p>
                    </div>
                  </div>
                </div>
                
                {/* Performance Metrics */}
                <ExecutionMetrics metrics={currentSession.metrics} />
                
                {/* Recent Trades */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recent Trades</h2>
                    <button
                      onClick={() => setActiveTab('trades')}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      View All
                    </button>
                  </div>
                  
                  <TradeHistory trades={sessionTrades.slice(0, 5)} isLoading={isLoading} />
                </div>
                
                {/* Recent Logs */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Recent Logs</h2>
                    <button
                      onClick={() => setActiveTab('logs')}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      View All
                    </button>
                  </div>
                  
                  <ExecutionLogs 
                    logs={sessionLogs.slice(0, 5)} 
                    isLoading={isLoading} 
                    logLevel={logLevel}
                    onLogLevelChange={setLogLevel}
                    showFilters={false}
                  />
                </div>
              </div>
            )}
            
            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <div className="space-y-4">
                <ExecutionLogs 
                  logs={sessionLogs} 
                  isLoading={isLoading} 
                  logLevel={logLevel}
                  onLogLevelChange={setLogLevel}
                  showFilters={true}
                />
              </div>
            )}
            
            {/* Trades Tab */}
            {activeTab === 'trades' && (
              <div className="space-y-4">
                <TradeHistory trades={sessionTrades} isLoading={isLoading} showPagination={true} />
              </div>
            )}
            
            {/* Strategy Tab */}
            {activeTab === 'strategy' && (
              <div className="space-y-4">
                <StrategyVisualizer
                  strategyId={currentSession.strategyId}
                  sessionId={currentSession.id}
                  isLoading={isLoading}
                />
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <ExecutionSettings
                  session={currentSession}
                  onSaveSettings={updateExecutionConfig}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        </main>
        
        {/* Edit Modal */}
        {isEditModalOpen && currentSession && (
          <EditExecutionModal
            session={currentSession}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
        
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <ConfirmationModal
            title="Delete Execution Session"
            message="Are you sure you want to delete this execution session? This action cannot be undone."
            confirmButtonText="Delete"
            confirmButtonColor="red"
            onConfirm={handleDeleteSession}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}