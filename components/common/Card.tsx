import React from 'react';

// FIX: Allow passing additional HTML attributes (like 'id') to the Card component.
// The CardProps now extends React.HTMLAttributes<HTMLDivElement> to accept any standard div attributes.
// The component is updated to spread these additional props onto the underlying div element.
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