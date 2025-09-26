
import React from 'react';

const ProgressBar: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-300">{label}</span>
            <span className="text-xs font-bold text-white">{value}/100</span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-brand-purple to-brand-green h-1.5 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const AnalyticsScreenshot: React.FC = () => {
  return (
    <div className="w-full h-full bg-dark-800 p-4 flex flex-col font-sans gap-4">
        <h2 className="text-lg font-bold text-white text-center flex-shrink-0">Feedback Report</h2>
        
        <div className="w-32 h-32 rounded-full border-4 border-green-400 flex items-center justify-center font-bold text-5xl text-white mx-auto flex-shrink-0 bg-green-500/20">
            87
        </div>
        <p className="text-xs text-gray-400 text-center -mt-2">Overall Score</p>

        <div className="bg-dark-700 rounded-lg p-3">
             <h3 className="font-semibold text-white text-sm mb-2 text-center">Key Strengths</h3>
             <ul className="text-xs text-gray-300 space-y-1 text-center">
                <li>+ Great rapport building</li>
                <li>+ Confident tonality</li>
             </ul>
        </div>
        
        <div className="bg-dark-700 rounded-lg p-3 flex-grow">
             <h3 className="font-semibold text-white text-sm mb-3 text-center">Core Skill Scores</h3>
             <div className="space-y-3">
                <ProgressBar value={92} label="Rapport Building" />
                <ProgressBar value={78} label="Objection Handling" />
                <ProgressBar value={81} label="Closing" />
             </div>
        </div>
    </div>
  );
};

export default AnalyticsScreenshot;
