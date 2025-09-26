import React from 'react';

export const ClipboardListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        {...props}
    >
        <path
            fillRule="evenodd"
            d="M10.5 3A2.5 2.5 0 008 5.5v1.5a1.5 1.5 0 003 0V5.5A2.5 2.5 0 0010.5 3zm-2.5 2.5a4 4 0 014-4h.5a4 4 0 014 4v1.5a1.5 1.5 0 01-3 0V7.12l.16-.08a3.18 3.18 0 001.27-1.13 2.5 2.5 0 00-3.83-3.83 3.18 3.18 0 00-1.13 1.27l-.08.16V7a1.5 1.5 0 01-3 0v-1.5z"
            clipRule="evenodd"
        />
        <path
            d="M6 10.5a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75-.75zM9 10.5a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6A.75.75 0 019 10.5z"
        />
        <path
            d="M3.75 9.75a2.25 2.25 0 00-2.25 2.25v6A2.25 2.25 0 003.75 20.25h12a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25h-12zM1.5 12a.75.75 0 01.75-.75h15a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-15a.75.75 0 01-.75-.75v-6z"
        />
    </svg>
);
