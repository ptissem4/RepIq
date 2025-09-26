import React, { useState, useRef, useEffect } from 'react';
import { RepIQLogo } from './common/icons/RepIQLogo';
import Button from './common/Button';
import { useTranslation } from '../contexts/LanguageContext';
import { GlobeAltIcon } from './common/icons/GlobeAltIcon';

type View = 'home' | 'pricing' | 'login' | 'coach' | 'admin';

interface LandingLayoutProps {
  children: React.ReactNode;
  onNavigate: (view: View) => void;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children, onNavigate }) => {
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

  const scrollTo = (id: string) => {
    if(window.location.pathname !== '/') {
        onNavigate('home');
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-sm border-b border-dark-700/50">
        <div className="container mx-auto max-w-6xl px-4 flex justify-between items-center">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-3 cursor-pointer">
                <RepIQLogo className="w-8 h-8"/>
                <span className="text-xl font-bold text-white">RepIQ</span>
            </button>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                  <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }} className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">{t('landingLayout.features')}</a>
                  <button onClick={() => onNavigate('pricing')} className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">{t('landingLayout.pricing')}</button>
              </nav>
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
                    <button onClick={() => { setLanguage('en-US'); setIsLangDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-700">{t('landingLayout.english')}</button>
                    <button onClick={() => { setLanguage('fr-FR'); setIsLangDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-700">{t('landingLayout.french')}</button>
                  </div>
                )}
              </div>
              <Button onClick={() => onNavigate('login')} variant="secondary">{t('landingLayout.login')}</Button>
            </div>
        </div>
      </header>

      <div className="flex-grow">
        {children}
      </div>

      <footer className="py-8 border-t border-dark-700/50">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-gray-500 text-sm">{t('landingLayout.footer.copyright', { year: new Date().getFullYear() })}</p>
            <Button onClick={() => onNavigate('login')} variant="secondary" className="text-xs !py-1 !px-2 mt-4 md:mt-0">
              {t('landingLayout.footer.adminLogin')}
            </Button>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;