// CERBERUS Bot - Switch Component
// Created: 2025-05-05 22:20:50 UTC
// Author: CERBERUSCHAIN

import React from 'react';

interface SwitchProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  checked,
  onCheckedChange,
  disabled = false,
  label
}) => {
  // Determine accessible name for the switch
  const accessibleName = label || `Toggle ${id || 'switch'}`;
  
  // Create props object with conditional attributes to avoid expression in JSX
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    type: "checkbox",
    id,
    checked,
    onChange: (e) => onCheckedChange(e.target.checked),
    disabled,
    className: "sr-only",
    "aria-label": accessibleName,
    role: "switch",
    title: accessibleName,
  };
  
  // Set aria-checked as a string literal, not an expression
  if (checked) {
    inputProps["aria-checked"] = "true";
  } else {
    inputProps["aria-checked"] = "false";
  }
  
  return (
    <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
      <input {...inputProps} /> aria-label="Input field"
      
      <div
        className={`block h-6 w-10 rounded-full ${checked ? 'bg-indigo-600' : 'bg-gray-600'} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => !disabled && onCheckedChange(!checked)}
        aria-hidden="true"
      />
      
      <div
        className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? 'transform translate-x-4' : ''
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !disabled && onCheckedChange(!checked)}
        aria-hidden="true" 
      />
    </div>
  );
};
