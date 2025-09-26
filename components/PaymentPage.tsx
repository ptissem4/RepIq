
import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { Spinner } from './common/Spinner';
import { LogoIcon } from './common/icons/LogoIcon';
import { LockClosedIcon } from './common/icons/LockClosedIcon';
import { ArrowLeftIcon } from './common/icons/ArrowLeftIcon';
import { CreditCardIcon } from './common/icons/CreditCardIcon';

interface PaymentPageProps {
  plan: 'basic' | 'pro';
  onPaymentSuccess: (plan: 'basic' | 'pro') => void;
  onReturnToPricing: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ plan, onPaymentSuccess, onReturnToPricing }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const planDetails = {
    basic: { name: 'Basic Plan', price: '$19/month' },
    pro: { name: 'Pro Plan', price: '$29/month' },
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      onPaymentSuccess(plan);
      setIsProcessing(false);
    }, 2000);
  };
  
  const inputStyles = "w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-purple focus:outline-none";

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <LogoIcon className="w-12 h-12 mx-auto mb-3"/>
          <h1 className="text-2xl font-bold text-white">Complete Your Purchase</h1>
          <p className="text-gray-400">You are upgrading to the <span className="font-bold text-white">{planDetails[plan].name}</span>.</p>
        </div>
        
        <Card className="p-8">
          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-300 mb-1">Name on Card</label>
              <input id="cardName" type="text" required className={inputStyles} placeholder="John Doe" />
            </div>
            
            {/* Simulated Stripe Card Element */}
            <div>
              <label htmlFor="card-element" className="block text-sm font-medium text-gray-300 mb-1">
                Card Details
              </label>
              <div id="card-element" className={`${inputStyles} flex items-center gap-3 focus-within:ring-2 focus-within:ring-brand-purple`}>
                <CreditCardIcon className="w-6 h-6 text-gray-400" />
                <span className="text-gray-500">Card number</span>
                <span className="flex-grow"></span>
                <span className="text-gray-500">MM / YY</span>
                <span className="text-gray-500">CVC</span>
              </div>
            </div>
            
            <Button type="submit" variant="primary" className="w-full !py-3 !text-lg justify-center" disabled={isProcessing}>
              {isProcessing ? <Spinner /> : `Pay ${planDetails[plan].price}`}
            </Button>
            
            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
              <LockClosedIcon className="w-4 h-4" /> This is a simulated and secure transaction.
            </p>
          </form>
        </Card>

        <div className="text-center mt-6">
          <button onClick={onReturnToPricing} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
