
import React from 'react';
import { EarIcon } from '../common/icons/EarIcon';
import { ClipboardDocumentListIcon } from '../common/icons/ClipboardDocumentListIcon';
import { Spinner } from '../common/Spinner';

const CoPilotScreenshot: React.FC = () => {
  return (
    <div className="w-full h-full bg-dark-800 p-4 flex flex-col font-sans justify-between">
        <div>
            <h2 className="text-lg font-bold text-white text-center">Live Call Co-Pilot</h2>
            <p className="text-sm text-gray-400 text-center">Get AI suggestions during calls</p>
        </div>
        <div className="flex flex-col items-center justify-center">
            <p className="text-gray-400 mb-2 text-sm">Listening to prospect...</p>
            <div className="w-24 h-24 rounded-full bg-brand-red/80 flex items-center justify-center animate-pulse">
                <EarIcon className="w-12 h-12 text-white" />
            </div>
        </div>
        <div className="bg-dark-700 rounded-lg p-3 animate-fade-in" style={{animationDelay: '1s'}}>
            <div className="flex items-center gap-2 mb-2">
                <ClipboardDocumentListIcon className="w-4 h-4 text-brand-green" />
                <h3 className="font-semibold text-white text-sm">Suggested Response:</h3>
            </div>
            <p className="text-gray-200 text-sm">"That's a fair question. Let's break down the value you'd get with our approach, which actually addresses that specific concern."</p>
        </div>
    </div>
  );
};

export default CoPilotScreenshot;
