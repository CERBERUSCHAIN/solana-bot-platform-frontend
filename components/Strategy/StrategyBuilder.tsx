import React, { useState, useEffect } from 'react';
import { Rule } from '../../types/strategy';

interface StrategyBuilderProps {
  onSave: (strategy: any) => void;
  onCancel?: () => void;
  initialStrategy?: any;
  indicators: any[];
  conditions: any[];
}

const StrategyBuilder: React.FC<StrategyBuilderProps> = ({
  onSave,
  onCancel,
  initialStrategy,
  indicators,
  conditions
}) => {
  const [name, setName] = useState(initialStrategy?.name || '');
  const [description, setDescription] = useState(initialStrategy?.description || '');
  const [entryRules, setEntryRules] = useState<Rule[]>(initialStrategy?.entryRules || []);
  const [exitRules, setExitRules] = useState<Rule[]>(initialStrategy?.exitRules || []);
  const [error, setError] = useState('');
  
  // Mapping of condition IDs to readable labels
  const conditionLabels: Record<string, string> = {
    greater: "Greater Than",
    less: "Less Than",
    equal: "Equal To",
    cross_above: "Crosses Above",
    cross_below: "Crosses Below"
  };

  const addEntryRule = () => {
    setEntryRules([...entryRules, { 
      indicator: indicators[0]?.id || '', 
      condition: conditions[0]?.id || '', 
      value: 0 
    }]);
  };

  const updateEntryRule = (index: number, field: string, value: any) => {
    const updatedRules = [...entryRules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setEntryRules(updatedRules);
  };

  const removeEntryRule = (index: number) => {
    setEntryRules(entryRules.filter((_, i) => i !== index));
  };

  const addExitRule = () => {
    setExitRules([...exitRules, { 
      indicator: indicators[0]?.id || '', 
      condition: conditions[0]?.id || '', 
      value: 0 
    }]);
  };

  const updateExitRule = (index: number, field: string, value: any) => {
    const updatedRules = [...exitRules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setExitRules(updatedRules);
  };

  const removeExitRule = (index: number) => {
    setExitRules(exitRules.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name) {
      setError('Strategy name is required');
      return;
    }
    
    onSave({
      name,
      description,
      entryRules,
      exitRules
    });
  };

  return (
    <div className="strategy-builder">
      <div className="form-group">
        <label htmlFor="strategy-name">Strategy Name</label>
        <input
          id="strategy-name"
          type="text"
          value={name}
          onChange={(e) = aria-label="Input field" aria-label="Input field"> setName(e.target.value)}
          className="form-control"
          aria-label="Strategy name"
        />
        {error && <div className="error">{error}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="strategy-description">Description (Optional)</label>
        <textarea
          id="strategy-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control"
          aria-label="Strategy description"
        />
      </div>
      
      <div className="rules-section">
        <h3>Entry Rules</h3>
        {entryRules.map((rule, index) => (
          <div key={`entry-${index}`} className="rule-group">
            <div className="select-container">
              <label>Indicator</label>
              <select
                value={rule.indicator}
                onChange={(e) = aria-label="Select {ind.name}" aria-label="Selection field" aria-label="Selection field"></option>
                ))}
              </select>
            </div>
            
            <div className="select-container">
              <label>Condition</label>
              <select
                value={rule.condition}
                onChange={(e) = aria-label="Select {cond.name}" aria-label="Selection field" aria-label="Selection field"></option>
                ))}
              </select>
            </div>
            
            <div className="input-container">
              <label>Value</label>
              <input
                type="number"
                value={rule.value}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> updateEntryRule(index, 'value', parseFloat(e.target.value))}
                aria-label="Condition value"
              />
            </div>
            
            <button 
              type="button" 
              onClick={() => removeEntryRule(index)} 
              className="remove-rule-btn"
              aria-label="Remove entry rule"
            >
              Remove
            </button>
          </div>
        ))}
        
        <button 
          type="button" 
          onClick={addEntryRule} 
          className="add-rule-btn"
          aria-label="Add entry rule"
        >
          Add Condition
        </button>
      </div>
      
      <div className="rules-section">
        <h3>Exit Rules</h3>
        {exitRules.map((rule, index) => (
          <div key={`exit-${index}`} className="rule-group">
            <div className="select-container">
              <label>Indicator</label>
              <select
                value={rule.indicator}
                onChange={(e) = aria-label="Select {ind.name}" aria-label="Selection field" aria-label="Selection field"></option>
                ))}
              </select>
            </div>
            
            <div className="select-container">
              <label>Condition</label>
              <select
                value={rule.condition}
                onChange={(e) = aria-label="Select {cond.name}" aria-label="Selection field" aria-label="Selection field"></option>
                ))}
              </select>
            </div>
            
            <div className="input-container">
              <label>Value</label>
              <input
                type="number"
                value={rule.value}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> updateExitRule(index, 'value', parseFloat(e.target.value))}
                aria-label="Condition value"
              />
            </div>
            
            <button 
              type="button" 
              onClick={() => removeExitRule(index)} 
              className="remove-rule-btn"
              aria-label="Remove exit rule"
            >
              Remove
            </button>
          </div>
        ))}
        
        <button 
          type="button" 
          onClick={addExitRule} 
          className="add-rule-btn"
          aria-label="Add exit rule"
        >
          Add Condition
        </button>
      </div>
      
      <div className="strategy-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        )}
        <button type="button" onClick={handleSave} className="save-btn">
          Save Strategy
        </button>
      </div>
    </div>
  );
};

export default StrategyBuilder;

