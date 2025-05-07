import React from 'react';

// Assuming these interfaces exist in your codebase
interface Parameter {
  id: string;
  name: string;
  type: string;
  value: any;
  options?: string[];
}

interface Element {
  id: string;
  type: string;
  name: string;
  parameters: Parameter[];
  active: boolean;
}

interface ElementConfigProps {
  element: Element;
  onChange: (updatedElement: Element | null) => void;
}

/**
 * ElementConfig component with accessibility improvements
 * Following WCAG 2.1 standards
 */
const ElementConfig: React.FC<ElementConfigProps> = ({ element, onChange }) => {
  // Handle parameter change
  const handleParamChange = (paramIndex: number, value: any) => {
    const updatedParams = [...element.parameters];
    updatedParams[paramIndex] = {
      ...updatedParams[paramIndex],
      value
    };
    onChange({ ...element, parameters: updatedParams });
  };

  return (
    <section className="element-config" aria-label="Element Configuration">
      <h2>Configure {element.name}</h2>
      
      <div className="form-controls">
        <div className="form-group">
          <label htmlFor="element-name">Name</label>
          <input
            id="element-name"
            type="text"
            value={element.name}
            onChange={(e) => onChange({ ...element, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="element-type">Type</label>
          <select
            id="element-type"
            value={element.type}
            onChange={(e) => onChange({ ...element, type: e.target.value })}
          >
            <option value="indicator">Indicator</option>
            <option value="condition">Condition</option>
            <option value="action">Action</option>
          </select>
        </div>
      </div>
      
      <fieldset>
        <legend>Parameters</legend>
        
        <div className="parameters-list">
          {element.parameters.map((param, index) => (
            <div key={param.id} className="parameter-item">
              <label htmlFor={\param-\\}>{param.name}</label>
              
              {/* Different input types based on parameter type */}
              {param.type === 'select' && param.options ? (
                <select
                  id={\param-\\}
                  value={param.value}
                  onChange={(e) => handleParamChange(index, e.target.value)}
                >
                  {param.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : param.type === 'boolean' ? (
                <input
                  id={\param-\\}
                  type="checkbox"
                  checked={!!param.value}
                  onChange={(e) => handleParamChange(index, e.target.checked)}
                />
              ) : (
                <input
                  id={\param-\\}
                  type={param.type === 'number' ? 'number' : 'text'}
                  value={param.value}
                  onChange={(e) => handleParamChange(index, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </fieldset>
      
      <div className="action-buttons">
        <button 
          type="button"
          onClick={() => onChange({ ...element, active: !element.active })}
        >
          {element.active ? 'Disable' : 'Enable'} Element
        </button>
        
        <button
          type="button"
          onClick={() => onChange(null)}
        >
          Delete Element
        </button>
      </div>
    </section>
  );
};

export default ElementConfig;
