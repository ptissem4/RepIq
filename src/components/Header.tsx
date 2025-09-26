import React, { useState, useRef, useEffect } from 'react';
import { RepIQLogo } from './common/icons/RepIQLogo';
import { UserProfile } from '../types';
import Button from './common/Button';
import { ArrowLeftOnRectangleIcon } from './common/icons/ArrowLeftOnRectangleIcon';
import { UserIcon } from './common/icons/UserIcon';
import { useTranslation } from '../contexts/LanguageContext';
import { GlobeAltIcon } from './common/icons/GlobeAltIcon';

interface HeaderProps {
  onReturnToHome: () => void;
  userProfile: UserProfile;
  onViewAccount: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReturnToHome, userProfile, onViewAccount }) => {
  const { t, language, setLanguage } = useTranslation();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const renderPlanStatus = () => {
    switch (userProfile.subscriptionStatus) {
      case 'pro':
        return (
          <div className="px-3 py-1 text-sm font-bold bg-gradient-to-r from-brand-purple to-brand-green text-white rounded-full">
            PRO
          </div>
        );
      case 'basic':
        return (
          <div className="text-right">
            <p className="text-white font-semibold">
              {userProfile.monthlySimulationsLimit! - userProfile.creditsUsed} / {userProfile.monthlySimulationsLimit} {t('header.simsLeft')}
            </p>
            <p className="text-xs text-gray-400">{t('header.basicPlan')}</p>
          </div>
        );
      case 'trial':
      default:
        const remainingCredits = userProfile.monthlySimulationsLimit! - userProfile.creditsUsed;
        return (
          <div className="text-right">
            <p className="text-white font-semibold">{remainingCredits > 0 ? remainingCredits : 0} {t('header.creditsRemaining')}</p>
            <p className="text-xs text-gray-400">{t('header.trialPeriod')}</p>
          </div>
        );
    }
  };

  return (
    <header className="bg-dark-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-dark-700">
      <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <button 
          onClick={onReturnToHome} 
          className="flex items-center bg-transparent border-none p-0 cursor-pointer group"
          aria-label="Back to home"
        >
          <RepIQLogo className="w-8 h-8 group-hover:opacity-80 transition-opacity" />
          <h1 className="ml-3 text-2xl font-bold text-white tracking-tight">
            RepIQ
          </h1>
        </button>

        <div className="flex items-center gap-4">
          {renderPlanStatus()}
          <div ref={langDropdownRef} className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold bg-dark-700 text-gray-300 hover:bg-dark-600 transition-colors"
            >
              <GlobeAltIcon className="w-5 h-5" />
              {language.split('-')[0].toUpperCase()}
            </button>
            {isLangDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-36 bg-dark-800 border border-dark-700 rounded-lg shadow-lg z-20 animate-fade-in">
                <button onClick={() => { setLanguage('en-US'); setIsLangDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-700">English</button>
                <button onClick={() => { setLanguage('fr-FR'); setIsLangDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-700">Français</button>
              </div>
            )}
          </div>
           <button onClick={onViewAccount} className="w-9 h-9 rounded-full overflow-hidden border-2 border-dark-600 hover:border-brand-purple transition-colors" aria-label={t('header.myAccount')}>
            {userProfile.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt={t('header.myAccount')} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-dark-700 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
            )}
          </button>
          <Button onClick={onReturnToHome} variant="secondary" className="!px-3" aria-label={t('header.logout')}>
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
