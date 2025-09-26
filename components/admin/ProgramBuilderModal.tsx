
import React, { useState, useEffect } from 'react';
import { CoachingProgram, Scenario, User } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { XMarkIcon } from '../common/icons/XMarkIcon';

interface ProgramBuilderModalProps {
  programToEdit: CoachingProgram | null;
  onSave: (programData: Omit<CoachingProgram, 'id' | 'organizationId'>) => void;
  onClose: () => void;
  teamUsers: User[];
  scenarios: Scenario[];
}

const ProgramBuilderModal: React.FC<ProgramBuilderModalProps> = ({ programToEdit, onSave, onClose, teamUsers, scenarios }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<Set<string>>(new Set());
  const [assignedUserIds, setAssignedUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (programToEdit) {
      setName(programToEdit.name);
      setDescription(programToEdit.description);
      setSelectedScenarioIds(new Set(programToEdit.stages.map(s => s.scenarioId)));
      setAssignedUserIds(new Set(programToEdit.assignedUserIds));
    }
  }, [programToEdit]);

  const handleScenarioToggle = (scenarioId: string) => {
    setSelectedScenarioIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(scenarioId)) {
        newSet.delete(scenarioId);
      } else {
        newSet.add(scenarioId);
      }
      return newSet;
    });
  };

  const handleUserToggle = (userId: string) => {
    setAssignedUserIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const programData = {
        name,
        description,
        stages: Array.from(selectedScenarioIds).map((id, index) => ({ scenarioId: id, order: index })),
        assignedUserIds: Array.from(assignedUserIds),
    };
    onSave(programData);
  };

  const inputStyles = "w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none";

  return (
    <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b border-dark-700">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{programToEdit ? 'Edit' : 'Create'} Coaching Program</h3>
              <button type="button" onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-dark-700 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6 overflow-y-auto flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="progName" className="block text-sm font-medium text-gray-300 mb-1">Program Name</label>
                        <input id="progName" type="text" value={name} onChange={e => setName(e.target.value)} required className={inputStyles}/>
                    </div>
                     <div>
                        <label htmlFor="progDesc" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea id="progDesc" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className={inputStyles}></textarea>
                    </div>
                </div>
                <div>
                     <h4 className="text-sm font-medium text-gray-300 mb-2">Select Scenarios (Stages)</h4>
                     <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-dark-800 rounded-lg border border-dark-700">
                        {scenarios.map(scenario => (
                            <label key={scenario.id} className="flex items-center gap-3 p-2 rounded hover:bg-dark-700 cursor-pointer">
                                <input type="checkbox" checked={selectedScenarioIds.has(scenario.id)} onChange={() => handleScenarioToggle(scenario.id)} className="w-4 h-4 rounded bg-dark-600 border-dark-500 text-brand-purple focus:ring-brand-purple" />
                                <span className="text-white">{scenario.title}</span>
                            </label>
                        ))}
                     </div>
                </div>
            </div>
            <div>
                 <h4 className="text-sm font-medium text-gray-300 mb-2">Assign to Team Members</h4>
                 <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-dark-800 rounded-lg border border-dark-700">
                    {teamUsers.map(user => (
                        <label key={user.id} className="flex items-center gap-3 p-2 rounded hover:bg-dark-700 cursor-pointer">
                            <input type="checkbox" checked={assignedUserIds.has(user.id)} onChange={() => handleUserToggle(user.id)} className="w-4 h-4 rounded bg-dark-600 border-dark-500 text-brand-purple focus:ring-brand-purple" />
                            <span className="text-white">{user.name}</span>
                        </label>
                    ))}
                 </div>
            </div>
          </div>
          <div className="p-4 bg-dark-700 flex justify-end gap-4 border-t border-dark-700">
            <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
            <Button type="submit" variant="primary">Save Program</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProgramBuilderModal;
