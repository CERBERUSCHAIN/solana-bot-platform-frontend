import React from 'react';

// Example enhanced ElementConfig component with accessibility fixes
const ElementConfig = ({ element, onChange }) => {
  return (
    <div className="element-config">
      <h3 id="config-heading">Element Configuration</h3>
      <div className="config-section" aria-labelledby="config-heading">
        {/* Type selector with proper accessibility */}
        <div className="form-group">
          <label htmlFor="element-type" className="form-label">Element Type</label>
          <select
            id="element-type"
            className="form-select"
            value={element.type}
            onChange={(e) => onChange({ ...element, type: e.target.value })}
          >
            <option value="indicator">Indicator</option>
            <option value="condition">Condition</option>
            <option value="action">Action</option>
          </select>
        </div>
        
        {/* Parameters with proper accessibility */}
        <div className="config-parameters">
          <h4 id="params-heading">Parameters</h4>
          {element.parameters.map((param, index) => (
            <div key={index} className="parameter-item">
              <label htmlFor={\param-\\} className="form-label">{param.name}</label>
              <input
                id={\param-\\}
                type={param.type === 'number' ? 'number' : 'text'}
                className="form-control"
                value={param.value}
                onChange={(e) => {
                  const updatedParams = [...element.parameters];
                  updatedParams[index] = {
                    ...param,
                    value: e.target.value
                  };
                  onChange({ ...element, parameters: updatedParams });
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Actions with proper accessibility */}
        <div className="config-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onChange({ ...element, active: !element.active })}
          >
            {element.active ? 'Disable' : 'Enable'} Element
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            aria-label="Remove element"
            onClick={() => onChange(null)}
          >
            <span className="icon-trash" aria-hidden="true"></span>
            <span className="sr-only">Remove element</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElementConfig;
