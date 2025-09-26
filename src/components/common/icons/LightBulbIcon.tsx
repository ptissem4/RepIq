import React from 'react';

export const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
    >
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a12.06 12.06 0 01-4.5 0m4.5 0a3.75 3.75 0 01-3.75 0m-3.75-8.983a3.75 3.75 0 017.5 0c0 1.954-.993 3.722-2.562 4.786m-4.938 0c-1.569-1.064-2.562-2.832-2.562-4.786a3.75 3.75 0 015.625-3.364m-5.625 3.364a3.75 3.75 0 015.625 0" 
    />
  </svg>
);