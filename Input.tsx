import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  id,
  className = '',
  ...rest
}) => {
  const inputId = id || \input-\\;
  
  return (
    <div className="form-control">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={\orm-input \ \\}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? \\-error\ : helpText ? \\-help\ : undefined}
        aria-label={!label ? rest.placeholder || 'Input field' : undefined}
        {...rest}
      />
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

export default Input;
