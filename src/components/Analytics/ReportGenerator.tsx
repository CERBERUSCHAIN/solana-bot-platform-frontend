// CERBERUS Bot - Report Generator Component
// Created: 2025-05-06 16:45:54 UTC
// Author: CERBERUSCHAINYou choose

import React, { useState } from 'react';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import { useBot } from '../../contexts/BotContext';
import { ReportConfig } from '../../types/analytics';

interface ReportGeneratorProps {
  onClose: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onClose }) => {
  const { bots } = useBot();
  const { generateReport, exportData, isLoading } = useAnalytics();
  
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: `CERBERUS Report - ${new Date().toLocaleDateString()}`,
    timeframe: 'month',
    metrics: ['profitLoss', 'volume', 'botPerformance', 'tradeBreakdown'],
    format: 'dashboard'
  });
  const [selectedBotIds, setSelectedBotIds] = useState<string[]>([]);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  
  const handleTimeframeChange = (timeframe: 'day' | 'week' | 'month' | 'year' | 'custom') => {
    setReportConfig({
      ...reportConfig,
      timeframe,
      startDate: timeframe === 'custom' ? customDateRange.startDate : undefined,
      endDate: timeframe === 'custom' ? customDateRange.endDate : undefined
    });
  };
  
  const handleMetricToggle = (metric: string) => {
    const metrics = [...reportConfig.metrics];
    
    if (metrics.includes(metric as any)) {
      // Remove metric
      setReportConfig({
        ...reportConfig,
        metrics: metrics.filter(m => m !== metric)
      });
    } else {
      // Add metric
      setReportConfig({
        ...reportConfig,
        metrics: [...metrics, metric as any]
      });
    }
  };
  
  const handleBotToggle = (botId: string) => {
    if (selectedBotIds.includes(botId)) {
      setSelectedBotIds(selectedBotIds.filter(id => id !== botId));
    } else {
      setSelectedBotIds([...selectedBotIds, botId]);
    }
  };
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      const config: ReportConfig = {
        ...reportConfig,
        botIds: selectedBotIds.length > 0 ? selectedBotIds : undefined,
        startDate: reportConfig.timeframe === 'custom' ? customDateRange.startDate : undefined,
        endDate: reportConfig.timeframe === 'custom' ? customDateRange.endDate : undefined
      };
      
      const data = await generateReport(config);
      setReportData(data);
      
      if (reportConfig.format !== 'dashboard') {
        // Export the file if not dashboard format
        await exportData(data, reportConfig.format as 'csv' | 'pdf');
        onClose();
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Generate Analytics Report</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {reportData ? (
          <div>
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">Report Generated</h4>
              <p className="text-gray-400 mb-4">
                Your report has been successfully generated.
              </p>
              
              {/* Display summary metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Net Profit/Loss</div>
                  <div className={`text-lg font-medium ${reportData.summary.netProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${reportData.summary.netProfitLoss.toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Total Volume</div>
                  <div className="text-lg font-medium">
                    ${reportData.summary.totalVolume.toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Success Rate</div>
                  <div className="text-lg font-medium">
                    {reportData.summary.successRate.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => exportData(reportData, 'csv')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                  disabled={isLoading}
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => exportData(reportData, 'pdf')}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                  disabled={isLoading}
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => setReportData(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                >
                  Create Another Report
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Report Configuration Form */}
            <div className="space-y-6">
              {/* Report Name */}
              <div>
                <label htmlFor="report-name" className="block text-sm font-medium text-gray-400 mb-1">
                  Report Name
                </label>
                <input
                  id="report-name"
                  type="text"
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={reportConfig.name}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setReportConfig({ ...reportConfig, name: e.target.value })}
                />
              </div>
              
              {/* Timeframe Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Timeframe
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    className={`px-3 py-2 rounded text-sm ${
                      reportConfig.timeframe === 'day' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => handleTimeframeChange('day')}
                  >
                    24 Hours
                  </button>
                  <button
                    className={`px-3 py-2 rounded text-sm ${
                      reportConfig.timeframe === 'week' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => handleTimeframeChange('week')}
                  >
                    7 Days
                  </button>
                  <button
                    className={`px-3 py-2 rounded text-sm ${
                      reportConfig.timeframe === 'month' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => handleTimeframeChange('month')}
                  >
                    30 Days
                  </button>
                  <button
                    className={`px-3 py-2 rounded text-sm ${
                      reportConfig.timeframe === 'year' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => handleTimeframeChange('year')}
                  >
                    1 Year
                  </button>
                  <button
                    className={`px-3 py-2 rounded text-sm ${
                      reportConfig.timeframe === 'custom' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => handleTimeframeChange('custom')}
                  >
                    Custom
                  </button>
                </div>
                
                {reportConfig.timeframe === 'custom' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label htmlFor="start-date" className="block text-sm text-gray-400 mb-1">
                        Start Date
                      </label>
                      <input
                        id="start-date"
                        type="date"
                        className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        value={customDateRange.startDate}
                        onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setCustomDateRange({ ...customDateRange, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="end-date" className="block text-sm text-gray-400 mb-1">
                        End Date
                      </label>
                      <input
                        id="end-date"
                        type="date"
                        className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        value={customDateRange.endDate}
                        onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setCustomDateRange({ ...customDateRange, endDate: e.target.value })}
                        min={customDateRange.startDate}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bot Selection */}
              <div>
                <label className="flex items-center justify-between text-sm font-medium text-gray-400 mb-2">
                  <span>Select Bots (Optional)</span>
                  <span className="text-xs text-gray-500">Leave empty for all bots</span>
                </label>
                <div className="bg-gray-700 rounded p-3 max-h-40 overflow-y-auto">
                  {bots.length === 0 ? (
                    <div className="text-gray-500 text-sm">No bots available</div>
                  ) : (
                    <div className="space-y-2">
                      {bots.map((bot) => (
                        <div key={bot.id} className="flex items-center">
                          <input
                            id={`bot-${bot.id}`}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
                            checked={selectedBotIds.includes(bot.id)}
                            onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleBotToggle(bot.id)}
                          />
                          <label htmlFor={`bot-${bot.id}`} className="ml-2 text-sm text-gray-300">
                            {bot.name} <span className="text-gray-500">({bot.type})</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Metrics Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Metrics to Include
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input
                      id="metric-profit-loss"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
                      checked={reportConfig.metrics.includes('profitLoss')}
                      onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleMetricToggle('profitLoss')}
                    />
                    <label htmlFor="metric-profit-loss" className="ml-2 text-sm text-gray-300">
                      Profit/Loss
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="metric-volume"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
                      checked={reportConfig.metrics.includes('volume')}
                      onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleMetricToggle('volume')}
                    />
                    <label htmlFor="metric-volume" className="ml-2 text-sm text-gray-300">
                      Volume
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="metric-fees"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
                      checked={reportConfig.metrics.includes('fees')}
                      onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleMetricToggle('fees')}
                    />
                    <label htmlFor="metric-fees" className="ml-2 text-sm text-gray-300">
                      Fees
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="metric-success-rate"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
                      checked={reportConfig.metrics.includes('successRate')}
                      onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleMetricToggle('successRate')}
                    />
                    <label htmlFor="metric-success-rate" className="ml-2 text-sm text-gray-300">
                      Success Rate
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="metric-execution-time"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
                      checked={reportConfig.metrics.includes('executionTime')}
                      onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleMetricToggle('executionTime')}
                    />
                    <label htmlFor="metric-execution-time" className="ml-2 text-sm text-gray-300">
                      Execution Time
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="metric-token-distribution"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
                      checked={reportConfig.metrics.includes('tokenDistribution')}
                      onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleMetricToggle('tokenDistribution')}
                    />
                    <label htmlFor="metric-token-distribution" className="ml-2 text-sm text-gray-300">
                      Token Distribution
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="metric-bot-performance"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
                      checked={reportConfig.metrics.includes('botPerformance')}
                      onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleMetricToggle('botPerformance')}
                    />
                    <label htmlFor="metric-bot-performance" className="ml-2 text-sm text-gray-300">
                      Bot Performance
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="metric-trade-breakdown"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
                      checked={reportConfig.metrics.includes('tradeBreakdown')}
                      onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleMetricToggle('tradeBreakdown')}
                    />
                    <label htmlFor="metric-trade-breakdown" className="ml-2 text-sm text-gray-300">
                      Trade Breakdown
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Report Format
                </label>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-2 rounded text-sm ${
                      reportConfig.format === 'dashboard' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => setReportConfig({ ...reportConfig, format: 'dashboard' })}
                  >
                    Dashboard
                  </button>
                  <button
                    className={`px-3 py-2 rounded text-sm ${
                      reportConfig.format === 'csv' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => setReportConfig({ ...reportConfig, format: 'csv' })}
                  >
                    CSV File
                  </button>
                  <button
                    className={`px-3 py-2 rounded text-sm ${
                      reportConfig.format === 'pdf' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => setReportConfig({ ...reportConfig, format: 'pdf' })}
                  >
                    PDF File
                  </button>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center"
                disabled={isGenerating || reportConfig.metrics.length === 0}
              >
                {isGenerating && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
