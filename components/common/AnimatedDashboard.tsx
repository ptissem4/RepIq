import React from 'react';

const AnimatedDashboard: React.FC = () => {
    return (
        <div className="w-full h-full bg-dark-800 p-4 rounded-lg flex flex-col gap-4 overflow-hidden">
            <style>
                {`
                    @keyframes growBar {
                        from { transform: scaleY(0); }
                        to { transform: scaleY(1); }
                    }
                    .bar {
                        transform-origin: bottom;
                        animation: growBar 1.5s ease-out forwards;
                    }
                `}
            </style>
            <div className="flex gap-2">
                <div className="w-1/2 bg-dark-700 p-2 rounded flex items-center gap-2">
                    <div className="p-2 bg-purple-500/20 rounded-md"><div className="w-4 h-4 bg-purple-400 rounded-sm"></div></div>
                    <div><p className="text-xs font-bold text-white">Avg. Score</p><p className="text-[10px] text-gray-400">82</p></div>
                </div>
                <div className="w-1/2 bg-dark-700 p-2 rounded flex items-center gap-2">
                    <div className="p-2 bg-green-500/20 rounded-md"><div className="w-4 h-4 bg-green-400 rounded-sm"></div></div>
                    <div><p className="text-xs font-bold text-white">Completed</p><p className="text-[10px] text-gray-400">21</p></div>
                </div>
            </div>
            <div className="bg-dark-700 p-3 rounded flex-grow flex flex-col">
                <p className="text-xs font-bold text-white mb-2">Score Evolution</p>
                <div className="flex-grow flex items-end justify-between px-2">
                    <div className="w-2 h-[40%] bg-brand-purple/50 rounded-full bar" style={{animationDelay: '0s'}}></div>
                    <div className="w-2 h-[60%] bg-brand-purple/60 rounded-full bar" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-[50%] bg-brand-purple/70 rounded-full bar" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-[75%] bg-brand-purple/80 rounded-full bar" style={{animationDelay: '0.3s'}}></div>
                    <div className="w-2 h-[90%] bg-brand-purple/90 rounded-full bar" style={{animationDelay: '0.4s'}}></div>
                </div>
            </div>
             <div className="bg-dark-700 p-3 rounded h-1/4">
                 <p className="text-xs font-bold text-white mb-1">Next Challenge</p>
                 <div className="w-full bg-dark-600 h-3 rounded-full"></div>
             </div>
        </div>
    );
};

export default AnimatedDashboard;