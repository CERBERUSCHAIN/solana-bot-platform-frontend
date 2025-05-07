// CERBERUS Bot - Filter Bar Component
// Created: 2025-05-06 02:19:53 UTC
// Author: CERBERUSCHAIN

import React from 'react';
import { BotType, BotStatus } from '../../types/bot';

interface FilterBarProps {
  filters: {
    type: BotType | 'all';
    status: BotStatus | 'all';
    search: string;
  };
  onFilterChange: (filters: {
    type: BotType | 'all';
    status: BotStatus | 'all';
    search: string;
  }) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 bg-gray-800 p-4 rounded-lg mt-4">
      <div className="flex items-center">
        <label 
          htmlFor="bot-type-filter" 
          className="text-sm text-gray-400 mr-2"
          id="bot-type-label"
        >
          Type:
        </label>
        <select 
          id="bot-type-filter"
          className="bg-gray-700 text-white text-sm rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
          value={filters.type}
          onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" onFilterChange({ ...filters, type: e.target.value as BotType | 'all' })}
          aria-labelledby="bot-type-label"
        >
          <option value="all">All Types</option>
          <option value="bundle">Bundle</option>
          <option value="bump">Bump</option>
          <option value="volume">Volume</option>
          <option value="sniper">Sniper</option>
          <option value="comment">Comment</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <label 
          htmlFor="bot-status-filter" 
          className="text-sm text-gray-400 mr-2"
          id="bot-status-label"
        >
          Status:
        </label>
        <select 
          id="bot-status-filter"
          className="bg-gray-700 text-white text-sm rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
          value={filters.status}
          onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" onFilterChange({ ...filters, status: e.target.value as BotStatus | 'all' })}
          aria-labelledby="bot-status-label"
        >
          <option value="all">All Statuses</option>
          <option value="idle">Idle</option>
          <option value="running">Running</option>
          <option value="paused">Paused</option>
          <option value="error">Error</option>
          <option value="stopped">Stopped</option>
        </select>
      </div>
      
      <div className="flex-1">
        <div className="relative">
          <label htmlFor="bot-search" className="sr-only">Search bots</label>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            id="bot-search"
            type="text"
            className="w-full bg-gray-700 text-white text-sm rounded-lg pl-10 p-2 border-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by bot name or token..."
            value={filters.search}
            onChange={(e) = aria-label="Input field" aria-label="Input field"> onFilterChange({ ...filters, search: e.target.value })}
            aria-label="Search bots"
          />
        </div>
      </div>
      
      <button 
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
        onClick={() => {
          // In a real app, this would create a new bot or navigate to the bot creation page
          alert('Create a new bot');
        }}
      >
        + New Bot
      </button>
    </div>
  );
};
