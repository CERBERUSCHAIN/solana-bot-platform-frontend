import React, { useId, useRef, useEffect } from 'react';

// Assuming these interfaces exist in your codebase
interface Parameter {
  id: string;
  name: string;
  type: string;
  value: any;
  options?: string[];
  required?: boolean;
  description?: string;
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
  onClose?: () => void;
}

const ElementConfig: React.FC<ElementConfigProps> = ({ element, onChange, onClose }) => {
  // Generate unique IDs for accessibility
  const configId = useId();
  const headingId = \\-heading\;
  const formId = \\-form\;
  const paramsId = \\-params\;
  
  // Ref for the heading to set focus when the component mounts
  const headingRef = useRef<HTMLHeadingElement>(null);
  
  // Set focus to the heading when the component mounts
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  // Handle parameter change
  const handleParamChange = (paramId: string, value: any) => {
    const updatedParams = element.parameters.map(param => 
      param.id === paramId ? { ...param, value } : param
    );
    onChange({ ...element, parameters: updatedParams });
  };
  
  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && onClose) {
      onClose();
    }
  };

  return (
    <div 
      className="element-config"
      role="region"
      aria-labelledby={headingId}
      onKeyDown={handleKeyDown}
    >
      <h2 
        id={headingId} 
        className="config-heading" 
        ref={headingRef}
        tabIndex={-1} // Makes it focusable but not in tab order
      >
        Configure {element.type}: {element.name}
      </h2>
      
      {/* Skip link for keyboard users */}
      <a href={\#\-actions\} className="sr-only sr-only-focusable">
        Skip to actions
      </a>
      
      <form
        id={formId}
        className="config-form"
        aria-label="Element configuration form"
      >
        <div className="form-group mb-3">
          <label htmlFor={\\-element-name\} className="form-label">
            <span className="required-indicator" aria-hidden="true">*</span>
            Name
          </label>
          <input
            id={\\-element-name\}
            type="text"
            className="form-control"
            value={element.name}
            onChange={(e) => onChange({ ...element, name: e.target.value })}
            aria-describedby={\\-name-help\}
            aria-required="true"
            required
          />
          <div 
            id={\\-name-help\} 
            className="form-text"
            aria-live="polite"
          >
            Enter a descriptive name for this element
          </div>
        </div>

        <div className="form-group mb-3">
          <label htmlFor={\\-element-type\} className="form-label d-block">
            Element Type
          </label>
          <select
            id={\\-element-type\}
            className="form-select"
            value={element.type}
            onChange={(e) => onChange({ ...element, type: e.target.value })}
            aria-describedby={\\-type-description\}
          >
            <option value="indicator">Indicator</option>
            <option value="condition">Condition</option>
            <option value="action">Action</option>
          </select>
          <div id={\\-type-description\} className="form-text">
            Select the type of element from the available options
          </div>
        </div>
        
        <fieldset
          className="mb-4 border rounded p-3"
          aria-describedby={\\-description\}
        >
          <legend id={paramsId} className="fs-5 fw-bold">Parameters</legend>
          <p 
            id={\\-description\} 
            className="parameters-description"
          >
            Configure the parameters for this {element.type}
          </p>
          
          <div 
            className="config-parameters" 
            role="group" 
            aria-labelledby={paramsId}
          >
            {element.parameters.map((param, index) => {
              const paramId = \param-\\;
              const descriptionId = \\-description\;
              const isRequired = !!param.required;
              
              return (
                <div key={param.id} className="parameter-item mb-3">
                  <label
                    htmlFor={paramId} 
                    className="form-label d-flex align-items-center"
                  >
                    {isRequired && (
                      <span className="required-indicator me-1" aria-hidden="true">*</span>
                    )}
                    {param.name}
                  </label>
                  
                  {param.description && (
                    <div id={descriptionId} className="form-text mb-2">
                      {param.description}
                    </div>
                  )}
                  
                  {param.type === 'select' && param.options ? (
                    <select
                      id={paramId}
                      className="form-select"
                      value={param.value}
                      onChange={(e) => handleParamChange(param.id, e.target.value)}
                      aria-describedby={param.description ? descriptionId : undefined}
                      aria-required={isRequired ? 'true' : undefined}
                      required={isRequired}
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
                        id={paramId}
                        type="checkbox"
                        className="form-check-input"
                        checked={!!param.value}
                        onChange={(e) => handleParamChange(param.id, e.target.checked)}
                        aria-describedby={param.description ? descriptionId : undefined}
                      />
                      <label className="form-check-label ms-2" htmlFor={paramId}>
                        {param.value ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  ) : param.type === 'number' ? (
                    <input
                      id={paramId}
                      type="number"
                      className="form-control"
                      value={param.value}
                      onChange={(e) => handleParamChange(param.id, parseFloat(e.target.value))}
                      aria-describedby={param.description ? descriptionId : undefined}
                      aria-required={isRequired ? 'true' : undefined}
                      required={isRequired}
                    />
                  ) : (
                    <input
                      id={paramId}
                      type="text"
                      className="form-control"
                      value={param.value}
                      onChange={(e) => handleParamChange(param.id, e.target.value)}
                      aria-describedby={param.description ? descriptionId : undefined}
                      aria-required={isRequired ? 'true' : undefined}
                      required={isRequired}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>
        
        <div 
          id={\\-actions\}
          className="config-actions d-flex justify-content-between mt-4"
        >
          <div>
            <button
              type="button"
              className={\tn \ me-2\}
              onClick={() => onChange({ ...element, active: !element.active })}
              aria-pressed={element.active}
            >
              {element.active ? 'Enabled' : 'Enable'}
              <span className="sr-only">
                {element.active ? 'Element is currently enabled' : 'Enable this element'}
              </span>
            </button>
          </div>
          
          <div>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => onChange(null)}
              aria-label="Delete this element"
            >
              <span className="icon-trash me-1" aria-hidden="true"></span>
              Delete Element
            </button>
            
            {onClose && (
              <button
                type="button"
                className="btn btn-outline-secondary ms-2"
                onClick={onClose}
                aria-label="Close configuration panel"
              >
                <span className="icon-close me-1" aria-hidden="true"></span>
                Close
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ElementConfig;
