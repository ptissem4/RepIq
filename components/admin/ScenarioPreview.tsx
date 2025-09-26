import React from 'react';
import { Scenario } from '../../types';
import Card from '../common/Card';
import { UserIcon } from '../common/icons/UserIcon';
import { BotIcon } from '../common/icons/BotIcon';

interface ScenarioPreviewProps {
  scenario: Scenario;
}

const ScenarioPreview: React.FC<ScenarioPreviewProps> = ({ scenario }) => {

  const extractInitialLine = (instruction: string): string => {
    if (!instruction) return "The AI's opening line will appear here...";
    const match = instruction.match(/(?:Start by saying:|commencez en disant\s?:)\s*['"«\s](.*?)['"»\s]?$/i);
    if (match && match[1]) {
      return match[1];
    }
    return "Could not determine opening line from prompt. Check format.";
  };

  const initialLine = extractInitialLine(scenario.systemInstruction);

  return (
    <div>
        <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
        <div className="sticky top-6">
            <Card className="p-6 space-y-4">
                {/* Scenario Header */}
                <div className="flex items-center gap-4 border-b border-dark-700 pb-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                        {scenario.prospect.avatarUrl ? (
                            <img
                                src={scenario.prospect.avatarUrl}
                                alt={scenario.prospect.name || 'Prospect'}
                                className="w-full h-full rounded-full object-cover border-2 border-dark-600"
                                // Handle broken image links gracefully
                                onError={(e) => (e.currentTarget.src = 'https://i.pravatar.cc/150')}
                            />
                        ) : (
                             <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center border-2 border-dark-600">
                                <UserIcon className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                         <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-dark-800 border-2 border-dark-600">
                            <BotIcon className="w-5 h-5 text-brand-purple" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">{scenario.title || 'Scenario Title'}</h4>
                        <p className="text-sm text-gray-400">{scenario.prospect.name || 'Prospect Name'} - {scenario.prospect.role || 'Prospect Role'}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-xs text-gray-400">Category</p>
                        <p className="font-semibold text-white">{scenario.category || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Difficulty</p>
                        <p className={`font-semibold text-white px-2 py-0.5 rounded-full text-xs inline-block ${
                            scenario.details.difficulty === 'Easy' ? 'bg-green-500/20' : 
                            scenario.details.difficulty === 'Hard' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                        }`}>{scenario.details.difficulty || 'N/A'}</p>
                    </div>
                     <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="font-semibold text-white">{scenario.details.duration || 'N/A'}</p>
                    </div>
                </div>

                 {/* Opening Line */}
                 <div>
                    <h5 className="text-sm font-semibold text-gray-300 mb-2">AI's Opening Line:</h5>
                    <div className="bg-dark-900/50 p-4 rounded-lg border border-dark-700">
                        <p className="text-gray-300 italic">"{initialLine}"</p>
                    </div>
                 </div>

                 <div>
                    <h5 className="text-sm font-semibold text-gray-300 mb-2">Description:</h5>
                    <p className="text-gray-400 text-sm">{scenario.description || 'Enter a description for the scenario.'}</p>
                 </div>
            </Card>
        </div>
    </div>
  );
};

export default ScenarioPreview;
