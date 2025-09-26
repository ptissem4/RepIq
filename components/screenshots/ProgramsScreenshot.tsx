
import React from 'react';
import { AcademicCapIcon } from '../common/icons/AcademicCapIcon';
import { FireIcon } from '../common/icons/FireIcon';
import { TrophyIcon } from '../common/icons/TrophyIcon';
import Button from '../common/Button';

const ProgramsScreenshot: React.FC = () => {
    return (
        <div className="w-full h-full bg-dark-800 p-3 flex flex-col font-sans gap-3">
            {/* Header */}
            <div className="flex-shrink-0">
                <h2 className="text-lg font-bold text-white">Welcome Back, Alex!</h2>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                <div className="bg-dark-700 p-2 rounded-lg flex items-center gap-2">
                    <div className="p-1.5 bg-orange-500/20 rounded-md"><FireIcon className="w-4 h-4 text-orange-400" /></div>
                    <div><p className="text-sm font-bold text-white">5</p><p className="text-[10px] text-gray-400">Day Streak</p></div>
                </div>
                 <div className="bg-dark-700 p-2 rounded-lg flex items-center gap-2">
                    <div className="p-1.5 bg-purple-500/20 rounded-md"><TrophyIcon className="w-4 h-4 text-purple-400" /></div>
                    <div><p className="text-sm font-bold text-white">82</p><p className="text-[10px] text-gray-400">Avg. Score</p></div>
                </div>
            </div>

            {/* Coaching Programs Card */}
            <div className="bg-dark-700 rounded-lg p-3 flex-grow flex flex-col animate-fade-in" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                    <AcademicCapIcon className="w-5 h-5 text-brand-purple" />
                    <h3 className="font-semibold text-white text-sm">My Coaching Programs</h3>
                </div>
                <div className="bg-dark-800 p-3 rounded-lg flex-grow flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold text-white text-sm">Onboarding Program</h4>
                        <p className="text-xs text-gray-400">Essential scenarios for new hires.</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-full bg-dark-600 rounded-full h-1.5">
                                <div className="bg-brand-green h-1.5 rounded-full" style={{ width: `33%` }}></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-300">1 / 3</span>
                        </div>
                         <Button variant="primary" className="w-full !py-1.5 !text-xs justify-center mt-3">
                            Continue Program
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramsScreenshot;
