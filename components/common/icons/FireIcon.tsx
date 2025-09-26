import React from 'react';

export const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}>
    <path 
        fillRule="evenodd" 
        d="M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0112 12c0 5.385-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12a9.75 9.75 0 011.666-5.182.75.75 0 10-1.052-1.071A11.25 11.25 0 00.75 12c0 6.21 5.04 11.25 11.25 11.25s11.25-5.04 11.25-11.25a11.25 11.25 0 00-2.6-7.065z" 
        clipRule="evenodd" />
    <path 
        fillRule="evenodd" 
        d="M12 2.25a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" 
        clipRule="evenodd" />
    <path 
        fillRule="evenodd" 
        d="M12.75 6a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0V6z" 
        clipRule="evenodd" />
  </svg>
);