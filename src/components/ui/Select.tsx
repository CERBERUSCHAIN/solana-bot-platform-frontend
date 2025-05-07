import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helpText?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helpText,
  id,
  className = '',
  ...props
}) => {
  const selectId = id || \select-\\;
  
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={\orm-select \ \\}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? \\-error\ : helpText ? \\-help\ : undefined}
        aria-label={!label ? 'Select option' : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div id={\\-error\} className="invalid-feedback" role="alert">
          {error}
        </div>
      )}
      {helpText && !error && (
        <div id={\\-help\} className="form-text">
          {helpText}
        </div>
      )}
    </div>
  );
};

export default Select;
