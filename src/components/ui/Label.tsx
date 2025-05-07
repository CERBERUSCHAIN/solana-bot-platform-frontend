// CERBERUS Bot - Label Component
// Created: 2025-05-05 21:43:55 UTC
// Author: CERBERUSCHAIN

import React from 'react';

// Explicitly extend the HTML label attributes
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  // You can add additional props specific to your Label component here
}

export const Label: React.FC<LabelProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <label className={`text-sm font-medium text-gray-300 ${className}`} {...props}>
      {children}
    </label>
  );
};