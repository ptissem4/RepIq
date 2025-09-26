import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { ArrowLeftIcon } from './common/icons/ArrowLeftIcon';
import { UserProfile } from '../types';
import ConfirmationModal from './common/ConfirmationModal';
import { DocumentArrowDownIcon } from './common/icons/DocumentArrowDownIcon';
import { CameraIcon } from './common/icons/CameraIcon';
import { UserIcon } from './common/icons/UserIcon';
import { useTranslation } from '../contexts/LanguageContext';


interface AccountViewProps {
  onReturnToDashboard: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onUpgrade: () => void;
  onCancelSubscription: () => void;
}

const AccountView: React.FC<AccountViewProps> = ({ onReturnToDashboard, userProfile, setUserProfile, onUpgrade, onCancelSubscription }) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { subscriptionStatus, creditsUsed, monthlySimulationsLimit } = userProfile;
  const { t } = useTranslation();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userProfile.name || '',
    email: userProfile.email || '',
  });

  useEffect(() => {
    setProfileData({
      name: userProfile.name || '',
      email: userProfile.email || '',
    });
  }, [userProfile]);


  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setUserProfile(prev => ({
            ...prev,
            avatarUrl: event.target.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = () => {
    setUserProfile(prev => ({
        ...prev,
        name: profileData.name,
        email: profileData.email,
    }));
    setIsEditingProfile(false);
  };

  const handleProfileCancel = () => {
    setProfileData({
        name: userProfile.name || '',
        email: userProfile.email || '',
    });
    setIsEditingProfile(false);
  };

  const handleConfirmCancel = () => {
    onCancelSubscription();
    setIsCancelModalOpen(false);
  };

  const getPlanName = () => {
    switch (subscriptionStatus) {
      case 'pro': return t('account.plans.pro');
      case 'basic': return t('account.plans.basic');
      case 'trial': return t('account.plans.trial');
    }
  };

  const getPlanBadgeClass = () => {
    switch (subscriptionStatus) {
      case 'pro': return 'bg-brand-purple/20 text-brand-purple';
      case 'basic': return 'bg-blue-500/20 text-blue-400';
      case 'trial': return 'bg-gray-500/20 text-gray-300';
    }
  };
  
  const billingHistory = [
    { id: 'inv_1', date: 'July 15, 2024', description: 'Pro Plan Monthly', amount: '$29.00' },
    { id: 'inv_2', date: 'June 15, 2024', description: 'Pro Plan Monthly', amount: '$29.00' },
    { id: 'inv_3', date: 'May 15, 2024', description: 'Basic Plan Monthly', amount: '$19.00' },
  ];

  const inputFieldClasses = "w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none";

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">{t('account.title')}</h2>
          <p className="text-gray-400">{t('account.subtitle')}</p>
        </div>
        <Button onClick={onReturnToDashboard} variant="secondary">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          {t('common.backToDashboard')}
        </Button>
      </div>

       <Card className="p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-dark-700 pb-6 mb-6">
            <div className="relative flex-shrink-0">
                {userProfile.avatarUrl ? (
                    <img 
                        src={userProfile.avatarUrl}
                        alt="Profile Avatar"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-dark-700 flex items-center justify-center">
                        <UserIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}
                <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-brand-purple p-2 rounded-full cursor-pointer hover:bg-brand-purple/80 transition-colors border-4 border-dark-800">
                    <CameraIcon className="w-5 h-5 text-white" />
                    <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleAvatarChange}
                    />
                </label>
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h3 className="text-xl font-bold text-white">{t('account.profile.title')}</h3>
              <p className="text-gray-400">{t('account.profile.subtitle')}</p>
            </div>
         </div>

        <div className="flex justify-end mb-6">
            {!isEditingProfile ? (
            <Button onClick={() => setIsEditingProfile(true)} variant="secondary" className="!text-xs !py-1 !px-3">{t('account.profile.editButton')}</Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleProfileCancel} variant="secondary" className="!text-xs !py-1 !px-3">{t('common.cancel')}</Button>
              <Button onClick={handleProfileSave} variant="primary" className="!text-xs !py-1 !px-3">{t('common.save')}</Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label htmlFor="name" className="text-gray-400 sm:col-span-1">{t('account.profile.name')}:</label>
            <div className="sm:col-span-2">
              {isEditingProfile ? (
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className={inputFieldClasses}
                />
              ) : (
                <p className="font-semibold text-white">{userProfile.name}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label htmlFor="email" className="text-gray-400 sm:col-span-1">{t('account.profile.email')}:</label>
            <div className="sm:col-span-2">
              {isEditingProfile ? (
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={inputFieldClasses}
                />
              ) : (
                <p className="font-semibold text-white">{userProfile.email}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h3 className="text-xl font-bold text-white border-b border-dark-700 pb-4 mb-6">{t('account.subscription.title')}</h3>
        
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-gray-400">{t('account.subscription.currentPlan')}:</span>
                <span className={`font-semibold px-3 py-1 rounded-full text-sm ${getPlanBadgeClass()}`}>{getPlanName()}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-gray-400">{t('account.subscription.status')}:</span>
                <span className="font-semibold text-green-400">{t('account.subscription.active')}</span>
            </div>
            
            <div className="flex justify-between items-center">
                <span className="text-gray-400">{t('account.subscription.usage')}:</span>
                 {subscriptionStatus === 'pro' && <span className="font-semibold text-white">{t('account.subscription.unlimited')}</span>}
                 {subscriptionStatus === 'basic' && <span className="font-semibold text-white">{t('account.subscription.simsUsed', { used: creditsUsed, limit: monthlySimulationsLimit })}</span>}
                 {subscriptionStatus === 'trial' && <span className="font-semibold text-white">{t('account.subscription.creditsUsed', { used: creditsUsed, limit: monthlySimulationsLimit })}</span>}
            </div>
            
            {subscriptionStatus !== 'trial' && (
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">{t('account.subscription.renewalDate')}:</span>
                    <span className="font-semibold text-white">August 15, 2024 ({t('account.subscription.simulated')})</span>
                </div>
            )}
        </div>

        <div className="mt-8 pt-6 border-t border-dark-700 flex flex-col sm:flex-row gap-4">
            {subscriptionStatus !== 'pro' && (
                <Button onClick={onUpgrade} variant="primary" className="w-full justify-center">{t('account.subscription.changePlan')}</Button>
            )}
            {subscriptionStatus !== 'trial' && (
                <Button onClick={() => setIsCancelModalOpen(true)} variant="danger" className="w-full justify-center">{t('account.subscription.cancel')}</Button>
            )}
        </div>
      </Card>
      
       <Card className="p-8">
        <h3 className="text-xl font-bold text-white border-b border-dark-700 pb-4 mb-6">{t('account.payment.title')}</h3>
         <div className="flex justify-between items-center">
            <p className="text-gray-300">{t('account.payment.cardInfo')}</p>
            <Button variant="secondary" className="!text-xs !py-1 !px-3">{t('account.payment.updateButton')}</Button>
        </div>
      </Card>
      
       <Card className="overflow-hidden">
        <div className="p-6 border-b border-dark-700">
            <h3 className="text-xl font-bold text-white">{t('account.billing.title')}</h3>
        </div>
        <table className="w-full text-left">
            <thead className="bg-dark-700/50">
                <tr>
                    <th className="p-4 font-semibold text-sm text-gray-300">{t('account.billing.date')}</th>
                    <th className="p-4 font-semibold text-sm text-gray-300">{t('account.billing.description')}</th>
                    <th className="p-4 font-semibold text-sm text-gray-300">{t('account.billing.amount')}</th>
                    <th className="p-4 font-semibold text-sm text-gray-300"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
                {billingHistory.map(item => (
                    <tr key={item.id}>
                        <td className="p-4 text-gray-400">{item.date}</td>
                        <td className="p-4 text-white font-medium">{item.description}</td>
                        <td className="p-4 text-gray-300">{item.amount}</td>
                        <td className="p-4 text-right">
                           <Button variant="secondary" className="!p-2">
                                <DocumentArrowDownIcon className="w-5 h-5"/>
                           </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </Card>

      {isCancelModalOpen && (
        <ConfirmationModal 
            title={t('account.cancelModal.title')}
            message={t('account.cancelModal.message', { planName: getPlanName() })}
            confirmText={t('account.cancelModal.confirm')}
            onConfirm={handleConfirmCancel}
            onClose={() => setIsCancelModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AccountView;