import React from 'react';
import { useId } from 'react';

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

const ElementConfig: React.FC<ElementConfigProps> = ({ element, onChange }) => {
  // Generate unique IDs for accessibility
  const headingId = useId();
  const formId = useId();
  const paramsId = useId();

  // Handle parameter change
  const handleParamChange = (paramId: string, value: any) => {
    const updatedParams = element.parameters.map(param => 
      param.id === paramId ? { ...param, value } : param
    );
    onChange({ ...element, parameters: updatedParams });
  };

  return (
    <div 
      className="element-config" 
      role="region" 
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="config-heading">Element Configuration</h2>
      
      <form id={formId} className="config-form">
        <div className="form-group">
          <label htmlFor={\\-element-name\} className="form-label">Name</label>
          <input
            id={\\-element-name\}
            type="text"
            className="form-control"
            value={element.name}
            onChange={(e) => onChange({ ...element, name: e.target.value })}
            aria-describedby={\\-name-help\}
          />
          <div id={\\-name-help\} className="form-text">
            Enter a descriptive name for this element
          </div>
        </div>

        <div className="form-group">
          <label htmlFor={\\-element-type\} className="form-label">Element Type</label>
          <select
            id={\\-element-type\}
            className="form-select"
            value={element.type}
            onChange={(e) => onChange({ ...element, type: e.target.value })}
          >
            <option value="indicator">Indicator</option>
            <option value="condition">Condition</option>
            <option value="action">Action</option>
          </select>
        </div>
        
        <fieldset>
          <legend id={paramsId}>Parameters</legend>
          <div className="config-parameters" role="group" aria-labelledby={paramsId}>
            {element.parameters.map((param, index) => (
              <div key={param.id} className="parameter-item">
                <label htmlFor={\param-\\} className="form-label">
                  {param.name}
                </label>
                
                {param.type === 'select' && param.options ? (
                  <select
                    id={\param-\\}
                    className="form-select"
                    value={param.value}
                    onChange={(e) => handleParamChange(param.id, e.target.value)}
                  >
                    {param.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : param.type === 'boolean' ? (
                  <div className="form-check">
                    <input
                      id={\param-\\}
                      type="checkbox"
                      className="form-check-input"
                      checked={!!param.value}
                      onChange={(e) => handleParamChange(param.id, e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={\param-\\}>
                      Enable
                    </label>
                  </div>
                ) : (
                  <input
                    id={\param-\\}
                    type={param.type === 'number' ? 'number' : 'text'}
                    className="form-control"
                    value={param.value}
                    onChange={(e) => handleParamChange(param.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </fieldset>
        
        <div className="config-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onChange({ ...element, active: !element.active })}
            aria-pressed={element.active}
          >
            {element.active ? 'Disable' : 'Enable'} Element
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => onChange(null)}
            aria-label="Delete element"
          >
            <span className="icon-trash" aria-hidden="true"></span>
            <span className="sr-only">Delete element</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ElementConfig;
