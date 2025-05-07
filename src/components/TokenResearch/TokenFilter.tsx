// CERBERUS Bot - Token Filter Component
// Created: 2025-05-06 16:12:48 UTC
// Author: CERBERUSCHAINnext

import React, { useState } from 'react';
import { TokenFilter as TokenFilterType, FilterOperator } from '../../types/token';

interface TokenFilterProps {
  onFilterChange: (filters: TokenFilterType[]) => void;
}

export const TokenFilter: React.FC<TokenFilterProps> = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<TokenFilterType[]>([]);
  const [selectedField, setSelectedField] = useState<string>('marketCap');
  const [selectedOperator, setSelectedOperator] = useState<FilterOperator>(FilterOperator.GREATER_THAN);
  const [filterValue, setFilterValue] = useState<string>('');
  const [secondaryValue, setSecondaryValue] = useState<string>('');
  
  const handleAddFilter = () => {
    if (!filterValue) return;
    
    let value: any = filterValue;
    
    // Convert to number if appropriate
    if (['marketCap', 'price', 'priceChange24h', 'volume24h'].includes(selectedField)) {
      value = parseFloat(filterValue);
      if (isNaN(value)) return;
    }
    
    const newFilter: TokenFilterType = {
      field: selectedField,
      operator: selectedOperator,
      value
    };
    
    if (selectedOperator === FilterOperator.BETWEEN && secondaryValue) {
      let secValue = secondaryValue;
      if (['marketCap', 'price', 'priceChange24h', 'volume24h'].includes(selectedField)) {
        secValue = parseFloat(secondaryValue);
        if (isNaN(secValue)) return;
      }
      newFilter.secondaryValue = secValue;
    }
    
    const updatedFilters = [...filters, newFilter];
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
    
    // Reset inputs
    setFilterValue('');
    setSecondaryValue('');
  };
  
  const handleRemoveFilter = (index: number) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const renderFilterLabel = (filter: TokenFilterType) => {
    const fieldLabels: Record<string, string> = {
      marketCap: 'Market Cap',
      price: 'Price',
      priceChange24h: '24h Change',
      volume24h: '24h Volume',
      name: 'Name',
      symbol: 'Symbol',
      tags: 'Tags'
    };
    
    const operatorLabels: Record<FilterOperator, string> = {
      [FilterOperator.EQUALS]: '=',
      [FilterOperator.NOT_EQUALS]: '≠',
      [FilterOperator.GREATER_THAN]: '>',
      [FilterOperator.LESS_THAN]: '<',
      [FilterOperator.GREATER_THAN_OR_EQUAL]: '≥',
      [FilterOperator.LESS_THAN_OR_EQUAL]: '≤',
      [FilterOperator.CONTAINS]: 'contains',
      [FilterOperator.NOT_CONTAINS]: 'not contains',
      [FilterOperator.BETWEEN]: 'between'
    };
    
    let valueDisplay = filter.value;
    if (['marketCap', 'price', 'volume24h'].includes(filter.field) && typeof filter.value === 'number') {
      valueDisplay = `$${filter.value.toLocaleString()}`;
    } else if (filter.field === 'priceChange24h' && typeof filter.value === 'number') {
      valueDisplay = `${filter.value}%`;
    }
    
    if (filter.operator === FilterOperator.BETWEEN && filter.secondaryValue !== undefined) {
      let secondaryDisplay = filter.secondaryValue;
      if (['marketCap', 'price', 'volume24h'].includes(filter.field) && typeof filter.secondaryValue === 'number') {
        secondaryDisplay = `$${filter.secondaryValue.toLocaleString()}`;
      } else if (filter.field === 'priceChange24h' && typeof filter.secondaryValue === 'number') {
        secondaryDisplay = `${filter.secondaryValue}%`;
      }
      
      return `${fieldLabels[filter.field] || filter.field} ${operatorLabels[filter.operator]} ${valueDisplay} and ${secondaryDisplay}`;
    }
    
    return `${fieldLabels[filter.field] || filter.field} ${operatorLabels[filter.operator]} ${valueDisplay}`;
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm text-indigo-400 hover:text-indigo-300"
        >
          <svg className={`w-4 h-4 mr-1 transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
          Filter Options
        </button>
        
        {filters.length > 0 && (
          <button 
            onClick={() => {
              setFilters([]);
              onFilterChange([]);
            }}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Clear All Filters
          </button>
        )}
      </div>
      
      {/* Applied filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {filters.map((filter, index) => (
            <div 
              key={index} 
              className="flex items-center bg-gray-700 text-sm rounded-full py-1 pl-3 pr-1"
            >
              <span className="mr-1">{renderFilterLabel(filter)}</span>
              <button 
                onClick={() => handleRemoveFilter(index)}
                className="p-1 hover:bg-gray-600 rounded-full"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {isExpanded && (
        <div className="bg-gray-800 p-4 rounded-lg mt-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Field selector */}
            <div>
              <label htmlFor="field-select" className="block text-xs font-medium text-gray-400 mb-1">
                Field
              </label>
              <select
                id="field-select"
                className="bg-gray-700 text-white rounded w-full py-2 px-3 text-sm"
                value={selectedField}
                onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" setSelectedField(e.target.value)}
              >
                <option value="marketCap">Market Cap</option>
                <option value="price">Price</option>
                <option value="priceChange24h">24h Change</option>
                <option value="volume24h">24h Volume</option>
                <option value="name">Name</option>
                <option value="symbol">Symbol</option>
                <option value="tags">Tags</option>
              </select>
            </div>
            
            {/* Operator selector */}
            <div>
              <label htmlFor="operator-select" className="block text-xs font-medium text-gray-400 mb-1">
                Operator
              </label>
              <select
                id="operator-select"
                className="bg-gray-700 text-white rounded w-full py-2 px-3 text-sm"
                value={selectedOperator}
                onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" setSelectedOperator(e.target.value as FilterOperator)}
              >
                {/* Numeric operators */}
                {['marketCap', 'price', 'priceChange24h', 'volume24h'].includes(selectedField) && (
                  <>
                    <option value={FilterOperator.GREATER_THAN}>Greater Than</option>
                    <option value={FilterOperator.LESS_THAN}>Less Than</option>
                    <option value={FilterOperator.EQUALS}>Equals</option>
                    <option value={FilterOperator.NOT_EQUALS}>Not Equals</option>
                    <option value={FilterOperator.GREATER_THAN_OR_EQUAL}>Greater Than or Equal</option>
                    <option value={FilterOperator.LESS_THAN_OR_EQUAL}>Less Than or Equal</option>
                    <option value={FilterOperator.BETWEEN}>Between</option>
                  </>
                )}
                
                {/* String operators */}
                {['name', 'symbol', 'tags'].includes(selectedField) && (
                  <>
                    <option value={FilterOperator.CONTAINS}>Contains</option>
                    <option value={FilterOperator.NOT_CONTAINS}>Not Contains</option>
                    <option value={FilterOperator.EQUALS}>Equals</option>
                    <option value={FilterOperator.NOT_EQUALS}>Not Equals</option>
                  </>
                )}
              </select>
            </div>
            
            {/* Value input */}
            <div>
              <label htmlFor="value-input" className="block text-xs font-medium text-gray-400 mb-1">
                Value
              </label>
              <input
                id="value-input"
                type={['marketCap', 'price', 'priceChange24h', 'volume24h'].includes(selectedField) ? 'number' : 'text'}
                className="bg-gray-700 text-white rounded w-full py-2 px-3 text-sm"
                value={filterValue}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setFilterValue(e.target.value)}
                placeholder={
                  ['marketCap', 'price', 'volume24h'].includes(selectedField)
                    ? 'Enter amount in USD'
                    : selectedField === 'priceChange24h'
                    ? 'Enter percentage'
                    : 'Enter value'
                }
                step={['price'].includes(selectedField) ? '0.000001' : '1'}
              />
            </div>
            
            {/* Secondary value input (for BETWEEN operator) */}
            {selectedOperator === FilterOperator.BETWEEN && (
              <div>
                <label htmlFor="secondary-value-input" className="block text-xs font-medium text-gray-400 mb-1">
                  Second Value
                </label>
                <input
                  id="secondary-value-input"
                  type={['marketCap', 'price', 'priceChange24h', 'volume24h'].includes(selectedField) ? 'number' : 'text'}
                  className="bg-gray-700 text-white rounded w-full py-2 px-3 text-sm"
                  value={secondaryValue}
                  onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setSecondaryValue(e.target.value)}
                  placeholder="Upper bound"
                  step={['price'].includes(selectedField) ? '0.000001' : '1'}
                />
              </div>
            )}
            
            {/* Add button */}
            <div className={`${selectedOperator === FilterOperator.BETWEEN ? 'md:col-span-4' : 'md:col-span-1'} flex items-end`}>
              <button
                onClick={handleAddFilter}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded w-full"
              >
                Add Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
