
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import CoachView from './components/CoachView';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginView from './components/LoginView';
import { Scenario, UserProfile, User, CompletedSession } from './types';
import LandingLayout from './components/LandingLayout';
import PricingPage from './components/PricingPage';
import PaymentPage from './components/PaymentPage';
import PaymentConfirmationPage from './components/PaymentConfirmationPage';
import OnboardingGuide from './components/OnboardingGuide';
import { LanguageProvider } from './contexts/LanguageContext';
import { getInitialData } from './services/apiService';
import { Spinner } from './components/common/Spinner';

type View = 'home' | 'pricing' | 'login' | 'coach' | 'admin' | 'payment' | 'payment_success';

const PROFILE_STORAGE_KEY = 'repIQProfile';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [planToPurchase, setPlanToPurchase] = useState<'basic' | 'pro' | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // All data is now fetched from the server
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInitialData();
        setScenarios(data.scenarios);
        setAllUsers(data.users);
        setCompletedSessions(data.completedSessions);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Could not connect to the server. Please ensure the backend is running and refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (typeof profile.hasCompletedOnboarding === 'undefined') {
          profile.hasCompletedOnboarding = true; 
        }
        return profile;
      }
    } catch (error) {
      console.error("Could not load user profile from local storage", error);
    }
    return {
      subscriptionStatus: 'trial',
      creditsUsed: 0,
      monthlySimulationsLimit: 5,
      lastResetDate: new Date().toISOString(),
      hasCompletedOnboarding: false,
    };
  });

  useEffect(() => {
    try {
        window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
    } catch (error) {
        console.error("Could not save user profile to local storage", error);
    }
  }, [userProfile]);

  useEffect(() => {
    const checkAndResetCredits = () => {
      if (userProfile.subscriptionStatus === 'basic' && userProfile.lastResetDate) {
        const lastReset = new Date(userProfile.lastResetDate);
        const now = new Date();
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
          setUserProfile(prev => ({
            ...prev,
            creditsUsed: 0,
            lastResetDate: now.toISOString(),
          }));
        }
      }
    };
    
    checkAndResetCredits();
    const interval = setInterval(checkAndResetCredits, 1000 * 60 * 60); // Check hourly
    return () => clearInterval(interval);
  }, [userProfile.subscriptionStatus, userProfile.lastResetDate]);


  useEffect(() => {
    if (loggedInUser?.role === 'member' && !userProfile.hasCompletedOnboarding) {
        const timer = setTimeout(() => setShowOnboarding(true), 1000);
        return () => clearTimeout(timer);
    }
  }, [loggedInUser, userProfile.hasCompletedOnboarding]);
  
  const handleLoginSuccess = (user: User) => {
    setLoggedInUser(user);
    const status = user.plan === 'Pro' || user.plan === 'Enterprise' ? 'pro' : user.plan === 'Basic' ? 'basic' : 'trial';

    const newUserProfile: UserProfile = {
        ...user,
        subscriptionStatus: status,
        creditsUsed: 0, // Reset for demo purposes on login
        monthlySimulationsLimit: status === 'pro' ? null : status === 'basic' ? 20 : 5,
        lastResetDate: new Date().toISOString(),
        hasCompletedOnboarding: user.totalSimulations > 0,
    };
    setUserProfile(newUserProfile);

    if (user.role === 'manager' || user.role === 'super-admin') {
        setCurrentView('admin');
    } else {
        setCurrentView('coach');
    }
  };
  
  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentView('home');
  };

  const handleSelectPlan = (plan: 'basic' | 'pro') => {
    setPlanToPurchase(plan);
    setCurrentView('payment');
  };

  const handlePaymentSuccess = (plan: 'basic' | 'pro') => {
    setUserProfile(prev => ({
        ...prev,
        subscriptionStatus: plan,
        creditsUsed: 0,
        monthlySimulationsLimit: plan === 'pro' ? null : 20,
        lastResetDate: new Date().toISOString(),
    }));
    setCurrentView('payment_success');
  };
  
  const handleGoToDashboard = () => {
    setCurrentView('coach');
  };
  
  const handleCancelSubscription = () => {
      setUserProfile(prev => {
          if (prev.subscriptionStatus === 'pro') {
              return {
                  ...prev,
                  subscriptionStatus: 'basic',
                  monthlySimulationsLimit: 20,
                  creditsUsed: 0,
                  lastResetDate: new Date().toISOString(),
              };
          }
          if (prev.subscriptionStatus === 'basic') {
              return {
                  ...prev,
                  subscriptionStatus: 'trial',
                  monthlySimulationsLimit: 5,
                  creditsUsed: 0,
                  lastResetDate: new Date().toISOString(),
              };
          }
          return prev;
      });
  };

  const handleOnboardingComplete = () => {
      setUserProfile(prev => ({ ...prev, hasCompletedOnboarding: true }));
      setShowOnboarding(false);
  };
  
  const renderView = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-lg text-gray-400">Connecting to server...</p>
        </div>
      );
    }

    if (error) {
      return (
         <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-2xl font-bold text-red-400">Connection Error</h2>
          <p className="mt-2 text-gray-300 max-w-md">{error}</p>
        </div>
      );
    }


    switch (currentView) {
      case 'home':
        return <LandingLayout onNavigate={setCurrentView}><LandingPage /></LandingLayout>;
      case 'pricing':
        return <LandingLayout onNavigate={setCurrentView}><PricingPage onSelectPlan={handleSelectPlan} /></LandingLayout>;
      case 'login':
        return <LoginView users={allUsers} onLoginSuccess={handleLoginSuccess} onReturnToHome={() => setCurrentView('home')} />;
      case 'coach':
        return (
          <>
            <CoachView 
              onLogout={handleLogout} 
              scenarios={scenarios} 
              onGoToPricing={() => setCurrentView('pricing')}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              onCancelSubscription={handleCancelSubscription}
              allCompletedSessions={completedSessions}
              setAllCompletedSessions={setCompletedSessions}
            />
            {showOnboarding && <OnboardingGuide onComplete={handleOnboardingComplete} />}
          </>
        );
      case 'admin':
        if (!loggedInUser || (loggedInUser.role !== 'manager' && loggedInUser.role !== 'super-admin')) {
            setCurrentView('login');
            return null;
        }
        return <AdminDashboard 
                  user={loggedInUser} 
                  onLogout={handleLogout} 
                  scenarios={scenarios} 
                  setScenarios={setScenarios}
                  completedSessions={completedSessions}
                  setCompletedSessions={setCompletedSessions}
                  allUsers={allUsers}
                />;
      case 'payment':
        if (!planToPurchase) {
            setCurrentView('pricing');
            return null;
        }
        return <PaymentPage plan={planToPurchase} onPaymentSuccess={handlePaymentSuccess} onReturnToPricing={() => setCurrentView('pricing')} />;
      case 'payment_success':
        if (!planToPurchase) {
            setCurrentView('pricing');
            return null;
        }
        return <PaymentConfirmationPage plan={planToPurchase} onGoToDashboard={handleGoToDashboard}/>;
      default:
        return <LandingLayout onNavigate={setCurrentView}><LandingPage /></LandingLayout>;
    }
  };

  return (
    <LanguageProvider>
      {renderView()}
    </LanguageProvider>
  );
};

export default App;
