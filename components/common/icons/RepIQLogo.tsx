import React from 'react';

export const RepIQLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="logo-gradient-bars" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    {/* Bars representing growth/analytics */}
    <rect width="6" height="14" y="5" x="1" fill="url(#logo-gradient-bars)" rx="2" />
    <rect x="9" width="6" height="18" y="3" fill="url(#logo-gradient-bars)" rx="2" />
    <rect x="17" width="6" height="24" fill="url(#logo-gradient-bars)" rx="2" />
  </svg>
);
