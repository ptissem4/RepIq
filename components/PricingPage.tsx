

import React from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { CheckCircleIcon } from './common/icons/CheckCircleIcon';
import { useTranslation } from '../contexts/LanguageContext';

interface PricingPageProps {
  onSelectPlan: (plan: 'basic' | 'pro') => void;
}

const FeatureListItem: React.FC<{ children: React.ReactNode, available?: boolean }> = ({ children, available = true }) => (
    <li className={`flex items-start gap-3 ${available ? '' : 'text-gray-500'}`}>
        <CheckCircleIcon className={`w-6 h-6 flex-shrink-0 ${available ? 'text-brand-green' : 'text-dark-700'}`} />
        <span className={`text-sm ${available ? 'text-gray-300' : 'line-through'}`}>{children}</span>
    </li>
);

const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan }) => {
  const { t } = useTranslation();
  return (
    <div className="animate-fade-in pt-32 pb-20">
        <div className="text-center mb-12 container mx-auto max-w-4xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">{t('pricing.title')}</h1>
            <p className="text-lg text-gray-400 mt-4">{t('pricing.subtitle')}</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {/* Basic Plan */}
        <Card className="p-8 border-2 border-dark-700 flex flex-col hover:border-brand-purple/50 transition-colors">
            <h3 className="text-2xl font-bold text-white">{t('pricing.basic.title')}</h3>
            <p className="text-gray-400 mt-1 flex-grow">{t('pricing.basic.subtitle')}</p>
            <p className="my-6">
                <span className="text-5xl font-bold text-white">$19</span>
                <span className="text-lg font-medium text-gray-400">/{t('pricing.month')}</span>
            </p>
            <Button onClick={() => onSelectPlan('basic')} variant="secondary" className="w-full !py-3 !text-base justify-center">
                {t('pricing.basic.cta')}
            </Button>
            <hr className="border-dark-700 my-8"/>
            <p className="text-sm font-semibold text-white mb-4">{t('pricing.includes')}:</p>
            <ul className="space-y-4 flex-grow">
               <FeatureListItem available={true}>{t('pricing.basic.f1')}</FeatureListItem>
               <FeatureListItem available={true}>{t('pricing.basic.f2')}</FeatureListItem>
               <FeatureListItem available={true}>{t('pricing.basic.f3')}</FeatureListItem>
               <FeatureListItem available={false}>{t('pricing.basic.f4')}</FeatureListItem>
               <FeatureListItem available={false}>{t('pricing.basic.f5')}</FeatureListItem>
            </ul>
        </Card>

        {/* Pro Plan */}
        <Card className="p-8 border-2 border-brand-purple flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-purple text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                {t('pricing.bestValue')}
            </div>
            <h3 className="text-2xl font-bold text-white">{t('pricing.pro.title')}</h3>
            <p className="text-gray-400 mt-1 flex-grow">{t('pricing.pro.subtitle')}</p>
            <p className="my-6">
                <span className="text-5xl font-bold text-white">$29</span>
                <span className="text-lg font-medium text-gray-400">/{t('pricing.month')}</span>
            </p>
            <Button onClick={() => onSelectPlan('pro')} variant="primary" className="w-full !py-3 !text-base justify-center">
                {t('pricing.pro.cta')}
            </Button>
            <hr className="border-dark-700 my-8"/>
            <p className="text-sm font-semibold text-white mb-4">{t('pricing.pro.includes')}:</p>
            <ul className="space-y-4 flex-grow">
               <FeatureListItem available={true}>{t('pricing.pro.f1')}</FeatureListItem>
               <FeatureListItem available={true}>{t('pricing.pro.f2')}</FeatureListItem>
               <FeatureListItem available={true}>{t('pricing.pro.f3')}</FeatureListItem>
               <FeatureListItem available={true}>{t('pricing.pro.f4')}</FeatureListItem>
               <FeatureListItem available={true}>{t('pricing.pro.f5')}</FeatureListItem>
            </ul>
        </Card>
        
        {/* Enterprise Plan */}
        <Card className="p-8 border-2 border-dark-700 flex flex-col bg-dark-700/30 hover:border-brand-green/50 transition-colors">
            <h3 className="text-2xl font-bold text-white">{t('pricing.enterprise.title')}</h3>
            <p className="text-gray-400 mt-1 flex-grow">{t('pricing.enterprise.subtitle')}</p>
            <p className="my-6">
                <span className="text-5xl font-bold text-white">{t('pricing.enterprise.price')}</span>
            </p>
            <a href="mailto:sales@repIQ.ai?subject=Enterprise Plan Inquiry">
                <Button variant="secondary" className="w-full !py-3 !text-base justify-center bg-brand-green/10 !text-brand-green hover:bg-brand-green/20">
                    {t('pricing.enterprise.cta')}
                </Button>
            </a>
            <hr className="border-dark-700 my-8"/>
            <p className="text-sm font-semibold text-white mb-4">{t('pricing.enterprise.includes')}:</p>
            <ul className="space-y-4 flex-grow">
               <FeatureListItem available={true}>{t('pricing.enterprise.f1')}</FeatureListItem>
               <FeatureListItem available={true}>{t('pricing.enterprise.f2')}</FeatureListItem>
               <FeatureListItem available={true}>{t('pricing.enterprise.f3')}</FeatureListItem>
               <FeatureListItem available={true}>{t('pricing.enterprise.f4')}</FeatureListItem>
               <FeatureListItem available={true}>{t('pricing.enterprise.f5')}</FeatureListItem>
            </ul>
        </Card>
      </div>
      <p className="text-xs text-gray-500 text-center mt-8">{t('pricing.disclaimer')}</p>
    </div>
  );
};

export default PricingPage;