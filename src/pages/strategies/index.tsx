// CERBERUS Bot - Strategy Builder Page
// Created: 2025-05-06 21:28:38 UTC
// Author: CERBERUSCHAIN

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { useStrategy } from '../../contexts/StrategyContext';
import { StrategiesList } from '../../components/Strategy/StrategiesList';
import { StrategyTemplatesModal } from '../../components/Strategy/StrategyTemplatesModal';
import { CreateStrategyModal } from '../../components/Strategy/CreateStrategyModal';

// Mock component for ImportStrategyModal
const ImportStrategyModal: React.FC<{onClose: () => void}> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-xl font-bold mb-4">Import Strategy</h2>
      <p className="mb-4">This is a placeholder for the ImportStrategyModal component.</p>
      <div className="flex justify-end">
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default function StrategiesPage() {
  const router = useRouter();
  const { 
    strategies, 
    loadStrategies, 
    deleteStrategy, 
    cloneStrategy,
    shareStrategy,
    isLoading, 
    error 
  } = useStrategy();
  
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStrategies, setFilteredStrategies] = useState(strategies);
  const [sortOption, setSortOption] = useState<'latest' | 'name' | 'performance'>('latest');
  
  useEffect(() => {
    loadStrategies();
  }, [loadStrategies]);
  
  useEffect(() => {
    if (strategies) {
      let filtered = [...strategies];
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(strategy => 
          strategy.name.toLowerCase().includes(term) || 
          (strategy.description && strategy.description.toLowerCase().includes(term))
        );
      }
      
      // Sort strategies
      if (sortOption === 'latest') {
        filtered = filtered.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      } else if (sortOption === 'name') {
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === 'performance') {
        filtered = filtered.sort((a, b) => 
          (b.performance?.backtestResults?.profitPercentage || 0) - 
          (a.performance?.backtestResults?.profitPercentage || 0)
        );
      }
      
      setFilteredStrategies(filtered);
    }
  }, [strategies, searchTerm, sortOption]);
  
  const handleCreateStrategy = () => {
    setIsCreateModalOpen(true);
  };
  
  const handleDeleteStrategy = async (id: string) => {
    if (confirm('Are you sure you want to delete this strategy? This action cannot be undone.')) {
      try {
        await deleteStrategy(id);
      } catch (error) {
        console.error('Error deleting strategy:', error);
      }
    }
  };
  
  const handleCloneStrategy = async (id: string, name: string) => {
    try {
      const cloned = await cloneStrategy(id, `${name} (Copy)`);
      router.push(`/strategies/${cloned.id}`);
    } catch (error) {
      console.error('Error cloning strategy:', error);
    }
  };
  
  const handleShareStrategy = async (id: string, makePublic: boolean) => {
    try {
      await shareStrategy(id, makePublic);
    } catch (error) {
      console.error('Error sharing strategy:', error);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>Strategy Builder | CERBERUS Bot</title>
        </Head>
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Strategy Builder</h1>
              <p className="text-gray-400">Create, test, and deploy custom trading strategies</p>
            </div>
            
            <div className="flex flex-wrap mt-4 md:mt-0 gap-2">
              <button
                onClick={handleCreateStrategy}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Strategy
              </button>
              
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                </svg>
                Use Template
              </button>
              
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                Import
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900 bg-opacity-20 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row mb-6 gap-3">
            <div className="md:flex-1 relative">
              <input
                type="text"
                placeholder="Search strategies..."
                className="w-full bg-gray-800 text-white rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            <div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'latest' | 'name' | 'performance')}
                className="bg-gray-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Sort strategies by"
              >
                <option value="latest">Recently Updated</option>
                <option value="name">Name (A-Z)</option>
                <option value="performance">Performance</option>
              </select>
            </div>
          </div>
          
          {/* Strategies List */}
          <div className="mt-4">
            {isLoading ? (
              <div className="p-16 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredStrategies.length > 0 ? (
              <StrategiesList
                strategies={filteredStrategies}
                onDelete={handleDeleteStrategy}
                onClone={handleCloneStrategy}
                onShare={handleShareStrategy}
              />
            ) : (
              <div className="bg-gray-800 rounded-lg p-16 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-400">No strategies found</h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm ? 'Try adjusting your search' : 'Get started by creating a new strategy'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCreateStrategy}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white"
                  >
                    Create Your First Strategy
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Community Strategies Teaser */}
          <div className="mt-12 bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Community Strategies</h2>
              <Link href="/strategies/community" className="text-indigo-400 hover:text-indigo-300">
                View All
              </Link>
            </div>
            <p className="text-gray-400 mb-4">
              Discover and leverage trading strategies created by the community. Learn from others or share your own successful strategies.
            </p>
            <div className="flex space-x-2">
              <Link 
                href="/strategies/community" 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white"
              >
                Browse Community Strategies
              </Link>
              <Link 
                href="/strategies/leaderboard" 
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </main>
        
        {/* Modals */}
        {isTemplateModalOpen && (
          <StrategyTemplatesModal onClose={() => setIsTemplateModalOpen(false)} />
        )}
        
        {isImportModalOpen && (
          <ImportStrategyModal onClose={() => setIsImportModalOpen(false)} />
        )}
        
        {isCreateModalOpen && (
          <CreateStrategyModal onClose={() => setIsCreateModalOpen(false)} />
        )}
      </div>
    </ProtectedRoute>
  );
}