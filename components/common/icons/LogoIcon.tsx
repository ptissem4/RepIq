import React from 'react';
export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="icon-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34D399"/>
        <stop offset="100%" stopColor="#8B5CF6"/>
      </linearGradient>
    </defs>
    <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="url(#icon-gradient)"/>
    <path d="M12 5.5V18.5" stroke="black" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9.5 8.5C9.5 7.39543 10.3954 6.5 11.5 6.5H12.5C14.1569 6.5 15.5 7.84315 15.5 9.5C15.5 11.1569 14.1569 12.5 12.5 12.5H11.5C9.84315 12.5 8.5 13.8431 8.5 15.5C8.5 17.1569 9.84315 18.5 11.5 18.5H14.5" stroke="black" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);