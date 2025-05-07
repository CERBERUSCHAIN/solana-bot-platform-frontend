// CERBERUS Bot - Input Component
// Created: 2025-05-05 21:31:48 UTC
// Author: CERBERUSCHAIN1

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input: React.FC<Input aria-label={props.label || props.placeholder || "Input field"}Props> aria-label="Input field" = ({
  className = '',
  error = false,
  ...props
}) => {
  const baseStyles = "flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : "";
  
  return (
    <input aria-label={props.label || props.placeholder || "Input field"} 
      className={`${baseStyles} ${errorStyles} ${className}`}
      {...props} 
    / aria-label="Input field" aria-label="Input field"> aria-label="Input field"
  );
};

