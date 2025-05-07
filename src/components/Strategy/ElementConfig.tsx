// CERBERUS Bot - Element Configuration Component 
// Created: 2025-05-06 21:53:14 UTC
// Author: CERBERUSCHAINYou coding has frozen, StrategyCanvas.tsx is NOT complete

import React, { useState, useEffect } from 'react';
import { 
  Strategy, 
  StrategyElementUnion, 
  StrategyElementType,
  IndicatorElement,
  ConditionElement,
  TriggerElement,
  ActionElement,
  LogicElement,
  TimeInterval
} from '../../types/strategy';
import { useStrategy } from '../../contexts/StrategyContext';

interface ElementConfigProps {
  element: StrategyElementUnion;
  strategy: Strategy;
  onClose: () => void;
  onUpdate: (updatedElement: StrategyElementUnion) => void;
}

export const ElementConfig: React.FC<ElementConfigProps> = ({ 
  element, 
  strategy, 
  onClose, 
  onUpdate 
}) => {
  const { updateStrategyElement, deleteStrategyElement } = useStrategy();
  const [name, setName] = useState(element.name);
  const [parameters, setParameters] = useState<Record<string, any>>(
    'parameters' in element ? { ...element.parameters } : {}
  );
  const [elementOptions, setElementOptions] = useState<{
    leftOperandId?: string;
    rightOperandId?: string;
    secondaryOperandId?: string;
    interval?: TimeInterval;
    childIds?: string[];
  }>({
    leftOperandId: 'leftOperandId' in element ? element.leftOperandId : undefined,
    rightOperandId: 'rightOperandId' in element ? element.rightOperandId : undefined,
    secondaryOperandId: 'secondaryOperandId' in element ? element.secondaryOperandId : undefined,
    interval: 'interval' in element ? element.interval : undefined,
    childIds: 'childIds' in element ? [...element.childIds] : undefined,
  });
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    setName(element.name);
    setParameters(
      'parameters' in element ? { ...element.parameters } : {}
    );
    setElementOptions({
      leftOperandId: 'leftOperandId' in element ? element.leftOperandId : undefined,
      rightOperandId: 'rightOperandId' in element ? element.rightOperandId : undefined,
      secondaryOperandId: 'secondaryOperandId' in element ? element.secondaryOperandId : undefined,
      interval: 'interval' in element ? element.interval : undefined,
      childIds: 'childIds' in element ? [...element.childIds] : undefined,
    });
  }, [element]);
  
  const handleSubmit = async () => {
    try {
      let updatedElement: Partial<StrategyElementUnion> = { name };
      
      // Add type-specific properties
      if ('parameters' in element) {
        updatedElement.parameters = parameters;
      }
      
      if ('leftOperandId' in element && elementOptions.leftOperandId) {
        updatedElement.leftOperandId = elementOptions.leftOperandId;
      }
      
      if ('rightOperandId' in element && elementOptions.rightOperandId) {
        updatedElement.rightOperandId = elementOptions.rightOperandId;
      }
      
      if ('secondaryOperandId' in element && elementOptions.secondaryOperandId) {
        updatedElement.secondaryOperandId = elementOptions.secondaryOperandId;
      }
      
      if ('interval' in element && elementOptions.interval) {
        updatedElement.interval = elementOptions.interval;
      }
      
      if ('childIds' in element && elementOptions.childIds) {
        updatedElement.childIds = elementOptions.childIds;
      }
      
      const result = await updateStrategyElement(
        strategy.id,
        element.id,
        updatedElement
      );
      
      onUpdate(result);
    } catch (error) {
      console.error('Error updating element:', error);
    }
  };
  
  const handleDelete = async () => {
    if (isDeleting) {
      try {
        await deleteStrategyElement(strategy.id, element.id);
        onClose();
      } catch (error) {
        console.error('Error deleting element:', error);
      }
    } else {
      setIsDeleting(true);
    }
  };
  
  const renderConfigFields = () => {
    switch (element.type) {
      // Indicator Elements
      case StrategyElementType.MOVING_AVERAGE:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
              <select
                value={parameters.type || 'sma'}
                onChange={(e) = aria-label="Element options" aria-label="Selection field" aria-label="Selection field" aria-label="Configuration option" aria-label="Element configuration"> aria-label="Selection field" setParameters({ ...parameters, type: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              >
                <option value="sma">Simple Moving Average (SMA)</option>
                <option value="ema">Exponential Moving Average (EMA)</option>
                <option value="wma">Weighted Moving Average (WMA)</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Period</label>
              <input
                type="number"
                value={parameters.period || 14}
                onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Numeric input" aria-label="Configuration value"> aria-label="Input field" setParameters({ ...parameters, period: parseInt(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                min="1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Price Source</label>
              <select
                value={parameters.source || 'close'}
                onChange={(e) = aria-label="Element options" aria-label="Selection field" aria-label="Selection field" aria-label="Configuration option" aria-label="Element configuration"> aria-label="Selection field" setParameters({ ...parameters, source: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              >
                <option value="close">Close</option>
                <option value="open">Open</option>
                <option value="high">High</option>
                <option value="low">Low</option>
                <option value="hl2">(High + Low) / 2</option>
                <option value="hlc3">(High + Low + Close) / 3</option>
                <option value="ohlc4">(Open + High + Low + Close) / 4</option>
              </select>
            </div>
          </>
        );
        
      case StrategyElementType.RSI:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Period</label>
              <input
                type="number"
                value={parameters.period || 14}
                onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Numeric input" aria-label="Configuration value"> aria-label="Input field" setParameters({ ...parameters, period: parseInt(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                min="1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Overbought Level</label>
              <input
                type="number"
                value={parameters.overbought || 70}
                onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Numeric input" aria-label="Configuration value"> aria-label="Input field" setParameters({ ...parameters, overbought: parseInt(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                min="0"
                max="100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Oversold Level</label>
              <input
                type="number"
                value={parameters.oversold || 30}
                onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Numeric input" aria-label="Configuration value"> aria-label="Input field" setParameters({ ...parameters, oversold: parseInt(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                min="0"
                max="100"
              />
            </div>
          </>
        );
        
      // Action Elements
      case StrategyElementType.BUY:
      case StrategyElementType.SELL:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Amount Type</label>
              <select
                value={parameters.amountType || 'percentage'}
                onChange={(e) = aria-label="Element options" aria-label="Selection field" aria-label="Selection field" aria-label="Configuration option" aria-label="Element configuration"> aria-label="Selection field" setParameters({ ...parameters, amountType: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              >
                <option value="percentage">Percentage of Portfolio</option>
                <option value="fixed">Fixed Amount</option>
                <option value="usd">USD Value</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
              <input
                type="number"
                value={parameters.amount || 100}
                onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Numeric input" aria-label="Configuration value"> aria-label="Input field" setParameters({ ...parameters, amount: parseFloat(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                min="0"
                step={parameters.amountType === 'percentage' ? "1" : "0.0001"}
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={parameters.useStopLoss || false}
                  onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Configuration value"> aria-label="Input field" setParameters({ ...parameters, useStopLoss: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-offset-gray-800"
                />
                <span className="ml-2 text-sm text-gray-400">Use Stop Loss</span>
              </label>
            </div>
            {parameters.useStopLoss && (
              <div className="mb-4 pl-6">
                <label className="block text-sm font-medium text-gray-400 mb-1">Stop Loss (%)</label>
                <input
                  type="number"
                  value={parameters.stopLossPercentage || 5}
                  onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Numeric input" aria-label="Configuration value"> aria-label="Input field" setParameters({ ...parameters, stopLossPercentage: parseFloat(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                  min="0.1"
                  step="0.1"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={parameters.useTakeProfit || false}
                  onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Configuration value"> aria-label="Input field" setParameters({ ...parameters, useTakeProfit: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-offset-gray-800"
                />
                <span className="ml-2 text-sm text-gray-400">Use Take Profit</span>
              </label>
            </div>
            {parameters.useTakeProfit && (
              <div className="mb-4 pl-6">
                <label className="block text-sm font-medium text-gray-400 mb-1">Take Profit (%)</label>
                <input
                  type="number"
                  value={parameters.takeProfitPercentage || 10}
                  onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Numeric input" aria-label="Configuration value"> aria-label="Input field" setParameters({ ...parameters, takeProfitPercentage: parseFloat(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                  min="0.1"
                  step="0.1"
                />
              </div>
            )}
          </>
        );
      
      // Logic Elements
      case StrategyElementType.AND:
      case StrategyElementType.OR:
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Child Elements</label>
            <div className="bg-gray-700 border border-gray-600 rounded-md p-3 max-h-40 overflow-y-auto">
              {elementOptions.childIds?.length ? (
                <ul className="space-y-1">
                  {elementOptions.childIds.map(childId => {
                    const childElement = strategy.elements[childId];
                    return childElement ? (
                      <li key={childId} className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-300">{childElement.name}</span>
                        <button
                          onClick={() => {
                            const newChildIds = elementOptions.childIds?.filter(id => id !== childId);
                            setElementOptions({ ...elementOptions, childIds: newChildIds });
                          }}
                          className="text-red-500 hover:text-red-400"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </li>
                    ) : null;
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No child elements added yet.</p>
              )}
            </div>
            <button
              className="mt-2 w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600"
              onClick={() => {
                // In a real app, this would open a modal or drawer to add child elements
                alert('Adding child elements would be implemented here');
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Child Element
            </button>
          </div>
        );
    
      // Condition Elements
      case StrategyElementType.HIGHER_THAN:
      case StrategyElementType.LOWER_THAN:
      case StrategyElementType.EQUALS:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Left Operand</label>
              <select
                value={elementOptions.leftOperandId || ''}
                onChange={(e) = aria-label="Element options" aria-label="Selection field" aria-label="Selection field" aria-label="Configuration option" aria-label="Element configuration"> aria-label="Selection field" setElementOptions({ ...elementOptions, leftOperandId: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              >
                <option value="">Select Element</option>
                {Object.values(strategy.elements)
                  .filter(el => el.type === StrategyElementType.MOVING_AVERAGE || 
                              el.type === StrategyElementType.RSI || 
                              el.type === StrategyElementType.MACD)
                  .map(el => (
                    <option key={el.id} value={el.id}>{el.name}</option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Right Operand</label>
              <select
                value={elementOptions.rightOperandId || ''}
                onChange={(e) = aria-label="Element options" aria-label="Selection field" aria-label="Selection field" aria-label="Configuration option" aria-label="Element configuration"> aria-label="Selection field" setElementOptions({ ...elementOptions, rightOperandId: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              >
                <option value="">Select Element</option>
                {Object.values(strategy.elements)
                  .filter(el => el.type === StrategyElementType.MOVING_AVERAGE || 
                              el.type === StrategyElementType.RSI || 
                              el.type === StrategyElementType.MACD)
                  .map(el => (
                    <option key={el.id} value={el.id}>{el.name}</option>
                  ))}
                <option value="custom">Custom Value</option>
              </select>
            </div>
            {elementOptions.rightOperandId === 'custom' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Custom Value</label>
                <input
                  type="number"
                  value={parameters.customValue || 0}
                  onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Numeric input" aria-label="Configuration value"> aria-label="Input field" setParameters({ ...parameters, customValue: parseFloat(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                  step="any"
                />
              </div>
            )}
          </>
        );

      // More complex cases
      case StrategyElementType.BETWEEN:
      case StrategyElementType.OUTSIDE:
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Target Value</label>
              <select
                value={elementOptions.leftOperandId || ''}
                onChange={(e) = aria-label="Element options" aria-label="Selection field" aria-label="Selection field" aria-label="Configuration option" aria-label="Element configuration"> aria-label="Selection field" setElementOptions({ ...elementOptions, leftOperandId: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              >
                <option value="">Select Element</option>
                {Object.values(strategy.elements)
                  .filter(el => el.type === StrategyElementType.MOVING_AVERAGE || 
                              el.type === StrategyElementType.RSI || 
                              el.type === StrategyElementType.MACD)
                  .map(el => (
                    <option key={el.id} value={el.id}>{el.name}</option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Lower Bound</label>
              <select
                value={elementOptions.rightOperandId || ''}
                onChange={(e) = aria-label="Element options" aria-label="Selection field" aria-label="Selection field" aria-label="Configuration option" aria-label="Element configuration"> aria-label="Selection field" setElementOptions({ ...elementOptions, rightOperandId: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              >
                <option value="">Select Element</option>
                {Object.values(strategy.elements)
                  .filter(el => el.type === StrategyElementType.MOVING_AVERAGE || 
                              el.type === StrategyElementType.RSI || 
                              el.type === StrategyElementType.MACD)
                  .map(el => (
                    <option key={el.id} value={el.id}>{el.name}</option>
                  ))}
                <option value="custom">Custom Value</option>
              </select>
            </div>
            {elementOptions.rightOperandId === 'custom' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Custom Lower Bound</label>
                <input
                  type="number"
                  value={parameters.customLowerBound || 0}
                  onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Numeric input" aria-label="Configuration value"> aria-label="Input field" setParameters({ ...parameters, customLowerBound: parseFloat(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                  step="any"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Upper Bound</label>
              <select
                value={elementOptions.secondaryOperandId || ''}
                onChange={(e) = aria-label="Element options" aria-label="Selection field" aria-label="Selection field" aria-label="Configuration option" aria-label="Element configuration"> aria-label="Selection field" setElementOptions({ ...elementOptions, secondaryOperandId: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
              >
                <option value="">Select Element</option>
                {Object.values(strategy.elements)
                  .filter(el => el.type === StrategyElementType.MOVING_AVERAGE || 
                              el.type === StrategyElementType.RSI || 
                              el.type === StrategyElementType.MACD)
                  .map(el => (
                    <option key={el.id} value={el.id}>{el.name}</option>
                  ))}
                <option value="custom">Custom Value</option>
              </select>
            </div>
            {elementOptions.secondaryOperandId === 'custom' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">Custom Upper Bound</label>
                <input
                  type="number"
                  value={parameters.customUpperBound || 0}
                  onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Numeric input" aria-label="Configuration value"> aria-label="Input field" setParameters({ ...parameters, customUpperBound: parseFloat(e.target.value) })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
                  step="any"
                />
              </div>
            )}
          </>
        );
          
      // Default
      default:
        return (
          <p className="text-gray-400 italic">No configuration options available for this element type.</p>
        );
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        {isRenaming ? (
          <input
            type="text"
            value={name}
            onChange={(e) = aria-label="Input field" aria-label="Input field" aria-label="Input field" aria-label="Text input" aria-label="Configuration value"> aria-label="Input field" setName(e.target.value)}
            autoFocus
            onBlur={() => setIsRenaming(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsRenaming(false);
                handleSubmit();
              }
            }}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
        ) : (
          <h3 className="text-lg font-medium flex items-center">
            <span>{name}</span>
            <button
              onClick={() => setIsRenaming(true)}
              className="ml-2 text-gray-400 hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </button>
          </h3>
        )}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Element Type</span>
            <span className="px-2 py-1 bg-gray-700 text-xs rounded-md text-gray-300">
              {element.type.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-700 my-4"></div>
        
        {/* Element-specific configuration */}
        {renderConfigFields()}
        
        {/* Common settings like timeframe for indicators */}
        {'interval' in element && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">Timeframe</label>
            <select
              value={elementOptions.interval || TimeInterval.HOUR_1}
              onChange={(e) = aria-label="Element options" aria-label="Selection field" aria-label="Selection field" aria-label="Configuration option" aria-label="Element configuration"> aria-label="Selection field" setElementOptions({ ...elementOptions, interval: e.target.value as TimeInterval })}
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
            >
              <option value={TimeInterval.MINUTE_1}>1 Minute</option>
              <option value={TimeInterval.MINUTE_5}>5 Minutes</option>
              <option value={TimeInterval.MINUTE_15}>15 Minutes</option>
              <option value={TimeInterval.MINUTE_30}>30 Minutes</option>
              <option value={TimeInterval.HOUR_1}>1 Hour</option>
              <option value={TimeInterval.HOUR_4}>4 Hours</option>
              <option value={TimeInterval.DAY_1}>1 Day</option>
              <option value={TimeInterval.WEEK_1}>1 Week</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-700 p-4">
        <div className="flex justify-between space-x-2">
          <button
            onClick={handleDelete}
            className={`px-4 py-2 ${
              isDeleting 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            } rounded text-white flex-1 flex items-center justify-center`}
          >
            {isDeleting ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                Confirm Delete
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete
              </>
            )}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white flex-1"
          >
            Apply Changes
          <span className="sr-only">Action</span></button>
        </div>
      </div>
    </div>
  );
};



