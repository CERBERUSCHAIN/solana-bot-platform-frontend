import React, { useState } from "react";

type Strategy = {
  id: string;
  name: string;
  description: string;
  type: "MOMENTUM" | "MEAN_REVERSION" | "TREND_FOLLOWING" | "CUSTOM";
  performance?: {
    winRate: number;
    avgProfit: number;
  };
};

type StrategySelectorProps = {
  strategies: Strategy[];
  selectedStrategyId?: string;
  onSelect: (strategyId: string) => void;
};

export default function StrategySelector({ 
  strategies, 
  selectedStrategyId, 
  onSelect 
}: StrategySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredStrategies = strategies.filter(strategy => 
    strategy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="bg-gray-800 rounded-lg p-5" data-cy="strategy-selector">
      <h3 className="text-white text-lg font-semibold mb-4">Select Strategy</h3>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search strategies..."
          className="w-full bg-gray-700 text-white rounded px-3 py-2"
          value={searchTerm}
          onChange={(e) = aria-label="Input field" aria-label="Input field"> setSearchTerm(e.target.value)}
          data-cy="strategy-search"
        />
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto" data-cy="strategy-list">
        {filteredStrategies.length > 0 ? (
          filteredStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`p-3 rounded cursor-pointer transition-colors ${
                selectedStrategyId === strategy.id 
                  ? "bg-blue-600" 
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => onSelect(strategy.id)}
              data-cy="strategy-item"
              data-strategy-id={strategy.id}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-white">{strategy.name}</h4>
                <span className="px-2 py-1 text-xs rounded bg-gray-600">
                  {strategy.type}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 mt-1">{strategy.description}</p>
              
              {strategy.performance && (
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Win rate: <span className="text-green-400">{strategy.performance.winRate}%</span></span>
                  <span>Avg profit: <span className="text-green-400">{strategy.performance.avgProfit}%</span></span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center py-4" data-cy="no-strategies">
            No strategies found
          </div>
        )}
      </div>
    </div>
  );
}
