/**
 * src/utils/accessibility.ts
 * Utility functions for accessibility
 */

import React from 'react';

// Add accessible label to any element that needs it
export const withAccessibleLabel = (Component: React.ComponentType<any>, label: string) => {
  return (props: any) => {
    return <Component aria-label={label} {...props} />;
  };
};

// Add screen reader only text
export const srOnly = (text: string) => {
  return <span className="sr-only">{text}</span>;
};

// Create a properly labeled form element
export const LabeledInput = ({
  id,
  label,
  type = 'text',
  ...props
}: {
  id: string;
  label: string;
  type?: string;
  [key: string]: any;
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} {...props} />
    </div>
  );
};

// Create a properly labeled select element
export const LabeledSelect = ({
  id,
  label,
  options,
  ...props
}: {
  id: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  [key: string]: any;
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <select id={id} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Button with proper accessibility for icons
export const AccessibleIconButton = ({
  icon,
  label,
  onClick,
  className = '',
  ...props
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label={label}
      {...props}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
};
