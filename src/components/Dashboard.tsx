


import React from 'react';
import { Scenario, UserStats, CompletedSession, UserProfile, CoachingProgram, UserProgramProgress } from '../types';
import Card from './common/Card';
import { ArrowRightIcon } from './common/icons/ArrowRightIcon';
import Button from './common/Button';
import { ClockIcon } from './common/icons/ClockIcon';
import { FireIcon } from './common/icons/FireIcon';
import { StarIcon } from './common/icons/StarIcon';
import { BroadcastIcon } from './common/icons/BroadcastIcon';
import { UserCircleIcon } from './common/icons/UserCircleIcon';
import { TrophyIcon } from './common/icons/TrophyIcon';
import { CheckBadgeIcon } from './common/icons/CheckBadgeIcon';
import ScoreEvolutionChart from './ScoreEvolutionChart';
import { WrenchScrewdriverIcon } from './common/icons/WrenchScrewdriverIcon';
import { CheckCircleIcon } from './common/icons/CheckCircleIcon';
import { AcademicCapIcon } from './common/icons/AcademicCapIcon';
import { SparklesIcon } from './common/icons/SparklesIcon';
import { useTranslation } from '../contexts/LanguageContext';

interface DashboardProps {
  scenarios: Scenario[];
  sessions: CompletedSession[];
  userStats: UserStats;
  userProfile: UserProfile;
  assignedPrograms: CoachingProgram[];
  userProgress: UserProgramProgress[];
  onStartSession: (scenario: Scenario) => void;
  onViewHistory: () => void;
  onStartLiveAssist: () => void;
  onViewAccount: () => void;
  onUpgrade: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  scenarios, 
  sessions,
  userStats, 
  userProfile,
  assignedPrograms,
  userProgress,
  onStartSession, 
  onViewHistory, 
  onStartLiveAssist,
  onViewAccount,
  onUpgrade
}) => {
  const { t } = useTranslation();
  
  const hasCredits = userProfile.subscriptionStatus === 'pro' || 
                   (userProfile.monthlySimulationsLimit !== null && userProfile.creditsUsed < userProfile.monthlySimulationsLimit);

  const canUseCoPilot = userProfile.subscriptionStatus === 'pro' || userProfile.subscriptionStatus === 'trial';

  const displayedScenarios = userProfile.subscriptionStatus === 'trial'
    ? scenarios.filter(s => s.details.difficulty === 'Easy')
    : scenarios;

  const averageScore = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.feedback.overallScore, 0) / sessions.length)
    : 0;

  const scenariosCompleted = sessions.length;

  const getPerformanceSummary = () => {
    const strengths: Record<string, number> = {};
    const improvements: Record<string, number> = {};

    sessions.forEach(session => {
        session.feedback.strengths.forEach(strength => {
            strengths[strength] = (strengths[strength] || 0) + 1;
        });
        session.feedback.areasForImprovement.forEach(imp => {
            improvements[imp] = (improvements[imp] || 0) + 1;
        });
    });

    const topStrengths = Object.entries(strengths).sort((a, b) => b[1] - a[1]).slice(0, 3).map(item => item[0]);
    const topImprovements = Object.entries(improvements).sort((a, b) => b[1] - a[1]).slice(0, 3).map(item => item[0]);

    return { topStrengths, topImprovements };
  }

  const { topStrengths, topImprovements } = getPerformanceSummary();

  const handleContinueProgram = (program: CoachingProgram) => {
    const progress = userProgress.find(p => p.programId === program.id);
    const completedIds = new Set(progress?.completedStageScenarioIds || []);
    const sortedStages = [...program.stages].sort((a, b) => a.order - b.order);
    
    const nextStage = sortedStages.find(stage => !completedIds.has(stage.scenarioId));
    if (nextStage) {
      const nextScenario = scenarios.find(s => s.id === nextStage.scenarioId);
      if (nextScenario) {
        onStartSession(nextScenario);
      }
    }
  };


  const UpgradeBanner = () => {
    if (userProfile.subscriptionStatus === 'pro') return null;

    const remainingCredits = userProfile.monthlySimulationsLimit! - userProfile.creditsUsed;

    return (
      <Card className="p-6 text-center bg-gradient-to-r from-brand-purple/20 to-brand-green/10">
          <h3 className="text-2xl font-bold text-white">{t('dashboard.upgradeBanner.title')}</h3>
          <p className="text-gray-300 mt-1 mb-4">
            {userProfile.subscriptionStatus === 'trial' 
              ? t('dashboard.upgradeBanner.trialText', { remainingCredits: remainingCredits > 0 ? remainingCredits : 0 })
              : t('dashboard.upgradeBanner.basicText')}
          </p>
          <Button onClick={onUpgrade} variant="primary">
              {t('dashboard.upgradeBanner.button')}
          </Button>
      </Card>
    );
  };

  return (
    <div className="animate-fade-in space-y-12">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">{t('dashboard.welcome', { name: userProfile.name?.split(' ')[0] || '' })}</h2>
            <p className="text-lg text-gray-400">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onViewHistory} variant="secondary" id="onboarding-history">
              <ClockIcon className="w-5 h-5 mr-2"/>
              {t('dashboard.historyButton')}
            </Button>
          </div>
        </div>
        
        <Card className="p-4 mt-6 flex items-center gap-4 bg-dark-800/80 border-brand-purple/20">
            <SparklesIcon className="w-8 h-8 text-brand-purple flex-shrink-0" />
            <div>
                <p className="italic text-gray-300">"Your attitude, not your aptitude, will determine your altitude."</p>
                <p className="text-right text-sm font-semibold text-gray-400 mt-1">- Zig Ziglar</p>
            </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-lg"><FireIcon className="w-6 h-6 text-orange-400" /></div>
                <div><p className="text-2xl font-bold text-white">{userStats.streak.count}</p><p className="text-sm text-gray-400">{t('dashboard.dayStreak')}</p></div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg"><StarIcon className="w-6 h-6 text-yellow-400" /></div>
                <div><p className="text-2xl font-bold text-white">{userStats.totalXp}</p><p className="text-sm text-gray-400">{t('dashboard.totalXp')}</p></div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg"><TrophyIcon className="w-6 h-6 text-purple-400" /></div>
                <div><p className="text-2xl font-bold text-white">{averageScore}</p><p className="text-sm text-gray-400">{t('dashboard.avgScore')}</p></div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg"><CheckBadgeIcon className="w-6 h-6 text-green-400" /></div>
                <div><p className="text-2xl font-bold text-white">{scenariosCompleted}</p><p className="text-sm text-gray-400">{t('dashboard.completed')}</p></div>
            </Card>
        </div>
      </div>
      
      <UpgradeBanner />

      {assignedPrograms.length > 0 && (
        <Card>
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <AcademicCapIcon className="w-6 h-6 text-brand-purple" />
                    <h3 className="text-2xl font-bold text-white">{t('dashboard.coachingPrograms.title')}</h3>
                </div>
                <div className="space-y-4">
                    {assignedPrograms.map(program => {
                        const progress = userProgress.find(p => p.programId === program.id);
                        const completedCount = progress?.completedStageScenarioIds.length || 0;
                        const totalCount = program.stages.length;
                        const isCompleted = completedCount === totalCount;
                        return (
                            <Card key={program.id} className="p-4 bg-dark-900/50">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-white">{program.name}</h4>
                                        <p className="text-sm text-gray-400">{program.description}</p>
                                    </div>
                                    <Button onClick={() => handleContinueProgram(program)} variant={isCompleted ? 'secondary' : 'primary'} disabled={isCompleted || !hasCredits}>
                                        {isCompleted ? t('dashboard.coachingPrograms.completed') : t('dashboard.coachingPrograms.continue')}
                                    </Button>
                                </div>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="w-full bg-dark-700 rounded-full h-2.5">
                                        <div className="bg-brand-green h-2.5 rounded-full" style={{ width: `${(completedCount / totalCount) * 100}%` }}></div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-300">{completedCount} / {totalCount}</span>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </Card>
      )}

      <Card id="onboarding-copilot" className={`relative flex flex-col md:flex-row items-center justify-between p-6 gap-4 bg-gradient-to-r from-brand-purple/20 to-brand-green/10 ${!canUseCoPilot ? 'opacity-60' : ''}`}>
          {!canUseCoPilot && <div className="absolute inset-0 bg-dark-900/40 rounded-lg"></div>}
          <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">{t('dashboard.liveCoPilot.title')}</h3>
              <p className="text-gray-300 mt-1">{t('dashboard.liveCoPilot.subtitle')}</p>
              {!canUseCoPilot && <p className="text-yellow-400 text-sm font-semibold mt-2">{t('dashboard.liveCoPilot.proOnly')}</p>}
          </div>
          <Button onClick={onStartLiveAssist} disabled={!hasCredits || !canUseCoPilot} variant="primary" className="w-full md:w-auto !py-3 !px-6 text-base z-10">
              <BroadcastIcon className="w-5 h-5 mr-3"/>
              {t('dashboard.liveCoPilot.button')}
          </Button>
      </Card>
      
       <div id="onboarding-challenges">
        <h3 className="text-2xl font-bold text-white mb-4">{userProfile.subscriptionStatus === 'trial' ? t('dashboard.challenges.gettingStartedTitle') : t('dashboard.challenges.newChallengeTitle')}</h3>
        <div className="grid gap-4">
            {displayedScenarios.map((scenario) => (
              <Card 
                key={scenario.id} 
                className={`p-4 flex justify-between items-center bg-dark-800 transition-colors duration-200 ${hasCredits ? 'hover:bg-dark-700 cursor-pointer' : 'opacity-50'}`} 
                onClick={() => hasCredits && onStartSession(scenario)}
              >
                <div className="flex items-center gap-4">
                    <img src={scenario.prospect.avatarUrl} alt={scenario.prospect.name} className="w-10 h-10 rounded-full"/>
                    <div>
                        <h4 className="text-md font-semibold text-white">{scenario.title}</h4>
                        <p className="mt-1 text-gray-400 text-sm">{scenario.prospect.name} - {scenario.category}</p>
                    </div>
                </div>
                <Button onClick={(e) => { e.stopPropagation(); if (hasCredits) onStartSession(scenario); }} disabled={!hasCredits} variant="primary" className="!text-sm !py-1.5 !px-3">
                  {t('dashboard.challenges.startButton')}
                </Button>
              </Card>
            ))}
        </div>
         {!hasCredits && (
            <Card className="mt-4 p-4 text-center border-brand-red/50">
                <p className="font-semibold text-red-400">{t('dashboard.challenges.noCredits.title')}</p>
                <p className="text-gray-400 text-sm">{t('dashboard.challenges.noCredits.subtitle')}</p>
                 <Button onClick={onUpgrade} variant="primary" className="mt-3">{t('dashboard.challenges.noCredits.button')}</Button>
            </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;