// CERBERUS Bot - Timeframe Selector Component
// Created: 2025-05-06 16:45:54 UTC
// Author: CERBERUSCHAINYou choose

import React from 'react';

interface TimeframeSelectorProps {
  value: 'day' | 'week' | 'month' | 'year' | 'all';
  onChange: (timeframe: 'day' | 'week' | 'month' | 'year' | 'all') => void;
  disabled?: boolean;
  includeAll?: boolean;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  includeAll = true
}) => {
  const timeframes = [
    { value: 'day', label: '24H' },
    { value: 'week', label: '7D' },
    { value: 'month', label: '30D' },
    { value: 'year', label: '1Y' },
  ];
  
  if (includeAll) {
    timeframes.push({ value: 'all', label: 'All' });
  }

  return (
    <div className="inline-flex bg-gray-800 rounded-lg p-1">
      {timeframes.map((timeframe) => (
        <button
          key={timeframe.value}
          className={`px-4 py-1.5 rounded text-sm font-medium ${
            value === timeframe.value
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => onChange(timeframe.value as any)}
          disabled={disabled}
        >
          {timeframe.label}
        </button>
      ))}
    </div>
  );
};