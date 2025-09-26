

import React, { useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { CheckCircleIcon } from './common/icons/CheckCircleIcon';
import { RepIQLogo } from './common/icons/RepIQLogo';

interface PaymentConfirmationPageProps {
  plan: 'basic' | 'pro';
  onGoToDashboard: () => void;
}

const PaymentConfirmationPage: React.FC<PaymentConfirmationPageProps> = ({ plan, onGoToDashboard }) => {
  const planDetails = {
    basic: { name: 'Basic Plan', price: '$19/month' },
    pro: { name: 'Pro Plan', price: '$29/month' },
  };
  
  // Auto-redirect after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onGoToDashboard();
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, [onGoToDashboard]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in text-center">
        <RepIQLogo className="w-12 h-12 mx-auto mb-6"/>
        <Card className="p-8">
            <CheckCircleIcon className="w-20 h-20 text-brand-green mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">Payment Successful!</h1>
            <p className="text-gray-300 mt-2">
                Welcome to the <span className="font-bold text-white">{planDetails[plan].name}</span>. Your account has been upgraded.
            </p>
            <div className="my-6 p-4 bg-dark-700 rounded-lg text-left">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Plan:</span>
                    <span className="font-semibold text-white">{planDetails[plan].name}</span>
                </div>
                 <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400">Price:</span>
                    <span className="font-semibold text-white">{planDetails[plan].price}</span>
                </div>
            </div>
            <Button onClick={onGoToDashboard} variant="primary" className="w-full !py-3 !text-lg justify-center">
                Go to My Dashboard
            </Button>
            <p className="text-xs text-gray-500 mt-4">You will be redirected automatically.</p>
        </Card>
      </div>
    </div>
  );
};

export default PaymentConfirmationPage;