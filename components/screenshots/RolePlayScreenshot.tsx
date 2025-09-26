
import React from 'react';
import { UserIcon } from '../common/icons/UserIcon';

const RolePlayScreenshot: React.FC = () => {
    return (
        <div className="w-full h-full bg-dark-800 p-3 flex flex-col font-sans">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center gap-3 p-2 border-b border-dark-700/50">
                <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="David Chen" className="w-8 h-8 rounded-full"/>
                <div>
                    <p className="text-sm font-bold text-white">David Chen</p>
                    <p className="text-xs text-green-400">Online</p>
                </div>
            </div>
            {/* Chat Area */}
            <div className="flex-grow flex flex-col justify-end gap-3 py-3 overflow-hidden">
                <div className="flex items-start gap-2 animate-fade-in" style={{ animationDelay: '0.2s'}}>
                    <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="David Chen" className="w-6 h-6 rounded-full flex-shrink-0"/>
                    <div className="p-2.5 rounded-lg rounded-bl-sm bg-dark-700 max-w-[80%]">
                        <p className="text-sm text-gray-200">Thanks for coming back. Honestly, I think we should be listing at least $50,000 higher.</p>
                    </div>
                </div>
                <div className="flex items-start gap-2 flex-row-reverse animate-fade-in" style={{ animationDelay: '0.8s'}}>
                     <div className="w-6 h-6 rounded-full bg-dark-600 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-4 h-4 text-gray-300"/>
                    </div>
                    <div className="p-2.5 rounded-lg rounded-br-sm bg-brand-purple max-w-[80%]">
                        <p className="text-sm text-white">I understand, and I appreciate you sharing that. Many sellers feel the same way. Can we quickly look at the latest market data together?</p>
                    </div>
                </div>
            </div>
            {/* Input */}
            <div className="flex-shrink-0 p-2 border-t border-dark-700/50">
                <div className="w-full h-9 bg-dark-700 rounded-full flex items-center px-3">
                    <p className="text-sm text-gray-500">Respond to David...</p>
                </div>
            </div>
        </div>
    );
};

export default RolePlayScreenshot;
