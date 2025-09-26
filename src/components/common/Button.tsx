import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center px-5 py-2.5 font-semibold text-sm rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-brand-purple text-white hover:bg-brand-purple/90 focus:ring-brand-purple',
    secondary: 'bg-dark-700 text-gray-200 hover:bg-dark-600 focus:ring-dark-600',
    danger: 'bg-brand-red text-white hover:bg-brand-red/90 focus:ring-brand-red',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;