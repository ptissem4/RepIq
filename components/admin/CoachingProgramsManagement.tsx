
import React, { useState, useMemo } from 'react';
import { CoachingProgram, UserProgramProgress, User, Scenario } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import ProgramBuilderModal from './ProgramBuilderModal';
import { AcademicCapIcon } from '../common/icons/AcademicCapIcon';
import { ArrowLeftIcon } from '../common/icons/ArrowLeftIcon';

interface CoachingProgramsManagementProps {
    programs: CoachingProgram[];
    setPrograms: React.Dispatch<React.SetStateAction<CoachingProgram[]>>;
    progress: UserProgramProgress[];
    setProgress: React.Dispatch<React.SetStateAction<UserProgramProgress[]>>;
    teamUsers: User[];
    scenarios: Scenario[];
}

const CoachingProgramsManagement: React.FC<CoachingProgramsManagementProps> = ({ programs, setPrograms, progress, setProgress, teamUsers, scenarios }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<CoachingProgram | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<CoachingProgram | null>(null);

    const handleCreateNew = () => {
        setEditingProgram(null);
        setIsModalOpen(true);
    };

    const handleEditProgram = (program: CoachingProgram) => {
        setEditingProgram(program);
        setIsModalOpen(true);
    }
    
    const handleSaveProgram = (programData: Omit<CoachingProgram, 'id' | 'organizationId'>) => {
        const orgId = teamUsers[0]?.organizationId;
        if (!orgId) return;

        if (editingProgram) {
            const updatedProgram = { ...editingProgram, ...programData };
            setPrograms(prev => prev.map(p => p.id === updatedProgram.id ? updatedProgram : p));
        } else {
            const newProgram: CoachingProgram = {
                id: `prog_${Date.now()}`,
                organizationId: orgId,
                ...programData,
            };
            setPrograms(prev => [...prev, newProgram]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteProgram = (programId: string) => {
        if(window.confirm('Are you sure you want to delete this program? This will unassign it from all users.')) {
            setPrograms(prev => prev.filter(p => p.id !== programId));
            if (selectedProgram?.id === programId) {
                setSelectedProgram(null);
            }
        }
    }
    
    const programProgressMap = useMemo(() => {
        const map = new Map<string, { assigned: number, completed: number }>();
        programs.forEach(program => {
            const assignedCount = program.assignedUserIds.length;
            let completedCount = 0;
            program.assignedUserIds.forEach(userId => {
                const userProgress = progress.find(p => p.userId === userId && p.programId === program.id);
                if (userProgress && userProgress.completedStageScenarioIds.length === program.stages.length) {
                    completedCount++;
                }
            });
            map.set(program.id, { assigned: assignedCount, completed: completedCount });
        });
        return map;
    }, [programs, progress]);

    if (selectedProgram) {
        return (
            <div className="animate-fade-in space-y-6">
                 <div className="flex items-center gap-4">
                    <Button onClick={() => setSelectedProgram(null)} variant="secondary" className="!px-3">
                        <ArrowLeftIcon className="w-5 h-5"/>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{selectedProgram.name}</h1>
                        <p className="text-gray-400 mt-1">Track your team's progress for this coaching program.</p>
                    </div>
                </div>
                <Card>
                    <table className="w-full text-left">
                        <thead className="bg-dark-700">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-300">Team Member</th>
                                <th className="p-4 font-semibold text-sm text-gray-300">Progress</th>
                                <th className="p-4 font-semibold text-sm text-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                           {selectedProgram.assignedUserIds.map(userId => {
                                const user = teamUsers.find(u => u.id === userId);
                                const userProgress = progress.find(p => p.userId === userId && p.programId === selectedProgram.id);
                                const completedCount = userProgress?.completedStageScenarioIds.length || 0;
                                const totalCount = selectedProgram.stages.length;
                                const isCompleted = completedCount === totalCount;

                                if (!user) return null;

                                return (
                                    <tr key={userId}>
                                        <td className="p-4 font-medium text-white">{user.name}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-dark-600 rounded-full h-2">
                                                    <div className="bg-brand-green h-2 rounded-full" style={{ width: `${(completedCount / totalCount) * 100}%` }}></div>
                                                </div>
                                                <span className="text-xs font-semibold text-gray-300">{completedCount}/{totalCount}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {isCompleted ? 'Completed' : 'In Progress'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                           })}
                        </tbody>
                    </table>
                </Card>
            </div>
        )
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Coaching Programs</h1>
                    <p className="text-gray-400 mt-1">Create, assign, and track custom training programs for your team.</p>
                </div>
                <Button onClick={handleCreateNew} variant="primary">
                    Create New Program
                </Button>
            </div>

            {programs.length === 0 ? (
                <Card className="p-8 text-center">
                     <AcademicCapIcon className="w-12 h-12 mx-auto text-gray-500 mb-4"/>
                    <h3 className="text-xl font-semibold text-white">No Coaching Programs Yet</h3>
                    <p className="text-gray-400 mt-2">Click "Create New Program" to build your first training path for your team.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map(program => (
                        <Card key={program.id} className="p-6 flex flex-col justify-between hover:border-brand-purple/50 transition-colors">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{program.name}</h3>
                                <p className="text-sm text-gray-400 mb-4 h-20 overflow-hidden">{program.description}</p>
                                <div className="text-sm space-y-2">
                                    <p><span className="font-semibold">{program.stages.length}</span> Stages</p>
                                    <p><span className="font-semibold">{programProgressMap.get(program.id)?.assigned || 0}</span> Members Assigned</p>
                                    <p><span className="font-semibold">{programProgressMap.get(program.id)?.completed || 0}</span> Members Completed</p>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-2">
                                <Button onClick={() => setSelectedProgram(program)} variant="primary" className="w-full justify-center !text-sm">View Progress</Button>
                                <Button onClick={() => handleEditProgram(program)} variant="secondary" className="!text-sm">Edit</Button>
                                <Button onClick={() => handleDeleteProgram(program.id)} variant="danger" className="!text-sm">Delete</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <ProgramBuilderModal
                    programToEdit={editingProgram}
                    onSave={handleSaveProgram}
                    onClose={() => setIsModalOpen(false)}
                    teamUsers={teamUsers}
                    scenarios={scenarios}
                />
            )}
        </div>
    );
};

export default CoachingProgramsManagement;
