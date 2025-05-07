import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  // Add accessibility props
  accessibleLabel?: string; // For screen readers when no visible text
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isLoading = false,
  icon,
  accessibleLabel,
  className = '',
  ...rest
}) => {
  // Determine if this is an icon-only button
  const isIconOnly = icon && !children;
  
  return (
    <button
      className={\tn btn-\ btn-\ \ \\}
      disabled={isLoading}
      aria-label={isIconOnly ? accessibleLabel : undefined}
      {...rest}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
      {isIconOnly && accessibleLabel && <span className="sr-only">{accessibleLabel}</span>}
      {isLoading && <span className="spinner" aria-hidden="true"></span>}
    </button>
  );
};

export default Button;
