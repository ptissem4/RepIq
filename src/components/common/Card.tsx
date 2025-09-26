import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-dark-800/60 backdrop-blur-lg border border-dark-700/50 rounded-lg shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
