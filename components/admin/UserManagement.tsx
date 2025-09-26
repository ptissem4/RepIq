
import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import { User, Organization } from '../../types';
import Button from '../common/Button';
import { UserPlusIcon } from '../common/icons/UserPlusIcon';
import InviteMemberModal from './InviteMemberModal';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onSelectUser: (user: User) => void;
  organization: Organization;
  isGlobalView?: boolean;
}

const StatCard: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="bg-dark-900/50 p-4 rounded-lg text-center">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
    </div>
);


const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers, onSelectUser, organization, isGlobalView = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 20;

  const usedSeats = users.length;
  const totalSeats = organization?.licenseLimit || users.length;
  const availableSeats = totalSeats - usedSeats;
  const canInvite = availableSeats > 0;

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (user.role === 'super-admin') return false; // Never show super-admin in user lists
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan = planFilter === 'all' || user.plan === planFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [users, searchTerm, planFilter, statusFilter]);
  
  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, planFilter, statusFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const handleInviteMember = (name: string, email: string) => {
    if (!canInvite) return;
    const orgId = organization?.id;
    if (!orgId) return;

    const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        plan: 'Enterprise',
        status: 'Trial',
        joinedDate: new Date().toLocaleDateString(),
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        lastActivity: 'Never',
        totalSimulations: 0,
        avgScore: 0,
        sessionHistory: [],
        organizationId: orgId,
        role: 'member',
    };

    setUsers(prevUsers => [newUser, ...prevUsers]);
    setIsInviteModalOpen(false);
  };

  const getStatusBadge = (status: 'Active' | 'Inactive' | 'Trial') => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400';
      case 'Inactive': return 'bg-red-500/20 text-red-400';
      case 'Trial': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const commonInputClasses = "w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">{isGlobalView ? 'All Users' : 'My Team Management'}</h1>
          <p className="text-gray-400 mt-1">View, manage, and invite members to your team.</p>
        </div>
        {!isGlobalView && (
            <div className="text-right">
              <Button onClick={() => setIsInviteModalOpen(true)} variant="primary" disabled={!canInvite}>
                  <UserPlusIcon className="w-5 h-5 mr-2" />
                  Invite Member
              </Button>
              {!canInvite && <p className="text-xs text-red-400 mt-1">No available seats.</p>}
            </div>
        )}
      </div>
      
      {!isGlobalView && organization && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-3">License Management</h3>
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Seats Used" value={usedSeats} />
                <StatCard label="Total Seats" value={totalSeats} />
                <StatCard label="Seats Available" value={availableSeats} />
            </div>
          </Card>
      )}


      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${commonInputClasses} md:col-span-1`}
          />
          <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className={commonInputClasses}>
            <option value="all">All Plans</option>
            <option value="Basic">Basic</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Trial">Trial</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={commonInputClasses}>
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Trial">Trial</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-dark-700">
            <tr>
              <th className="p-4 font-semibold text-sm text-gray-300">Name</th>
              <th className="p-4 font-semibold text-sm text-gray-300">Plan</th>
              <th className="p-4 font-semibold text-sm text-gray-300">Status</th>
              <th className="p-4 font-semibold text-sm text-gray-300">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {paginatedUsers.map(user => (
              <tr key={user.id} onClick={() => onSelectUser(user)} className="hover:bg-dark-800 transition-colors cursor-pointer">
                <td className="p-4">
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </td>
                <td className="p-4 text-gray-300">{user.plan}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{user.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
         {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
                <p>No users found matching your criteria.</p>
            </div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm">
          <Button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            variant="secondary"
          >
            Previous
          </Button>
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="secondary"
          >
            Next
          </Button>
        </div>
      )}

      {isInviteModalOpen && (
        <InviteMemberModal onInvite={handleInviteMember} onClose={() => setIsInviteModalOpen(false)} />
      )}
    </div>
  );
};

export default UserManagement;
