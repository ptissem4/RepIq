import React from 'react';

const AnimatedAnalytics: React.FC = () => {
    return (
        <div className="w-full h-full bg-dark-800 p-4 rounded-lg flex flex-col gap-4 overflow-hidden">
            <style>
                {`
                    @keyframes fillBar {
                        from { width: 0%; }
                    }
                    .progress-bar {
                        animation: fillBar 1.5s ease-out forwards;
                    }
                `}
            </style>
            <div className="bg-dark-700 p-3 rounded text-center">
                 <p className="text-xs text-gray-400">Overall Score</p>
                 <p className="text-2xl font-bold text-white">87</p>
            </div>
            <div className="bg-dark-700 p-3 rounded flex-grow flex flex-col justify-around">
                <div>
                    <p className="text-xs font-bold text-white mb-1">Rapport Building</p>
                    <div className="w-full bg-dark-600 rounded-full h-2">
                        <div className="bg-brand-purple h-2 rounded-full progress-bar" style={{width: '90%', animationDelay: '0s'}}></div>
                    </div>
                </div>
                <div>
                    <p className="text-xs font-bold text-white mb-1">Objection Handling</p>
                    <div className="w-full bg-dark-600 rounded-full h-2">
                        <div className="bg-brand-purple h-2 rounded-full progress-bar" style={{width: '75%', animationDelay: '0.2s'}}></div>
                    </div>
                </div>
                 <div>
                    <p className="text-xs font-bold text-white mb-1">Closing</p>
                    <div className="w-full bg-dark-600 rounded-full h-2">
                        <div className="bg-brand-green h-2 rounded-full progress-bar" style={{width: '82%', animationDelay: '0.4s'}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedAnalytics;