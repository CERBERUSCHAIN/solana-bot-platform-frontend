// CERBERUS Bot - Token Analysis Summary Component
// Created: 2025-05-06 16:12:48 UTC
// Author: CERBERUSCHAINnext

import React from 'react';

interface TokenAnalysisSummaryProps {
  analysis: {
    buySignalStrength: number;
    sellSignalStrength: number;
    botRecommendations: Array<{
      botType: string;
      confidence: number;
      configuration: Record<string, any>;
    }>;
    risks: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
  } | null;
  isLoading: boolean;
  onBotCreate: (botType: string, config: any) => void;
}

export const TokenAnalysisSummary: React.FC<TokenAnalysisSummaryProps> = ({ 
  analysis, 
  isLoading,
  onBotCreate 
}) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-700"></div>
          <div className="mt-4 text-gray-500">Analyzing token data...</div>
        </div>
      </div>
    );
  }
  
  if (!analysis) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">No analysis data available for this token.</p>
      </div>
    );
  }
  
  const renderSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900 bg-opacity-30 text-green-400">
            Low
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-900 bg-opacity-30 text-yellow-400">
            Medium
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-900 bg-opacity-30 text-red-400">
            High
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Signal Strength */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-medium mb-4">Trading Signals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buy Signal */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Buy Signal</span>
              <span className={`text-sm font-medium ${
                analysis.buySignalStrength >= 70 ? 'text-green-400' :
                analysis.buySignalStrength >= 40 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {analysis.buySignalStrength}/100
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  analysis.buySignalStrength >= 70 ? 'bg-green-500' :
                  analysis.buySignalStrength >= 40 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${analysis.buySignalStrength}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {analysis.buySignalStrength >= 70 
                ? 'Strong buy signal. Consider entering a position.' 
                : analysis.buySignalStrength >= 40
                  ? 'Moderate buy signal. Consider with caution.'
                  : 'Weak buy signal. Better opportunities may exist.'}
            </div>
          </div>
          
          {/* Sell Signal */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Sell Signal</span>
              <span className={`text-sm font-medium ${
                analysis.sellSignalStrength >= 70 ? 'text-red-400' :
                analysis.sellSignalStrength >= 40 ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {analysis.sellSignalStrength}/100
              </span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  analysis.sellSignalStrength >= 70 ? 'bg-red-500' :
                  analysis.sellSignalStrength >= 40 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${analysis.sellSignalStrength}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {analysis.sellSignalStrength >= 70 
                ? 'Strong sell signal. Consider exiting positions.' 
                : analysis.sellSignalStrength >= 40
                  ? 'Moderate sell pressure. Monitor closely.'
                  : 'Low sell pressure. Holding may be appropriate.'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bot Recommendations */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-medium mb-4">Bot Recommendations</h3>
        
        {analysis.botRecommendations.length === 0 ? (
          <p className="text-gray-400">No bot recommendations available for this token.</p>
        ) : (
          <div className="space-y-4">
            {analysis.botRecommendations.map((recommendation, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium">{recommendation.botType} Bot</h4>
                    <p className="text-sm text-gray-400">Confidence: {recommendation.confidence.toFixed(0)}%</p>
                  </div>
                  <button 
                    onClick={() => onBotCreate(recommendation.botType, recommendation.configuration)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm"
                  >
                    Create Bot
                  </button>
                </div>
                
                <div className="mt-3">
                  <div className="text-sm text-gray-400 mb-1">Suggested Configuration:</div>
                  <div className="bg-gray-800 rounded p-2 overflow-x-auto">
                    <pre className="text-xs font-mono text-gray-300">
                      {JSON.stringify(recommendation.configuration, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Risk Assessment */}
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Risk Assessment</h3>
        
        {analysis.risks.length === 0 ? (
          <p className="text-gray-400">No risk factors identified for this token.</p>
        ) : (
          <div className="space-y-3">
            {analysis.risks.map((risk, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 mr-3">
                  {risk.severity === 'high' ? (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                  ) : risk.severity === 'medium' ? (
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                    </svg>
                  )}
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium mr-2">{risk.type}</h4>
                    {renderSeverityBadge(risk.severity)}
                  </div>
                  <p className="mt-1 text-sm text-gray-400">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};