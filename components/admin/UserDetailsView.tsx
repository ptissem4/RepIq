

import React, { useState } from 'react';
import { User, CompletedSession } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { ArrowLeftIcon } from '../common/icons/ArrowLeftIcon';
import UserForm from './UserForm';
import ConfirmationModal from '../common/ConfirmationModal';
import { CheckBadgeIcon } from '../common/icons/CheckBadgeIcon';
import { TrophyIcon } from '../common/icons/TrophyIcon';
import { ClockIcon } from '../common/icons/ClockIcon';

interface UserDetailsViewProps {
  user: User;
  viewer: User;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onBackToList: () => void;
  onReviewSession: (session: CompletedSession) => void;
  completedSessions: CompletedSession[];
}

const UserDetailsView: React.FC<UserDetailsViewProps> = ({ user, viewer, setUsers, onBackToList, onReviewSession, completedSessions }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const userSessionHistory = React.useMemo(() => {
    return completedSessions
      .filter(s => s.userId === user.id)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }, [completedSessions, user.id]);

  const handleSaveUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    setIsEditModalOpen(false);
  };
  
  const handleDeleteUser = () => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    setIsDeleteModalOpen(false);
    onBackToList();
  };

  const handleDeactivateUser = () => {
    const deactivatedUser = { ...user, status: 'Inactive' as const };
    setUsers(prev => prev.map(u => (u.id === deactivatedUser.id ? deactivatedUser : u)));
    setIsDeactivateModalOpen(false);
    onBackToList();
  };

  const getStatusBadge = (status: 'Active' | 'Inactive' | 'Trial') => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400';
      case 'Inactive': return 'bg-red-500/20 text-red-400';
      case 'Trial': return 'bg-blue-500/20 text-blue-400';
    }
  };
  
  return (
    <div className="animate-fade-in space-y-6">
        <div className="flex items-center gap-4">
            <Button onClick={onBackToList} variant="secondary" className="!px-3">
                <ArrowLeftIcon className="w-5 h-5"/>
            </Button>
            <div>
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">User Details</h3>
                        <Button onClick={() => setIsEditModalOpen(true)} variant="secondary" className="!text-xs !py-1 !px-3">Edit</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><p className="text-gray-400">Status</p><p className={`font-semibold inline-block px-2 py-0.5 rounded-full text-xs ${getStatusBadge(user.status)}`}>{user.status}</p></div>
                        <div><p className="text-gray-400">Plan</p><p className="font-semibold text-white">{user.plan}</p></div>
                        <div><p className="text-gray-400">Joined Date</p><p className="font-semibold text-white">{user.joinedDate}</p></div>
                        <div><p className="text-gray-400">Renewal Date</p><p className="font-semibold text-white">{user.renewalDate}</p></div>
                    </div>
                </Card>
                <Card className="overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white">Session History</h3>
                    </div>
                     <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="bg-dark-700 sticky top-0">
                                <tr>
                                    <th className="p-4 font-semibold text-sm text-gray-300">Date</th>
                                    <th className="p-4 font-semibold text-sm text-gray-300">Scenario</th>
                                    <th className="p-4 font-semibold text-sm text-gray-300">Score</th>
                                    <th className="p-4 font-semibold text-sm text-gray-300">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {userSessionHistory.map(session => (
                                    <tr key={session.id} onClick={() => onReviewSession(session)} className="hover:bg-dark-800 transition-colors cursor-pointer">
                                        <td className="p-4 text-gray-400">{new Date(session.completedAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-white font-medium">{session.scenario.title}</td>
                                        <td className="p-4 font-bold text-white">{session.feedback.overallScore}</td>
                                        <td className="p-4">
                                            {session.managerFeedback ? (
                                                <span className="px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-300 rounded-full">Reviewed</span>
                                            ) : (
                                                <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-500/20 text-yellow-300 rounded-full">Pending</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {userSessionHistory.length === 0 && <p className="p-6 text-center text-gray-500">No sessions recorded.</p>}
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-lg"><CheckBadgeIcon className="w-6 h-6 text-green-400" /></div>
                        <div><p className="text-gray-400 text-sm">Total Sims</p><p className="text-2xl font-bold text-white">{user.totalSimulations}</p></div>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg"><TrophyIcon className="w-6 h-6 text-purple-400" /></div>
                        <div><p className="text-gray-400 text-sm">Average Score</p><p className="text-2xl font-bold text-white">{user.avgScore}</p></div>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/20 rounded-lg"><ClockIcon className="w-6 h-6 text-yellow-400" /></div>
                        <div><p className="text-gray-400 text-sm">Last Activity</p><p className="font-semibold text-white">{user.lastActivity}</p></div>
                    </div>
                </Card>
                 <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Admin Actions</h3>
                    <div className="space-y-4">
                        <Button variant="secondary" className="w-full justify-center">Reset Credits (Simulated)</Button>
                        {viewer.role === 'super-admin' ? (
                            <Button onClick={() => setIsDeleteModalOpen(true)} variant="danger" className="w-full justify-center">Delete User</Button>
                        ) : (
                            <Button onClick={() => setIsDeactivateModalOpen(true)} variant="danger" className="w-full justify-center">Deactivate User</Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>

        {isEditModalOpen && (
            <UserForm 
                user={user}
                viewer={viewer}
                onSave={handleSaveUser}
                onClose={() => setIsEditModalOpen(false)}
            />
        )}
        {isDeleteModalOpen && (
            <ConfirmationModal 
                title="Delete User"
                message={`Are you sure you want to delete ${user.name}? This will permanently remove their data.`}
                onConfirm={handleDeleteUser}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        )}
        {isDeactivateModalOpen && (
            <ConfirmationModal 
                title="Deactivate User"
                message={`Are you sure you want to deactivate ${user.name}? They will lose access to the platform.`}
                confirmText="Deactivate"
                onConfirm={handleDeactivateUser}
                onClose={() => setIsDeactivateModalOpen(false)}
            />
        )}
    </div>
  );
};

export default UserDetailsView;