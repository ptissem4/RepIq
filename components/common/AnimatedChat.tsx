import React from 'react';

const AnimatedChat: React.FC = () => {
    return (
        <div className="w-full h-full bg-dark-800 p-4 rounded-lg flex flex-col gap-3 justify-end overflow-hidden">
             <style>
                {`
                    @keyframes pop-in {
                        from { transform: scale(0.8); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                    .chat-bubble {
                        animation: pop-in 0.3s ease-out forwards;
                    }
                `}
            </style>
            <div className="flex items-start gap-2 chat-bubble" style={{ animationDelay: '0s'}}>
                <div className="w-6 h-6 rounded-full bg-dark-600 flex-shrink-0"></div>
                <div className="p-2 rounded-lg bg-dark-700 w-3/4">
                    <div className="h-2 bg-dark-600 rounded w-full"></div>
                    <div className="h-2 bg-dark-600 rounded w-2/3 mt-1"></div>
                </div>
            </div>
             <div className="flex items-start gap-2 flex-row-reverse chat-bubble" style={{ animationDelay: '0.5s'}}>
                <div className="w-6 h-6 rounded-full bg-brand-purple flex-shrink-0"></div>
                <div className="p-2 rounded-lg bg-dark-600 w-1/2">
                     <div className="h-2 bg-dark-700 rounded w-full"></div>
                </div>
            </div>
             <div className="flex items-start gap-2 chat-bubble" style={{ animationDelay: '1s'}}>
                <div className="w-6 h-6 rounded-full bg-dark-600 flex-shrink-0"></div>
                <div className="p-2 rounded-lg bg-dark-700 w-2/3">
                    <div className="h-2 bg-dark-600 rounded w-full"></div>
                    <div className="h-2 bg-dark-600 rounded w-1/2 mt-1"></div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedChat;