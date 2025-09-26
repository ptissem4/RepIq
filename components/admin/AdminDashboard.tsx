

import React, { useState, useMemo } from 'react';
import { HomeIcon } from '../common/icons/HomeIcon';
import { UsersIcon } from '../common/icons/UsersIcon';
import { LogoIcon } from '../common/icons/LogoIcon';
import Overview from './Overview';
import UserManagement from './UserManagement';
import ScenarioManagement from './ScenarioManagement';
import { ArrowLeftOnRectangleIcon } from '../common/icons/ArrowLeftOnRectangleIcon';
import { DocumentTextIcon } from '../common/icons/DocumentTextIcon';
import { Scenario, User, Transaction, Organization, CoachingProgram, UserProgramProgress, CompletedSession, Feedback } from '../../types';
import { getMockData } from '../../services/mockAdminData';
import UserDetailsView from './UserDetailsView';
import { ChartBarIcon } from '../common/icons/ChartBarIcon';
import TeamAnalytics from './TeamAnalytics';
import OrganizationManagement from './OrganizationManagement';
import { BuildingOffice2Icon } from '../common/icons/BuildingOffice2Icon';
import OrganizationDetailsView from './OrganizationDetailsView';
import { CurrencyDollarIcon } from '../common/icons/CurrencyDollarIcon';
import RevenueAnalytics from './RevenueAnalytics';
import { AcademicCapIcon } from '../common/icons/AcademicCapIcon';
import CoachingProgramsManagement from './CoachingProgramsManagement';
import FeedbackView from '../FeedbackView';

type AdminView = 'overview' | 'users' | 'revenue' | 'scenarios' | 'performance_hub' | 'organizations' | 'coaching_programs';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  scenarios: Scenario[];
  setScenarios: React.Dispatch<React.SetStateAction<Scenario[]>>;
  completedSessions: CompletedSession[];
  setCompletedSessions: React.Dispatch<React.SetStateAction<CompletedSession[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, scenarios, setScenarios, completedSessions, setCompletedSessions }) => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [viewingAsOrg, setViewingAsOrg] = useState<Organization | null>(null);
  const [sessionToReview, setSessionToReview] = useState<CompletedSession | null>(null);

  const { 
    users: allUsers, 
    transactions: allTransactions, 
    organizations: allOrgs,
    coachingPrograms: allCoachingPrograms,
    programProgress: allProgramProgress,
  } = useMemo(() => getMockData(), []);
  
  const [organizations, setOrganizations] = useState<Organization[]>(allOrgs);
  const [users, setUsers] = useState<User[]>(allUsers);
  const [coachingPrograms, setCoachingPrograms] = useState<CoachingProgram[]>(allCoachingPrograms);
  const [programProgress, setProgramProgress] = useState<UserProgramProgress[]>(allProgramProgress);


  const isSuperAdmin = user.role === 'super-admin';
  const isImpersonating = isSuperAdmin && viewingAsOrg !== null;
  
  const currentOrgForView = isImpersonating ? viewingAsOrg : organizations.find(o => o.id === user.organizationId);
  const isGlobalView = isSuperAdmin && !isImpersonating && !selectedOrganization;

  const visibleUsers = useMemo(() => {
    if (isGlobalView) return users;
    if (selectedOrganization) return users.filter(u => u.organizationId === selectedOrganization.id);
    return users.filter(u => u.organizationId === currentOrgForView?.id);
  }, [users, isGlobalView, currentOrgForView, selectedOrganization]);
  
  const visibleTransactions = useMemo(() => {
    if (isGlobalView) return allTransactions;
    if (selectedOrganization) return allTransactions.filter(t => t.organizationId === selectedOrganization.id);
    if (user.role === 'manager' && !isImpersonating) return [];
    return allTransactions.filter(t => t.organizationId === currentOrgForView?.id);
  }, [allTransactions, isGlobalView, currentOrgForView, selectedOrganization, user.role, isImpersonating]);

  const visibleCoachingPrograms = useMemo(() => {
      if (isGlobalView) return coachingPrograms;
      return coachingPrograms.filter(p => p.organizationId === currentOrgForView?.id);
  }, [coachingPrograms, isGlobalView, currentOrgForView]);

  const visibleProgramProgress = useMemo(() => {
      if (isGlobalView) return programProgress;
      const teamUserIds = new Set(visibleUsers.map(u => u.id));
      return programProgress.filter(p => teamUserIds.has(p.userId));
  }, [programProgress, isGlobalView, visibleUsers]);

  const visibleCompletedSessions = useMemo(() => {
    const teamUserIds = new Set(visibleUsers.map(u => u.id));
    return completedSessions.filter(s => teamUserIds.has(s.userId));
  }, [completedSessions, visibleUsers]);


  const setVisibleUsers = (updatedUsers: User[]) => {
      const updatedUserIds = new Set(updatedUsers.map(u => u.id));
      const currentContextOrgId = selectedOrganization?.id || currentOrgForView?.id;
      const otherUsers = users.filter(u => u.organizationId !== currentContextOrgId);
      setUsers([...otherUsers, ...updatedUsers]);
  };
  
  const navItems = [
    { id: 'overview', label: 'Overview', icon: HomeIcon, for: ['super-admin', 'manager'] },
    { id: 'organizations', label: 'Organizations', icon: BuildingOffice2Icon, for: ['super-admin'] },
    { id: 'users', label: isGlobalView ? 'All Users' : 'My Team', icon: UsersIcon, for: ['super-admin', 'manager'] },
    { id: 'performance_hub', label: 'Performance Hub', icon: ChartBarIcon, for: ['manager'] },
    { id: 'coaching_programs', label: 'Coaching Programs', icon: AcademicCapIcon, for: ['manager'] },
    { id: 'revenue', label: 'Global Revenue', icon: CurrencyDollarIcon, for: ['super-admin'] },
    { id: 'scenarios', label: 'Scenarios', icon: DocumentTextIcon, for: ['super-admin', 'manager'] },
  ].filter(item => isImpersonating ? item.for.includes('manager') : item.for.includes(user.role));

  const handleViewChange = (view: AdminView) => {
    setCurrentView(view);
    setSelectedUser(null);
    setSelectedOrganization(null);
    setSessionToReview(null);
  };
  
  const handleCreateOrg = (name: string, licenseLimit: number) => {
      const newOrgId = `org_${Date.now()}`;
      const newOrg: Organization = { id: newOrgId, name, licenseLimit };
      const newManager: User = {
          id: `user_${Date.now()}`,
          name: `${name} Manager`,
          email: `manager@${name.toLowerCase().replace(/\s+/g, '')}.com`,
          plan: 'Enterprise', status: 'Active',
          joinedDate: new Date().toLocaleDateString(), renewalDate: '', lastActivity: 'Never',
          totalSimulations: 0, avgScore: 0, sessionHistory: [],
          organizationId: newOrgId, role: 'manager',
      };
      setOrganizations(prev => [...prev, newOrg]);
      setUsers(prev => [...prev, newManager]);
  };
  
  const handleViewOrganizationDetails = (org: Organization) => {
      setSelectedOrganization(org);
      setCurrentView('organizations');
  };

  const handleSaveReview = (sessionId: string, feedback: string) => {
    setCompletedSessions(prev => prev.map(s => s.id === sessionId ? {
      ...s,
      managerFeedback: feedback,
      reviewedByManagerId: user.id,
      reviewedAt: new Date().toISOString(),
    } : s));
    setSessionToReview(null); // Return to previous view
  };

  const renderContent = () => {
    if (sessionToReview) {
      return <FeedbackView 
        session={sessionToReview}
        viewer={user}
        onReturn={() => setSessionToReview(null)}
        onSaveReview={handleSaveReview}
      />
    }

    if (selectedUser) {
        return <UserDetailsView 
            user={selectedUser}
            viewer={user}
            setUsers={setUsers}
            onBackToList={() => setSelectedUser(null)}
            onReviewSession={setSessionToReview}
            completedSessions={completedSessions}
        />
    }

    if (selectedOrganization) {
        return <OrganizationDetailsView 
            organization={selectedOrganization} 
            users={visibleUsers} 
            onBack={() => setSelectedOrganization(null)}
            setOrganizations={setOrganizations}
        />;
    }

    switch (currentView) {
      case 'organizations':
        return isSuperAdmin ? <OrganizationManagement 
            organizations={organizations} 
            setOrganizations={setOrganizations} 
            onImpersonate={(org) => {
              setViewingAsOrg(org);
              setCurrentView('overview');
            }} 
            onCreateOrg={handleCreateOrg}
            onViewDetails={handleViewOrganizationDetails}
            /> : null;
      case 'users':
        return (
            <UserManagement 
                users={visibleUsers} 
                setUsers={setVisibleUsers}
                onSelectUser={setSelectedUser}
                organization={currentOrgForView!}
                isGlobalView={isGlobalView}
            />
        );
      case 'performance_hub':
        return <TeamAnalytics 
                  users={visibleUsers} 
                  onSelectUser={setSelectedUser}
                  completedSessions={visibleCompletedSessions}
                />;
       case 'coaching_programs':
        return <CoachingProgramsManagement
            programs={visibleCoachingPrograms}
            setPrograms={setCoachingPrograms}
            progress={visibleProgramProgress}
            setProgress={setProgramProgress}
            teamUsers={visibleUsers.filter(u => u.role === 'member')}
            scenarios={scenarios}
          />
      case 'revenue':
        return isSuperAdmin && !isImpersonating ? <RevenueAnalytics transactions={visibleTransactions} /> : null;
      case 'scenarios':
        return <ScenarioManagement scenarios={scenarios} setScenarios={setScenarios} />;
      case 'overview':
      default:
        return <Overview users={visibleUsers} transactions={visibleTransactions} isGlobalView={isGlobalView} sessions={visibleCompletedSessions} onReviewSession={setSessionToReview} />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-dark-900 font-sans text-gray-300">
      {isImpersonating && (
        <div className="bg-yellow-500 text-black text-center py-2 font-semibold text-sm">
            You are viewing as {viewingAsOrg?.name}. 
            <button onClick={() => setViewingAsOrg(null)} className="ml-4 font-bold underline">Return to Global View</button>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 bg-dark-800 p-6 border-r border-dark-700 flex flex-col">
            <div className="flex items-center gap-3 mb-10">
              <LogoIcon className="w-8 h-8"/>
              <span className="text-xl font-bold text-white">{isSuperAdmin && !isImpersonating ? 'SaaS Admin' : 'Manager'}</span>
            </div>
            <nav className="flex-grow">
              <ul className="space-y-2">
                {navItems.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleViewChange(item.id as AdminView)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold ${
                        currentView === item.id && !selectedUser && !selectedOrganization && !sessionToReview
                        ? 'bg-brand-purple text-white' 
                        : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
               <button
                  onClick={onLogout}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold text-gray-400 hover:bg-dark-700 hover:text-white`}
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
            </div>
          </aside>
          <main className="flex-1 p-8 overflow-y-auto">
            {renderContent()}
          </main>
      </div>
    </div>
  );
};

export default AdminDashboard;