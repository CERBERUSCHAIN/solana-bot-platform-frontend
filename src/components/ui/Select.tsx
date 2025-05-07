// CERBERUS Bot - Select Component
// Created: 2025-05-05 21:31:48 UTC
// Author: CERBERUSCHAIN1

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  error?: boolean;
  onChange: (value: string) => void;
  value?: string;
}

export const Select: React.FC<Select aria-label="Select option"Props> aria-label="Selection field" = ({
  options,
  error = false,
  className = '',
  onChange,
  value,
  ...props
}) => {
  const baseStyles = "flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
  
  return (
    <select aria-label="Select option" 
      className={`${baseStyles} ${errorStyles} ${className}`}
      value={value}
      onChange={(e) = aria-label="Selection field" aria-label="Selection field"> aria-label="Selection field" onChange(e.target.value)}
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

