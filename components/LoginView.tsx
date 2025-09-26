

import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { RepIQLogo } from './common/icons/RepIQLogo';
import { getMockData } from '../services/mockAdminData';
import { User } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface LoginViewProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
  onReturnToHome: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ users, onLoginSuccess, onReturnToHome }) => {
  const { t } = useTranslation();
  const { organizations } = getMockData(); // Organizations list can still be mocked for grouping
  const [selectedUserId, setSelectedUserId] = useState<string>(users.find(u => u.role === 'super-admin')?.id || users[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedUser = users.find(u => u.id === selectedUserId);
    if (selectedUser) {
      onLoginSuccess(selectedUser);
    }
  };
  
  const getRoleName = (role: 'super-admin' | 'manager' | 'member') => {
      switch (role) {
          case 'super-admin': return t('login.roles.admin');
          case 'manager': return t('login.roles.manager');
          case 'member': return t('login.roles.member');
          default: return role;
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
            <RepIQLogo className="w-16 h-16 mx-auto"/>
            <h1 className="mt-4 text-3xl font-bold text-white tracking-tight">
                {t('login.title')}
            </h1>
            <p className="mt-2 text-lg text-gray-400">{t('login.subtitle')}</p>
        </div>
        <Card className="p-8">
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="user-select" className="block text-sm font-medium text-gray-300 mb-2">
                            {t('login.loginAs')}
                        </label>
                        <select
                            id="user-select"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none"
                        >
                            {organizations.map(org => (
                                <optgroup key={org.id} label={org.name}>
                                    {users.filter(u => u.organizationId === org.id).map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({getRoleName(user.role)})
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                    <Button 
                        type="submit"
                        variant="primary" 
                        className="w-full !py-4 !text-lg justify-center"
                    >
                        {t('login.button')}
                    </Button>
                </div>
                 <p className="text-xs text-gray-500 text-center mt-6">{t('login.disclaimer')}</p>
            </form>
        </Card>
        <div className="text-center mt-6">
            <button onClick={onReturnToHome} className="text-sm text-gray-400 hover:text-white transition-colors">
                &larr; {t('login.backToHome')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
