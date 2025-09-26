import React from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { CheckCircleIcon } from './common/icons/CheckCircleIcon';

interface UpgradeViewProps {
  onUpgrade: (plan: 'basic' | 'pro') => void;
}

const basicFeatures = [
    '20 AI Simulations / month',
    'Full Scenario Library Access',
    'Standard Performance Analytics',
    'Personalized Action Plans',
    'Email Support'
];
const proFeatures = [
    'Unlimited AI Simulations',
    'Unlimited Live Call Co-Pilot',
    'Advanced Performance Analytics',
    'Full Scenario Library Access',
    'Priority Support'
];

const FeatureListItem: React.FC<{ children: React.ReactNode, available: boolean }> = ({ children, available }) => (
    <li className={`flex items-center gap-3 ${available ? '' : 'text-gray-500'}`}>
        <CheckCircleIcon className={`w-6 h-6 flex-shrink-0 ${available ? 'text-brand-green' : 'text-dark-700'}`} />
        <span className={available ? 'text-gray-300' : 'line-through'}>{children}</span>
    </li>
);

const UpgradeView: React.FC<UpgradeViewProps> = ({ onUpgrade }) => {
  return (
    <div className="animate-fade-in py-12">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white">Choose Your Plan</h2>
            <p className="text-lg text-gray-400 mt-2">Unlock the tools you need to become a top 1% closer.</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <Card className="p-8 border-2 border-dark-700 flex flex-col">
            <h3 className="text-2xl font-bold text-white">Basic</h3>
            <p className="text-gray-400 mt-1">For consistent, focused practice.</p>
            <p className="my-6">
                <span className="text-4xl font-bold text-white">$19</span>
                <span className="text-lg font-medium text-gray-400">/month</span>
            </p>
            <Button onClick={() => onUpgrade('basic')} variant="secondary" className="w-full !py-3 !text-base justify-center">
                Choose Basic
            </Button>
            <hr className="border-dark-700 my-8"/>
            <ul className="space-y-4 flex-grow">
               <FeatureListItem available={true}>20 AI Simulations / month</FeatureListItem>
               <FeatureListItem available={true}>Full Scenario Library</FeatureListItem>
               <FeatureListItem available={true}>Standard Performance Analytics</FeatureListItem>
               <FeatureListItem available={false}>Live Call Co-Pilot</FeatureListItem>
               <FeatureListItem available={false}>Advanced Analytics</FeatureListItem>
            </ul>
        </Card>

        {/* Pro Plan */}
        <Card className="p-8 border-2 border-brand-purple flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-purple text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                BEST VALUE
            </div>
            <h3 className="text-2xl font-bold text-white">Pro</h3>
            <p className="text-gray-400 mt-1">For professionals who want it all.</p>
            <p className="my-6">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-lg font-medium text-gray-400">/month</span>
            </p>
            <Button onClick={() => onUpgrade('pro')} variant="primary" className="w-full !py-3 !text-base justify-center">
                Upgrade to Pro
            </Button>
            <hr className="border-dark-700 my-8"/>
            <ul className="space-y-4 flex-grow">
               <FeatureListItem available={true}>Unlimited AI Simulations</FeatureListItem>
               <FeatureListItem available={true}>Full Scenario Library</FeatureListItem>
               <FeatureListItem available={true}>Standard Performance Analytics</FeatureListItem>
               <FeatureListItem available={true}>Live Call Co-Pilot</FeatureListItem>
               <FeatureListItem available={true}>Advanced Analytics</FeatureListItem>
            </ul>
        </Card>
      </div>
      <p className="text-xs text-gray-500 text-center mt-8">This is a simulation. No payment will be processed.</p>
    </div>
  );
};

export default UpgradeView;
