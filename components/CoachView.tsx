import React, { useState, useCallback, useEffect } from 'react';
import { AppState, Scenario, ChatMessage, Feedback, CompletedSession, UserStats, UserProfile, CoPilotTurn, CoPilotSession, CoachingProgram, UserProgramProgress, CoachingStyle } from '../types';
import { COACHING_STYLES, COACHING_ARCHETYPES } from '../constants';
import Dashboard from './Dashboard';
import RolePlaySession from './RolePlaySession';
import FeedbackView from './FeedbackView';
import Header from './Header';
import HistoryView from './HistoryView';
import LiveAssistSession from './LiveAssistSession';
import PreRolePlaySetup from './PreRolePlaySetup';
import AccountView from './AccountView';
import { getMockData } from '../services/mockAdminData';
import { useTranslation, Language } from '../contexts/LanguageContext';


const COPILOT_SESSIONS_STORAGE_KEY = 'closerCoachCoPilotSessions';
const STATS_STORAGE_KEY = 'closerCoachStats';


interface CoachViewProps {
  onLogout: () => void;
  scenarios: Scenario[];
  onGoToPricing: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onCancelSubscription: () => void;
  allCompletedSessions: CompletedSession[];
  setAllCompletedSessions: React.Dispatch<React.SetStateAction<CompletedSession[]>>;
}

const getLocalizedCoachingStyle = (style: CoachingStyle, language: Language): CoachingStyle => {
    if (style.translations && style.translations[language]) {
      const translation = style.translations[language];
      return {
        ...style,
        name: translation.name,
        title: translation.title,
        philosophy: translation.philosophy,
        techniques: translation.techniques,
        systemInstructionModifier: translation.systemInstructionModifier,
      };
    }
    return style;
};


const CoachView: React.FC<CoachViewProps> = ({ 
  onLogout, 
  scenarios, 
  onGoToPricing, 
  userProfile, 
  setUserProfile, 
  onCancelSubscription,
  allCompletedSessions,
  setAllCompletedSessions,
}) => {
  const [appState, setAppState] = useState<AppState>(AppState.DASHBOARD);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);
  const [currentCoPilotSession, setCurrentCoPilotSession] = useState<CoPilotSession | null>(null);
  const { language } = useTranslation();

  const [assignedPrograms, setAssignedPrograms] = useState<CoachingProgram[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgramProgress[]>([]);
  
  const userCompletedSessions = allCompletedSessions.filter(s => s.userId === userProfile.id);

  const [coPilotSessions, setCoPilotSessions] = useState<CoPilotSession[]>(() => {
    try {
      const savedHistory = window.localStorage.getItem(COPILOT_SESSIONS_STORAGE_KEY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Could not load Co-Pilot sessions from local storage", error);
      return [];
    }
  });


  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
        const savedStats = window.localStorage.getItem(STATS_STORAGE_KEY);
        const defaultStats: UserStats = { totalXp: 0, streak: { count: 0, lastCompletedDate: null } };
        return savedStats ? JSON.parse(savedStats) : defaultStats;
    } catch (error) {
        console.error("Could not load stats from local storage", error);
        return { totalXp: 0, streak: { count: 0, lastCompletedDate: null } };
    }
  });

  useEffect(() => {
    if (userProfile.id && userProfile.organizationId) {
        const { coachingPrograms, programProgress } = getMockData();
        const myPrograms = coachingPrograms.filter(p => p.organizationId === userProfile.organizationId && p.assignedUserIds.includes(userProfile.id!));
        const myProgress = programProgress.filter(p => p.userId === userProfile.id);
        setAssignedPrograms(myPrograms);
        setUserProgress(myProgress);
    }
  }, [userProfile.id, userProfile.organizationId]);
  
  useEffect(() => {
    try {
      window.localStorage.setItem(COPILOT_SESSIONS_STORAGE_KEY, JSON.stringify(coPilotSessions));
    } catch (error) {
      console.error("Could not save Co-Pilot sessions to local storage", error);
    }
  }, [coPilotSessions]);

  useEffect(() => {
    try {
        window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(userStats));
    } catch (error) {
        console.error("Could not save stats to local storage", error);
    }
  }, [userStats]);


  const consumeUsage = () => {
    if (userProfile.subscriptionStatus !== 'pro') {
      setUserProfile(prev => ({ ...prev, creditsUsed: prev.creditsUsed + 1 }));
    }
  };

  const hasCredits = userProfile.subscriptionStatus === 'pro' || 
                   (userProfile.monthlySimulationsLimit !== null && userProfile.creditsUsed < userProfile.monthlySimulationsLimit);

  const canUseFeature = (feature: 'simulation' | 'copilot') => {
    if (!hasCredits) return false;
    if (feature === 'copilot' && userProfile.subscriptionStatus === 'basic') return false;
    return true;
  };

  const getLocalizedScenario = useCallback((scenario: Scenario): Scenario => {
    if (scenario.translations && scenario.translations[language]) {
      const translation = scenario.translations[language];
      return {
        ...scenario,
        title: translation.title,
        description: translation.description,
        systemInstruction: translation.systemInstruction,
        lang: language,
        prospect: {
          ...scenario.prospect,
          name: translation.prospect.name,
          role: translation.prospect.role,
        },
        details: {
          ...scenario.details,
          personality: translation.details.personality,
        }
      };
    }
    return {...scenario, lang: 'en-US'};
  }, [language]);

  const localizedScenarios = scenarios.map(getLocalizedScenario);


  const handleStartSessionSetup = useCallback((scenario: Scenario) => {
    if (!canUseFeature('simulation')) {
      onGoToPricing();
      return;
    }
    setCurrentScenario(scenario);
    setChatHistory([]);
    setFeedback(null);
    setAppState(AppState.PRE_ROLEPLAY);
  }, [hasCredits, onGoToPricing]);

  const handleStartRolePlay = useCallback((scenario: Scenario, settings: { coachingStyleId: string; ambientSound: string }) => {
    consumeUsage();
    const allStyles = [...COACHING_STYLES, ...COACHING_ARCHETYPES];
    const style = allStyles.find(s => s.id === settings.coachingStyleId);
    
    const localizedStyle = style ? getLocalizedCoachingStyle(style, language) : null;
    
    const scenarioWithSettings = {
        ...scenario,
        settings: {
            coachingStyleModifier: localizedStyle?.systemInstructionModifier,
            ambientSound: settings.ambientSound,
        },
    };
    setCurrentScenario(scenarioWithSettings);
    setAppState(AppState.ROLEPLAY);
  }, [language]);
  
  const handleStartLiveAssist = useCallback(() => {
    if (!canUseFeature('copilot')) {
      onGoToPricing();
      return;
    }
    consumeUsage();
    const newSession: CoPilotSession = {
        id: `cps-${Date.now()}`,
        timestamp: new Date().toISOString(),
        turns: [],
    };
    setCurrentCoPilotSession(newSession);
    setAppState(AppState.LIVE_ASSIST);
  }, [hasCredits, onGoToPricing]);

  const handleSaveCoPilotTurn = useCallback((turn: Omit<CoPilotTurn, 'id' | 'timestamp'>) => {
    if (!currentCoPilotSession) return;
    
    const newTurn: CoPilotTurn = {
      ...turn,
      id: `cpt-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setCurrentCoPilotSession(prev => {
        if (!prev) return null;
        return { ...prev, turns: [...prev.turns, newTurn] };
    });
  }, [currentCoPilotSession]);

  const handleEndSession = useCallback((finalChatHistory: ChatMessage[]) => {
    setChatHistory(finalChatHistory);
    setAppState(AppState.FEEDBACK);
    setIsLoadingFeedback(true);
  }, []);

  const handleFeedbackLoaded = useCallback((loadedFeedback: Feedback) => {
    setFeedback(loadedFeedback);
    setIsLoadingFeedback(false);
    
    if (currentScenario && chatHistory.length > 0 && userProfile.id) {
        const newSession: CompletedSession = {
            id: `${new Date().toISOString()}-${currentScenario.id}`,
            userId: userProfile.id,
            completedAt: new Date().toISOString(),
            scenario: currentScenario,
            chatHistory: chatHistory,
            feedback: loadedFeedback
        };
        setAllCompletedSessions(prev => [newSession, ...prev]);

        // Update program progress
        const programInProgress = assignedPrograms.find(p => p.stages.some(s => s.scenarioId === currentScenario.id));
        if (programInProgress && userProfile.id) {
            const currentProgress = userProgress.find(p => p.programId === programInProgress.id);
            if (currentProgress && !currentProgress.completedStageScenarioIds.includes(currentScenario.id)) {
                const updatedProgress: UserProgramProgress = {
                    ...currentProgress,
                    completedStageScenarioIds: [...currentProgress.completedStageScenarioIds, currentScenario.id],
                };
                setUserProgress(prev => prev.map(p => p.programId === programInProgress.id ? updatedProgress : p));
                
                const { programProgress: globalProgress } = getMockData();
                const globalProgressIndex = globalProgress.findIndex(p => p.programId === programInProgress.id && p.userId === userProfile.id);
                if (globalProgressIndex > -1) {
                    globalProgress[globalProgressIndex] = updatedProgress;
                }
            }
        }
    }

    // Update Gamification Stats
    setUserStats(prevStats => {
        const xpGained = loadedFeedback.overallScore;
        const newTotalXp = prevStats.totalXp + xpGained;

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        const lastDateStr = prevStats.streak.lastCompletedDate;
        let newStreakCount = prevStats.streak.count;

        if (lastDateStr !== todayStr) {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (lastDateStr === yesterdayStr) {
                newStreakCount += 1;
            } else {
                newStreakCount = 1;
            }
        }
        
        return {
            totalXp: newTotalXp,
            streak: {
                count: newStreakCount,
                lastCompletedDate: todayStr,
            },
        };
    });

  }, [currentScenario, chatHistory, assignedPrograms, userProgress, userProfile.id, setAllCompletedSessions]);

  const handleReturnToDashboard = useCallback(() => {
    if (appState === AppState.LIVE_ASSIST && currentCoPilotSession && currentCoPilotSession.turns.length > 0) {
      setCoPilotSessions(prev => [currentCoPilotSession, ...prev]);
    }
    setCurrentCoPilotSession(null);
    setCurrentScenario(null);
    setChatHistory([]);
    setFeedback(null);
    setAppState(AppState.DASHBOARD);
  }, [appState, currentCoPilotSession]);
  
  const handleViewHistory = useCallback(() => {
    setAppState(AppState.HISTORY);
  }, []);

  const handleViewAccount = useCallback(() => {
    setAppState(AppState.ACCOUNT);
  }, []);

  const handleViewSessionFromHistory = useCallback((session: CompletedSession) => {
    setCurrentScenario(session.scenario);
    setChatHistory(session.chatHistory);
    setFeedback(session.feedback);
    setAppState(AppState.FEEDBACK);
  }, []);

  const handleStartScenarioFromFeedback = useCallback((scenarioId: string) => {
    const scenarioToStart = scenarios.find(s => s.id === scenarioId);
    if (scenarioToStart) {
      handleStartSessionSetup(getLocalizedScenario(scenarioToStart));
    }
  }, [scenarios, handleStartSessionSetup, getLocalizedScenario]);
  
  const handleRenameSession = (sessionId: string, newTitle: string) => {
    setAllCompletedSessions(prev => prev.map(s => s.id === sessionId ? { ...s, customTitle: newTitle } : s));
  };
  const handleDeleteSession = (sessionId: string) => {
    setAllCompletedSessions(prev => prev.filter(s => s.id !== sessionId));
  };
  const handleRenameCoPilotSession = (sessionId: string, newTitle: string) => {
    setCoPilotSessions(prev => prev.map(s => s.id === sessionId ? { ...s, customTitle: newTitle } : s));
  };
  const handleDeleteCoPilotSession = (sessionId: string) => {
    setCoPilotSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.DASHBOARD:
        return <Dashboard 
                  scenarios={localizedScenarios} 
                  sessions={userCompletedSessions}
                  onStartSession={handleStartSessionSetup} 
                  onViewHistory={handleViewHistory} 
                  userStats={userStats}
                  userProfile={userProfile}
                  onStartLiveAssist={handleStartLiveAssist}
                  onViewAccount={handleViewAccount}
                  onUpgrade={onGoToPricing}
                  assignedPrograms={assignedPrograms}
                  userProgress={userProgress}
                />;
      case AppState.PRE_ROLEPLAY:
        if (!currentScenario) return null;
        return (
          <PreRolePlaySetup
            scenario={currentScenario}
            onStartRolePlay={handleStartRolePlay}
            onReturnToDashboard={handleReturnToDashboard}
          />
        );
      case AppState.ROLEPLAY:
        if (!currentScenario) return null;
        return (
          <RolePlaySession
            scenario={currentScenario}
            onEndSession={handleEndSession}
            onReturnToDashboard={handleReturnToDashboard}
          />
        );
      case AppState.LIVE_ASSIST:
        return (
          <LiveAssistSession
            onReturnToDashboard={handleReturnToDashboard}
            onSaveCoPilotTurn={handleSaveCoPilotTurn}
          />
        );
      case AppState.FEEDBACK:
        return (
          <FeedbackView
            feedback={feedback}
            isLoading={isLoadingFeedback}
            chatHistory={chatHistory}
            onFeedbackLoaded={handleFeedbackLoaded}
            onReturnToDashboard={handleReturnToDashboard}
            onStartScenario={handleStartScenarioFromFeedback}
            scenario={currentScenario!}
            scenarios={localizedScenarios}
            userProfile={userProfile}
            onUpgrade={onGoToPricing}
          />
        );
       case AppState.HISTORY:
        return (
            <HistoryView 
                sessions={userCompletedSessions}
                coPilotSessions={coPilotSessions}
                onViewSession={handleViewSessionFromHistory}
                onReturnToDashboard={handleReturnToDashboard}
                onRenameSession={handleRenameSession}
                onDeleteSession={handleDeleteSession}
                onRenameCoPilotSession={handleRenameCoPilotSession}
                onDeleteCoPilotSession={handleDeleteCoPilotSession}
            />
        );
      case AppState.ACCOUNT:
        return <AccountView 
                  userProfile={userProfile} 
                  setUserProfile={setUserProfile}
                  onReturnToDashboard={handleReturnToDashboard} 
                  onUpgrade={onGoToPricing}
                  onCancelSubscription={onCancelSubscription}
                />;
      default:
        return <Dashboard 
                  scenarios={localizedScenarios} 
                  sessions={userCompletedSessions}
                  onStartSession={handleStartSessionSetup} 
                  onViewHistory={handleViewHistory} 
                  userStats={userStats} 
                  userProfile={userProfile}
                  onStartLiveAssist={handleStartLiveAssist}
                  onViewAccount={handleViewAccount}
                  onUpgrade={onGoToPricing}
                  assignedPrograms={assignedPrograms}
                  userProgress={userProgress}
               />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 font-sans">
      <Header onReturnToHome={onLogout} userProfile={userProfile} onViewAccount={handleViewAccount} />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default CoachView;