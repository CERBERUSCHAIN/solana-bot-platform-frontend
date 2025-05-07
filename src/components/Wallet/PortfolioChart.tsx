// CERBERUS Bot - Portfolio Chart Component
// Created: 2025-05-06 23:36:46 UTC
// Author: CERBERUSCHAINPortfolio Dashboard page (portfolio.tsx) is NOT complete

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface PortfolioChartProps {
  data: Array<{ date: string; value: number }>;
  timeframe: 'day' | 'week' | 'month' | 'year' | 'all';
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ data, timeframe }) => {
  // Format dates based on timeframe
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    
    switch (timeframe) {
      case 'day':
        return dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      case 'week':
        return dateObj.toLocaleDateString(undefined, { weekday: 'short' });
      case 'month':
        return dateObj.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
      case 'year':
        return dateObj.toLocaleDateString(undefined, { month: 'short' });
      case 'all':
        return dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
      default:
        return dateObj.toLocaleDateString();
    }
  };
  
  // Calculate if trend is positive (determine line color)
  const isPositiveTrend = useMemo(() => {
    if (data.length < 2) return true;
    return data[data.length - 1].value >= data[0].value;
  }, [data]);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dateString = payload[0].payload.date;
      const value = payload[0].value;
      
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-md shadow-lg">
          <p className="text-gray-400">{formatDate(dateString)}</p>
          <p className="text-white font-medium">${value.toLocaleString()}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isPositiveTrend ? "#10B981" : "#EF4444"} stopOpacity={0.8} />
              <stop offset="95%" stopColor={isPositiveTrend ? "#10B981" : "#EF4444"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#9CA3AF' }} 
            tickFormatter={formatDate}
            tickLine={{ stroke: '#4B5563' }}
            axisLine={{ stroke: '#4B5563' }}
          />
          <YAxis 
            tick={{ fill: '#9CA3AF' }}
            tickLine={{ stroke: '#4B5563' }}
            axisLine={{ stroke: '#4B5563' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            domain={['dataMin - 1%', 'dataMax + 1%']}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={data[0]?.value} stroke="#6B7280" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={isPositiveTrend ? "#10B981" : "#EF4444"} 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, stroke: isPositiveTrend ? "#059669" : "#DC2626", strokeWidth: 2, fill: "#1F2937" }}
            fillOpacity={0.2}
            fill="url(#colorValue)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};