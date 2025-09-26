
import React from 'react';

export const AcmeIncLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 120 30"
    fill="currentColor"
    className="text-gray-400"
    {...props}
  >
    <path d="M10.1 21.7L0 0h6.1l4 12.3 4-12.3h6.1L10.1 21.7z" />
    <path d="M37.8 21.7V0h6.1v21.7h-6.1z" />
    <path d="M63.5 10.9c0-6 4.9-10.9 10.9-10.9s10.9 4.9 10.9 10.9-4.9 10.9-10.9 10.9-10.9-4.8-10.9-10.9zm15.9 0c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5z" />
    <path d="M96.3 21.7V0h15.9v4h-9.8v3.4h8.8v4h-8.8v6.3h9.8v4h-15.9z" />
  </svg>
);
