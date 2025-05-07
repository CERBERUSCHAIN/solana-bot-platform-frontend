import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  helpText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helpText,
  id,
  className = '',
  ...rest
}) => {
  const selectId = id || \select-\\;
  
  return (
    <div className="form-control">
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
        aria-label={!label ? 'Selection field' : undefined}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div id={\\-error\} className="error-message" role="alert">
          {error}
        </div>
      )}
      {helpText && !error && (
        <div id={\\-help\} className="help-text">
          {helpText}
        </div>
      )}
    </div>
  );
};

export default Select;
