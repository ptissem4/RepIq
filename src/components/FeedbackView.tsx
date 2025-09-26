import React, { useEffect, useState } from 'react';
import { Feedback, ChatMessage, Scenario, MessageSender, ActionPlanItem, UserProfile, CompletedSession, User } from '../types';
import { generateFeedback, generateActionPlan } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import { Spinner } from './common/Spinner';
import { ArrowLeftIcon } from './common/icons/ArrowLeftIcon';
import { UserIcon } from './common/icons/UserIcon';
import { ChevronDownIcon } from './common/icons/ChevronDownIcon';
import { ChevronUpIcon } from './common/icons/ChevronUpIcon';
import { LightBulbIcon } from './common/icons/LightBulbIcon';
import { BarChartIcon } from './common/icons/BarChartIcon';
import { TargetIcon } from './common/icons/TargetIcon';
import { ClipboardListIcon } from './common/icons/ClipboardListIcon';
import { WrenchScrewdriverIcon } from './common/icons/WrenchScrewdriverIcon';
import { CheckCircleIcon } from './common/icons/CheckCircleIcon';
import { SparklesIcon } from './common/icons/SparklesIcon';
import { LockClosedIcon } from './common/icons/LockClosedIcon';
import { ChatBubbleLeftRightIcon } from './common/icons/ChatBubbleLeftRightIcon';
import { useTranslation } from '../contexts/LanguageContext';

// Props for when the user views their own feedback
interface UserFeedbackViewProps {
  feedback: Feedback | null;
  isLoading: boolean;
  chatHistory: ChatMessage[];
  scenario: Scenario;
  scenarios: Scenario[];
  userProfile: UserProfile;
  onFeedbackLoaded: (feedback: Feedback) => void;
  onReturnToDashboard: () => void;
  onStartScenario: (scenarioId: string) => void;
  onUpgrade: () => void;
  session?: never;
  viewer?: never;
  onReturn?: never;
  onSaveReview?: never;
}

// Props for when a manager/admin reviews a session
interface ManagerReviewViewProps {
  session: CompletedSession;
  viewer: User;
  onReturn: () => void;
  onSaveReview: (sessionId: string, feedback: string) => void;
  feedback?: never;
  isLoading?: never;
  chatHistory?: never;
  scenario?: never;
  scenarios?: never;
  userProfile?: never;
  onFeedbackLoaded?: never;
  onReturnToDashboard?: never;
  onStartScenario?: never;
  onUpgrade?: never;
}

type FeedbackViewProps = UserFeedbackViewProps | ManagerReviewViewProps;


const ProgressBar: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-300">{label}</span>
            <span className="text-sm font-bold text-white">{value}/100</span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-brand-purple to-brand-green h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
    </div>
);


const FeedbackView: React.FC<FeedbackViewProps> = (props) => {
  const isManagerReviewMode = !!props.session;
  const { t, language } = useTranslation();

  const { 
    feedback, chatHistory, scenario, scenarios, userProfile, onFeedbackLoaded, onReturnToDashboard, onStartScenario, onUpgrade, // User props
    session, viewer, onReturn, onSaveReview // Manager props
  } = props;
  
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);
  const [activeFeedbackIndex, setActiveFeedbackIndex] = useState<number | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlanItem[] | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [managerFeedbackText, setManagerFeedbackText] = useState('');

  const effectiveUserProfile = isManagerReviewMode ? null : userProfile;
  const isProUser = isManagerReviewMode || effectiveUserProfile?.subscriptionStatus === 'pro';

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!isManagerReviewMode && chatHistory && chatHistory.length > 0 && !feedback && onFeedbackLoaded) {
        setError(null);
        try {
            const result = await generateFeedback(chatHistory, language);
            if (result) {
              onFeedbackLoaded(result);
            } else {
              setError(t('feedback.errors.generationFailed'));
            }
        } catch (err) {
            console.error("Error fetching feedback:", err);
            setError(t('feedback.errors.unexpectedError'));
        }
      }
    };

    fetchFeedback();
  }, [chatHistory, feedback, onFeedbackLoaded, isManagerReviewMode, t, language]);

  const handleGeneratePlan = async () => {
    const currentFeedback = isManagerReviewMode ? session.feedback : feedback;
    if (!currentFeedback || isManagerReviewMode || !scenarios) return;
    setIsGeneratingPlan(true);
    const plan = await generateActionPlan(currentFeedback, scenarios, language);
    setActionPlan(plan);
    setIsGeneratingPlan(false);
  };
  
  const handleSaveReview = () => {
    if (isManagerReviewMode && managerFeedbackText.trim()) {
        onSaveReview(session.id, managerFeedbackText.trim());
    }
  };

  const currentFeedback = isManagerReviewMode ? session.feedback : feedback;
  const currentChatHistory = isManagerReviewMode ? session.chatHistory : chatHistory;
  const currentScenario = isManagerReviewMode ? session.scenario : scenario;

  const scoreColor =
    currentFeedback && currentFeedback.overallScore > 75
      ? 'from-green-500/50 to-green-500/10 text-green-300'
      : currentFeedback && currentFeedback.overallScore > 50
      ? 'from-yellow-500/50 to-yellow-500/10 text-yellow-300'
      : 'from-red-500/50 to-red-500/10 text-red-300';

  const handleToggleFeedback = (index: number) => {
    if (!isProUser && onUpgrade) {
        onUpgrade();
        return;
    }
    setActiveFeedbackIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const LockedAnalyticsOverlay = () => (
    <div className="absolute inset-0 bg-dark-800/80 backdrop-blur-md rounded-lg flex flex-col items-center justify-center z-10 p-4">
        <LockClosedIcon className="w-12 h-12 text-brand-purple mb-4"/>
        <h3 className="text-xl font-bold text-white">{t('feedback.pro.title')}</h3>
        <p className="text-gray-300 mt-1 mb-4 text-center">{t('feedback.pro.subtitle')}</p>
        <Button onClick={onUpgrade} variant="primary">
            {t('feedback.pro.button')}
        </Button>
    </div>
  );

  const renderFeedbackContent = () => {
    if (error) {
      return (
        <Card className="text-center py-20 animate-fade-in">
          <h3 className="text-xl font-bold text-red-400">{t('feedback.errors.analysisFailed')}</h3>
          <p className="text-gray-300 mt-2">{error}</p>
        </Card>
      );
    }
    
    if (props.isLoading || !currentFeedback) {
      return (
        <div className="text-center py-20">
          <Spinner size="lg" />
          <p className="mt-4 text-lg text-gray-400">{t('feedback.loading')}</p>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-fade-in">
        {session?.managerFeedback && (
          <Card className="p-6 bg-brand-purple/10 border-brand-purple/50">
              <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-purple/20 rounded-full"><ChatBubbleLeftRightIcon className="w-6 h-6 text-brand-purple" /></div>
                  <div>
                      <h3 className="font-bold text-lg text-white">{t('feedback.manager.title')}</h3>
                      <p className="text-gray-300 mt-1">{session.managerFeedback}</p>
                  </div>
              </div>
          </Card>
        )}
         {isManagerReviewMode && !session.managerFeedback && (
          <Card className="p-6">
              <h3 className="font-bold text-lg text-white mb-2">{t('feedback.manager.addTitle')}</h3>
              <textarea
                  value={managerFeedbackText}
                  onChange={(e) => setManagerFeedbackText(e.target.value)}
                  placeholder={t('feedback.manager.placeholder')}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  rows={4}
              />
              <Button onClick={handleSaveReview} variant="primary" className="mt-4" disabled={!managerFeedbackText.trim()}>
                  {t('feedback.manager.saveButton')}
              </Button>
          </Card>
        )}

        {/* Standard Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={`p-6 bg-gradient-to-br ${scoreColor} flex flex-col justify-center items-center text-center`}>
                <h4 className="font-semibold text-gray-300 mb-2">{t('feedback.overallScore')}</h4>
                <p className="text-6xl font-bold">{currentFeedback.overallScore}</p>
                 {!isManagerReviewMode && <p className="mt-2 text-sm font-semibold">{t('feedback.xpGained', { score: currentFeedback.overallScore })}</p>}
            </Card>
            <Card className="p-6">
                <h4 className="font-semibold text-gray-400 mb-4 text-center">{t('feedback.talkToListenRatio.title')}</h4>
                <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-white">{currentFeedback.talkToListenRatio.user}%</p>
                        <p className="text-sm text-gray-400">{t('feedback.talkToListenRatio.you')}</p>
                    </div>
                    <div className="w-full bg-dark-600 h-3 rounded-full overflow-hidden flex">
                        <div className="bg-brand-purple" style={{width: `${currentFeedback.talkToListenRatio.user}%`}}></div>
                        <div className="bg-brand-green" style={{width: `${currentFeedback.talkToListenRatio.prospect}%`}}></div>
                    </div>
                     <div className="text-center">
                        <p className="text-4xl font-bold text-white">{currentFeedback.talkToListenRatio.prospect}%</p>
                        <p className="text-sm text-gray-400">{t('feedback.talkToListenRatio.prospect')}</p>
                    </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">{t('feedback.talkToListenRatio.tip')}</p>
            </Card>
        </div>
         <Card className="p-6">
            <h4 className="font-semibold text-lg text-white mb-3">{t('feedback.summary')}</h4>
            <p className="text-gray-300">{currentFeedback.summary}</p>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="p-6">
                <h4 className="font-semibold text-lg text-white mb-4">{t('feedback.strengths')}</h4>
                <ul className="space-y-3">
                    {currentFeedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircleIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"/>
                            <span className="text-gray-300">{strength}</span>
                        </li>
                    ))}
                </ul>
            </Card>
            <Card className="p-6">
                <h4 className="font-semibold text-lg text-white mb-4">{t('feedback.improvements')}</h4>
                <ul className="space-y-3">
                    {currentFeedback.areasForImprovement.map((imp, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <WrenchScrewdriverIcon className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0"/>
                            <span className="text-gray-300">{imp}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>

        {/* Advanced Analytics Section */}
        <div className="relative">
            <Card className="p-6 space-y-6">
                <div className={`transition-all duration-300 ${!isProUser ? 'blur-md' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <SparklesIcon className="w-6 h-6 text-brand-purple" />
                        <h3 className="font-bold text-2xl text-white">{t('feedback.advanced.title')}</h3>
                        <span className="px-3 py-1 text-sm font-bold bg-gradient-to-r from-brand-purple to-brand-green text-white rounded-full">{t('feedback.pro.badge')}</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-6 bg-dark-900/50">
                            <div className="flex items-center gap-3 mb-4">
                                <BarChartIcon className="w-6 h-6 text-brand-purple" />
                                <h4 className="font-semibold text-lg text-white">{t('feedback.advanced.discourseStructure')}</h4>
                            </div>
                            <div className="space-y-4">
                                <ProgressBar value={currentFeedback.discourseStructure.openingEffectiveness} label={t('feedback.advanced.opening')} />
                                <ProgressBar value={currentFeedback.discourseStructure.discoveryQuestions} label={t('feedback.advanced.discovery')} />
                                <ProgressBar value={currentFeedback.discourseStructure.callToActionStrength} label={t('feedback.advanced.callToAction')} />
                            </div>
                        </Card>
                        <Card className="p-6 bg-dark-900/50">
                            <div className="flex items-center gap-3 mb-4">
                                <TargetIcon className="w-6 h-6 text-brand-green" />
                                <h4 className="font-semibold text-lg text-white">{t('feedback.advanced.skillScores')}</h4>
                            </div>
                            <div className="space-y-4">
                                <ProgressBar value={currentFeedback.skillScores.rapportBuilding} label={t('feedback.advanced.rapportBuilding')} />
                                <ProgressBar value={currentFeedback.skillScores.objectionHandling} label={t('feedback.advanced.objectionHandling')} />
                                <ProgressBar value={currentFeedback.skillScores.closing} label={t('feedback.advanced.closing')} />
                            </div>
                        </Card>
                    </div>
                </div>
                {!isProUser && onUpgrade && <LockedAnalyticsOverlay />}
            </Card>
        </div>

        {/* Action Plan */}
        {!actionPlan && !isManagerReviewMode && (
            <Card className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <ClipboardListIcon className="w-6 h-6 text-brand-purple" />
                    <h4 className="font-semibold text-lg text-white">{t('feedback.actionPlan.promptTitle')}</h4>
                </div>
                <p className="text-gray-400 mb-4">{t('feedback.actionPlan.promptSubtitle')}</p>
                <Button onClick={handleGeneratePlan} disabled={isGeneratingPlan} variant="primary">
                    {isGeneratingPlan ? <Spinner/> : t('feedback.actionPlan.button')}
                </Button>
            </Card>
        )}

        {actionPlan && !isManagerReviewMode && (
            <Card className="p-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <ClipboardListIcon className="w-6 h-6 text-brand-purple" />
                    <h4 className="font-semibold text-lg text-white">{t('feedback.actionPlan.title')}</h4>
                </div>
                <div className="space-y-4">
                    {actionPlan.map((item, index) => (
                        <div key={index} className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                           <p className="text-gray-300 mb-3">{index + 1}. {item.suggestion}</p>
                           <Button onClick={() => onStartScenario!(item.relevantScenarioId)} variant="secondary" className="w-full">
                                {t('feedback.actionPlan.practiceButton')}: <span className="font-bold ml-2">{scenarios!.find(s=>s.id === item.relevantScenarioId)?.title}</span>
                           </Button>
                        </div>
                    ))}
                </div>
            </Card>
        )}

        {/* Transcript */}
        <Card className="p-6">
            <Button
                onClick={() => setIsTranscriptVisible(!isTranscriptVisible)}
                variant="secondary"
                className="w-full justify-center"
            >
                {isTranscriptVisible ? t('feedback.transcript.hide') : t('feedback.transcript.show')}
                {isTranscriptVisible ? <ChevronUpIcon className="w-5 h-5 ml-2" /> : <ChevronDownIcon className="w-5 h-5 ml-2" />}
            </Button>
            {isTranscriptVisible && (
              <div className="mt-4 h-96 overflow-y-auto bg-dark-900 rounded-lg p-4 space-y-4 border border-dark-700">
                {!isProUser && onUpgrade && (
                    <div className="sticky top-0 z-10 p-3 mb-4 text-center rounded-lg bg-brand-purple/20 text-yellow-300 border border-brand-purple/50">
                        <p className="font-bold">{t('feedback.transcript.proFeature')}</p>
                        <Button onClick={onUpgrade} variant="primary" className="mt-2 !text-sm !py-1">{t('feedback.pro.button')}</Button>
                    </div>
                )}
                {currentChatHistory && currentChatHistory.map((msg, index) => {
                    const contextualItem = currentFeedback.contextualFeedback?.find(f => f.messageIndex === index);
                    const isFeedbackActive = activeFeedbackIndex === index;
            
                    return (
                        <div key={index} className={`flex items-start gap-4 ${msg.sender === MessageSender.USER ? 'flex-row-reverse' : ''}`}>
                             {msg.sender === MessageSender.AI && <img src={currentScenario!.prospect.avatarUrl} alt={currentScenario!.prospect.name} className="w-10 h-10 rounded-full flex-shrink-0" />}
                             {msg.sender === MessageSender.USER && <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center flex-shrink-0"><UserIcon className="w-6 h-6 text-gray-300"/></div>}
                            <div className={`flex flex-col ${msg.sender === MessageSender.USER ? 'items-end' : 'items-start'}`}>
                                <div className="relative group">
                                    <div className={`max-w-md p-4 rounded-2xl shadow-md ${ msg.sender === MessageSender.USER ? 'bg-brand-purple text-white rounded-br-lg' : 'bg-dark-700 text-gray-200 rounded-bl-lg'}`}>
                                        <p>{msg.text}</p>
                                    </div>
                                    {contextualItem && (
                                        <button 
                                            onClick={() => handleToggleFeedback(index)} 
                                            className={`absolute top-0 transform -translate-y-1/2 transition-transform group-hover:scale-110 ${ msg.sender === MessageSender.USER ? '-right-2' : '-left-2'} p-1.5 rounded-full ${ contextualItem.type === 'strength' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'} ${!isProUser ? 'cursor-pointer' : ''}`} 
                                            aria-label={isProUser ? t('feedback.transcript.showTip') : t('feedback.pro.button')}
                                        >
                                            <LightBulbIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                {isProUser && isFeedbackActive && contextualItem && (
                                    <div className={`mt-2 p-3 rounded-lg text-sm border-l-4 max-w-md animate-fade-in ${ contextualItem.type === 'strength' ? 'bg-green-500/10 text-green-300 border-green-500' : 'bg-yellow-500/10 text-yellow-300 border-yellow-500'}`}>
                                        <p className="font-bold mb-1 capitalize">{contextualItem.type === 'strength' ? t('feedback.transcript.strongPoint') : t('feedback.transcript.improvementTip')}</p>
                                        <p>{contextualItem.comment}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            )}
        </Card>
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">{isManagerReviewMode ? t('feedback.reviewingTitle') : t('feedback.reportTitle')}</h2>
            <p className="text-gray-400">{t('feedback.scenarioTitle', { title: currentScenario!.title })}</p>
          </div>
          <Button onClick={isManagerReviewMode ? onReturn : onReturnToDashboard} variant="secondary">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              {isManagerReviewMode ? t('common.backToUserDetails') : t('common.backToDashboard')}
          </Button>
      </div>

      {renderFeedbackContent()}
    </div>
  );
};

export default FeedbackView;