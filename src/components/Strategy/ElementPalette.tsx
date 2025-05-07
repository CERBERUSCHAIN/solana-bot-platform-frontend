// CERBERUS Bot - Strategy Element Palette Component
// Created: 2025-05-06 21:28:38 UTC
// Author: CERBERUSCHAINContinue please.

import React, { useState } from 'react';
import { StrategyElementType } from '../../types/strategy';

interface ElementPaletteProps {
  onElementSelect: (element: {
    type: StrategyElementType;
    name: string;
    category: 'trigger' | 'condition' | 'indicator' | 'action' | 'logic';
  }) => void;
}

export const ElementPalette: React.FC<ElementPaletteProps> = ({ onElementSelect }) => {
  const [activeCategory, setActiveCategory] = useState<'trigger' | 'condition' | 'indicator' | 'action' | 'logic'>('trigger');
  
  // Element definitions grouped by category
  const elements = {
    trigger: [
      { type: StrategyElementType.PRICE_MOVEMENT, name: 'Price Movement' },
      { type: StrategyElementType.TIME_TRIGGER, name: 'Time Trigger' },
      { type: StrategyElementType.INDICATOR_CROSS, name: 'Indicator Cross' },
      { type: StrategyElementType.VOLUME_SPIKE, name: 'Volume Spike' },
      { type: StrategyElementType.PRICE_THRESHOLD, name: 'Price Threshold' },
    ],
    condition: [
      { type: StrategyElementType.HIGHER_THAN, name: 'Higher Than' },
      { type: StrategyElementType.LOWER_THAN, name: 'Lower Than' },
      { type: StrategyElementType.BETWEEN, name: 'Between Range' },
      { type: StrategyElementType.OUTSIDE, name: 'Outside Range' },
      { type: StrategyElementType.EQUALS, name: 'Equals' },
    ],
    indicator: [
      { type: StrategyElementType.MOVING_AVERAGE, name: 'Moving Average' },
      { type: StrategyElementType.RSI, name: 'RSI' },
      { type: StrategyElementType.MACD, name: 'MACD' },
      { type: StrategyElementType.BOLLINGER_BANDS, name: 'Bollinger Bands' },
      { type: StrategyElementType.STOCHASTIC, name: 'Stochastic' },
    ],
    action: [
      { type: StrategyElementType.BUY, name: 'Buy' },
      { type: StrategyElementType.SELL, name: 'Sell' },
      { type: StrategyElementType.ALERT, name: 'Alert' },
      { type: StrategyElementType.SWAP, name: 'Swap' },
      { type: StrategyElementType.LIMIT_ORDER, name: 'Limit Order' },
      { type: StrategyElementType.STOP_LOSS, name: 'Stop Loss' },
      { type: StrategyElementType.TAKE_PROFIT, name: 'Take Profit' },
    ],
    logic: [
      { type: StrategyElementType.AND, name: 'AND' },
      { type: StrategyElementType.OR, name: 'OR' },
      { type: StrategyElementType.NOT, name: 'NOT' },
      { type: StrategyElementType.IF_THEN, name: 'IF-THEN' },
      { type: StrategyElementType.IF_THEN_ELSE, name: 'IF-THEN-ELSE' },
    ],
  };
  
  // Icons for each category
  const categoryIcons = {
    trigger: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
      </svg>
    ),
    condition: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
      </svg>
    ),
    indicator: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
    ),
    action: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
    ),
    logic: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
    )
  };
  
  // Element colors by category
  const categoryColors = {
    trigger: 'bg-blue-900 bg-opacity-30 border-blue-500 text-blue-400',
    condition: 'bg-yellow-900 bg-opacity-30 border-yellow-500 text-yellow-400',
    indicator: 'bg-purple-900 bg-opacity-30 border-purple-500 text-purple-400',
    action: 'bg-green-900 bg-opacity-30 border-green-500 text-green-400',
    logic: 'bg-indigo-900 bg-opacity-30 border-indigo-500 text-indigo-400'
  };
  
  const handleElementClick = (element: { type: StrategyElementType; name: string }) => {
    onElementSelect({
      ...element,
      category: activeCategory
    });
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-medium">Elements</h2>
        <p className="text-sm text-gray-400">Drag elements to the canvas</p>
      </div>
      
      {/* Category Tabs */}
      <div className="flex border-b border-gray-700">
        {(Object.keys(elements) as Array<keyof typeof elements>).map((category) => (
          <button
            key={category}
            className={`flex-1 py-2 text-xs font-medium uppercase tracking-wider ${
              activeCategory === category 
                ? 'border-b-2 border-indigo-500 text-indigo-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Element List */}
      <div className="flex-1 overflow-y-auto p-2">
        {elements[activeCategory].map((element) => (
          <div
            key={element.type}
            className={`mb-2 p-3 border rounded cursor-grab ${categoryColors[activeCategory]}`}
            draggable
            onClick={() => handleElementClick(element)}
          >
            <div className="flex items-center">
              <div className="mr-3">
                {categoryIcons[activeCategory]}
              </div>
              <div>
                <div className="font-medium">{element.name}</div>
                <div className="text-xs opacity-75">{getElementDescription(element.type)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Search (optional) */}
      <div className="p-2 border-t border-gray-700">
        <input
          type="text"
          placeholder="Search elements..."
          className="w-full bg-gray-700 text-white rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        / aria-label="Input field" aria-label="Input field">
      </div>
    </div>
  );
};

// Helper function to get element descriptions
function getElementDescription(type: StrategyElementType): string {
  switch (type) {
    // Triggers
    case StrategyElementType.PRICE_MOVEMENT:
      return "Triggers on price movements";
    case StrategyElementType.TIME_TRIGGER:
      return "Triggers at specific times";
    case StrategyElementType.INDICATOR_CROSS:
      return "Triggers when indicators cross";
    case StrategyElementType.VOLUME_SPIKE:
      return "Triggers on volume increases";
    case StrategyElementType.PRICE_THRESHOLD:
      return "Triggers at price levels";

    // Conditions
    case StrategyElementType.HIGHER_THAN:
      return "Checks if value is higher";
    case StrategyElementType.LOWER_THAN:
      return "Checks if value is lower";
    case StrategyElementType.BETWEEN:
      return "Checks if value is in range";
    case StrategyElementType.OUTSIDE:
      return "Checks if value is out of range";
    case StrategyElementType.EQUALS:
      return "Checks if values are equal";

    // Indicators
    case StrategyElementType.MOVING_AVERAGE:
      return "Simple/Exponential Moving Average";
    case StrategyElementType.RSI:
      return "Relative Strength Index";
    case StrategyElementType.MACD:
      return "Moving Average Convergence Divergence";
    case StrategyElementType.BOLLINGER_BANDS:
      return "Volatility bands";
    case StrategyElementType.STOCHASTIC:
      return "Stochastic Oscillator";

    // Actions
    case StrategyElementType.BUY:
      return "Buy at market price";
    case StrategyElementType.SELL:
      return "Sell at market price";
    case StrategyElementType.ALERT:
      return "Send notification alert";
    case StrategyElementType.SWAP:
      return "Swap tokens at market price";
    case StrategyElementType.LIMIT_ORDER:
      return "Place a limit order";
    case StrategyElementType.STOP_LOSS:
      return "Set a stop loss";
    case StrategyElementType.TAKE_PROFIT:
      return "Set a take profit target";

    // Logic
    case StrategyElementType.AND:
      return "Logical AND operator";
    case StrategyElementType.OR:
      return "Logical OR operator";
    case StrategyElementType.NOT:
      return "Logical NOT operator";
    case StrategyElementType.IF_THEN:
      return "If condition then action";
    case StrategyElementType.IF_THEN_ELSE:
      return "If condition then A else B";

    default:
      return "";
  }
}