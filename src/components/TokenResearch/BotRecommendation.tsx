// CERBERUS Bot - Bot Recommendation Component
// Created: 2025-05-06 16:12:48 UTC
// Author: CERBERUSCHAINnext

import React from 'react';

interface BotRecommendationProps {
  recommendation: {
    botType: string;
    confidence: number;
    configuration: Record<string, any>;
  };
  onCreateBot: (botType: string, config: any) => void;
}

export const BotRecommendation: React.FC<BotRecommendationProps> = ({ 
  recommendation, 
  onCreateBot 
}) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
      <div className="p-5 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{recommendation.botType} Bot</h3>
          <div className="flex items-center">
            <span className="text-sm text-gray-400 mr-2">Confidence:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              recommendation.confidence >= 80 ? 'bg-green-900 bg-opacity-30 text-green-400' :
              recommendation.confidence >= 50 ? 'bg-blue-900 bg-opacity-30 text-blue-400' :
              'bg-yellow-900 bg-opacity-30 text-yellow-400'
            }`}>
              {Math.round(recommendation.confidence)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Recommended Configuration</h4>
          <div className="bg-gray-900 rounded p-3 overflow-x-auto">
            <pre className="text-xs text-gray-300 font-mono">
              {JSON.stringify(recommendation.configuration, null, 2)}
            </pre>
          </div>
        </div>
        
        {getBotDescription(recommendation.botType)}
        
        <div className="mt-5 flex justify-end">
          <button
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
            onClick={() => onCreateBot(recommendation.botType, recommendation.configuration)}
          >
            Create Bot
          </button>
        </div>
      </div>
    </div>
  );
};

function getBotDescription(botType: string): JSX.Element {
  switch (botType.toLowerCase()) {
    case 'bundle':
      return (
        <div className="text-sm text-gray-400">
          <p>Bundle bots execute transactions in bundles for increased efficiency, leveraging MEV protection.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Optimizes transaction execution</li>
            <li>Reduces frontrunning risk</li>
            <li>Provides priority fee customization</li>
          </ul>
        </div>
      );
    case 'bump':
      return (
        <div className="text-sm text-gray-400">
          <p>Bump bots keep tokens visible by creating regular transaction activity at specified intervals.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Increases token visibility</li>
            <li>Creates consistent trading volume</li>
            <li>Customizable transaction frequency</li>
          </ul>
        </div>
      );
    case 'volume':
      return (
        <div className="text-sm text-gray-400">
          <p>Volume bots create artificial trading volume with configurable patterns to attract attention.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Creates strategic volume patterns</li>
            <li>Increases market visibility</li>
            <li>Multiple strategy options</li>
          </ul>
        </div>
      );
    case 'sniper':
      return (
        <div className="text-sm text-gray-400">
          <p>Sniper bots execute trades when specific market conditions are met for optimal entry/exit.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Monitors market conditions</li>
            <li>Executes trades at optimal moments</li>
            <li>Customizable trigger conditions</li>
          </ul>
        </div>
      );
    case 'comment':
      return (
        <div className="text-sm text-gray-400">
          <p>Comment bots automate social media engagement to increase visibility and sentiment.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Posts across multiple platforms</li>
            <li>Customizable comment templates</li>
            <li>Strategic posting schedules</li>
          </ul>
        </div>
      );
    default:
      return (
        <div className="text-sm text-gray-400">
          <p>This bot type is designed to optimize trading strategies for this specific token.</p>
        </div>
      );
  }
}