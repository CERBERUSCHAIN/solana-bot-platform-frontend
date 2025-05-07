// CERBERUS Bot - Strategies List Component
// Created: 2025-05-06 21:59:40 UTC
// Author: CERBERUSCHAINYes

import React, { useState } from 'react';
import Link from 'next/link';
import { Strategy } from '../../types/strategy';
import { formatDistanceToNow } from 'date-fns';

interface StrategiesListProps {
  strategies: Strategy[];
  onDelete: (id: string) => void;
  onClone: (id: string, name: string) => void;
  onShare: (id: string, makePublic: boolean) => void;
}

export const StrategiesList: React.FC<StrategiesListProps> = ({
  strategies,
  onDelete,
  onClone,
  onShare
}) => {
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  
  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const getPerformanceBadge = (strategy: Strategy) => {
    const profitPercentage = strategy.performance?.backtestResults?.profitPercentage;
    
    if (profitPercentage === undefined) {
      return <span className="text-sm text-gray-500">Not tested</span>;
    }
    
    if (profitPercentage > 15) {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-900 bg-opacity-20 text-green-400">+{profitPercentage.toFixed(2)}%</span>;
    } else if (profitPercentage > 0) {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-900 bg-opacity-20 text-green-300">+{profitPercentage.toFixed(2)}%</span>;
    } else if (profitPercentage === 0) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">0.00%</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-900 bg-opacity-20 text-red-400">{profitPercentage.toFixed(2)}%</span>;
    }
  };
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {strategies.map(strategy => (
        <div
          key={strategy.id}
          className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/strategies/${strategy.id}`} className="text-lg font-medium text-white hover:text-indigo-400">
                  {strategy.name}
                </Link>
                
                <div className="mt-1 flex items-center space-x-2">
                  {strategy.public && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-900 bg-opacity-20 text-indigo-400">
                      Public
                    </span>
                  )}
                  {strategy.isActive && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-900 bg-opacity-20 text-green-400">
                      Active
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    Updated {formatTime(strategy.updatedAt)}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setActionMenuOpen(actionMenuOpen === strategy.id ? null : strategy.id)}
                  className="p-2 text-gray-400 hover:text-gray-300 rounded-full hover:bg-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </button>
                
                {actionMenuOpen === strategy.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-850 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <Link 
                        href={`/strategies/${strategy.id}`} 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        onClick={() => setActionMenuOpen(null)}
                      >
                        Edit Strategy
                      </Link>
                      
                      <button
                        onClick={() => {
                          onClone(strategy.id, strategy.name);
                          setActionMenuOpen(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Clone Strategy
                      </button>
                      
                      <button
                        onClick={() => {
                          onShare(strategy.id, !strategy.public);
                          setActionMenuOpen(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        {strategy.public ? 'Make Private' : 'Make Public'}
                      </button>
                      
                      <button
                        onClick={() => {
                          onDelete(strategy.id);
                          setActionMenuOpen(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
                      >
                        Delete Strategy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {strategy.description && (
              <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                {strategy.description}
              </p>
            )}
          </div>
          
          <div className="bg-gray-750 p-3 border-t border-gray-700 flex items-center justify-between">
            <div className="flex space-x-6">
              <div>
                <div className="text-xs text-gray-400">Performance</div>
                <div className="mt-1">{getPerformanceBadge(strategy)}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-400">Elements</div>
                <div className="mt-1 text-sm text-gray-300">
                  {Object.keys(strategy.elements).length} element{Object.keys(strategy.elements).length !== 1 ? 's' : ''}
                </div>
              </div>
              
              {strategy.tags && strategy.tags.length > 0 && (
                <div>
                  <div className="text-xs text-gray-400">Tags</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {strategy.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {strategy.tags.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{strategy.tags.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              href={`/strategies/${strategy.id}`}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded text-xs text-white"
            >
              Open
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};