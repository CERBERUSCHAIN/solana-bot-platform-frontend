import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  accessibleLabel?: string; // For screen readers
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isLoading = false,
  icon,
  accessibleLabel,
  className = '',
  ...props
}) => {
  const isIconOnly = icon && !children;
  
  return (
    <button
      className={\tn btn-\ btn-\ \ \\}
      aria-label={isIconOnly ? accessibleLabel || 'Button action' : undefined}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
      {isIconOnly && <span className="sr-only">{accessibleLabel || 'Button action'}</span>}
      {isLoading && <span className="loading-spinner" aria-hidden="true"></span>}
    </button>
  );
};

export default Button;
