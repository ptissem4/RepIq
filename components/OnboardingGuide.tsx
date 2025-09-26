
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Button from './common/Button';

interface OnboardingGuideProps {
  onComplete: () => void;
}

const steps = [
  {
    targetId: 'onboarding-challenges',
    title: 'Start with a Challenge',
    content: 'This is where you can find AI-powered role-play scenarios. Pick one to start practicing.',
    position: 'top',
  },
  {
    targetId: 'onboarding-copilot',
    title: 'Live Call Co-Pilot',
    content: 'Use this during a real sales call to get instant AI suggestions for what to say next. It\'s your secret weapon!',
    position: 'top',
  },
  {
    targetId: 'onboarding-history',
    title: 'Review Your History',
    content: 'After each session, you can review your performance, analytics, and full transcript here.',
    position: 'bottom-end',
  },
];

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const updateTargetRect = () => {
    const targetElement = document.getElementById(steps[currentStep].targetId);
    if (targetElement) {
      setTargetRect(targetElement.getBoundingClientRect());
    }
  };

  useLayoutEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    return () => window.removeEventListener('resize', updateTargetRect);
  }, [currentStep]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };
  
  const getTooltipPosition = () => {
      if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      const { position } = steps[currentStep];
      
      switch(position) {
          case 'top':
            return { top: `${targetRect.top - 16}px`, left: `${targetRect.left + targetRect.width / 2}px`, transform: 'translate(-50%, -100%)'};
          case 'bottom-end':
            return { top: `${targetRect.bottom + 16}px`, left: `${targetRect.right}px`, transform: 'translateX(-100%)' };
          default:
            return { top: `${targetRect.bottom + 16}px`, left: `${targetRect.left + targetRect.width / 2}px`, transform: 'translateX(-50%)'};
      }
  }

  const highlightStyle: React.CSSProperties = targetRect ? {
    position: 'fixed',
    top: `${targetRect.top - 8}px`,
    left: `${targetRect.left - 8}px`,
    width: `${targetRect.width + 16}px`,
    height: `${targetRect.height + 16}px`,
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
    borderRadius: '12px',
    transition: 'all 0.3s ease-in-out',
    pointerEvents: 'none',
    zIndex: 1000,
  } : {};
  
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    ...getTooltipPosition(),
    transition: 'all 0.3s ease-in-out',
    zIndex: 1001,
  };

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div style={highlightStyle}></div>
      <div style={tooltipStyle} className="w-80 bg-dark-800 border border-dark-700 rounded-lg shadow-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-2">{steps[currentStep].title}</h3>
        <p className="text-gray-300 mb-4">{steps[currentStep].content}</p>
        <div className="flex justify-between items-center">
          <button onClick={handleSkip} className="text-sm text-gray-400 hover:text-white">Skip Tour</button>
          <div className="flex items-center gap-2">
             <span className="text-sm text-gray-500">{currentStep + 1} / {steps.length}</span>
            <Button onClick={handleNext} variant="primary">
              {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;
