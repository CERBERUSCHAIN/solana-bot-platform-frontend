import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || \input-\\;
  
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={\orm-control \ \\}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? \\-error\ : helpText ? \\-help\ : undefined}
        aria-label={!label ? props.placeholder || 'Input field' : undefined}
        {...props}
      />
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

export default Input;
