import React from 'react';

const AnimatedCopilot: React.FC = () => {
  return (
    <div className="w-full h-full bg-dark-800 p-4 rounded-lg flex flex-col justify-between overflow-hidden">
      <style>
        {`
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.1); opacity: 1; }
            }
            .pulse-circle {
                animation: pulse 2s ease-in-out infinite;
            }
            @keyframes type-in {
                from { width: 0; }
                to { width: 100%; }
            }
            .typing-text {
                overflow: hidden;
                white-space: nowrap;
                animation: type-in 2s steps(40, end) 1s forwards;
            }
        `}
      </style>
      <div className="text-center">
        <p className="text-sm font-bold text-white">Live Call Co-Pilot</p>
        <p className="text-xs text-gray-400">Listening to prospect...</p>
        <div className="w-16 h-16 rounded-full bg-brand-purple/50 mx-auto mt-4 flex items-center justify-center pulse-circle">
            <div className="w-12 h-12 rounded-full bg-brand-purple"></div>
        </div>
      </div>
      <div className="bg-dark-700 p-3 rounded">
        <p className="text-xs font-bold text-green-400 mb-2">Suggested Response:</p>
        <div className="typing-text">
            <p className="text-sm text-white">"That's a valid point. Let's explore that..."</p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedCopilot;