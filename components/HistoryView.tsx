


import React, { useState } from 'react';
import { CompletedSession, CoPilotSession } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { ArrowLeftIcon } from './common/icons/ArrowLeftIcon';
import { ClipboardDocumentListIcon } from './common/icons/ClipboardDocumentListIcon';
import { ChatBubbleBottomCenterTextIcon } from './common/icons/ChatBubbleBottomCenterTextIcon';
import { EllipsisVerticalIcon } from './common/icons/EllipsisVerticalIcon';
import { ChevronDownIcon } from './common/icons/ChevronDownIcon';
import RenameModal from './common/RenameModal';
import ConfirmationModal from './common/ConfirmationModal';
import { useTranslation } from '../contexts/LanguageContext';

interface HistoryViewProps {
  sessions: CompletedSession[];
  coPilotSessions: CoPilotSession[];
  onViewSession: (session: CompletedSession) => void;
  onReturnToDashboard: () => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameCoPilotSession: (sessionId: string, newTitle: string) => void;
  onDeleteCoPilotSession: (sessionId: string) => void;
}

type HistoryTab = 'simulations' | 'copilot';

type ModalState = 
  | { type: 'rename-sim'; session: CompletedSession }
  | { type: 'delete-sim'; session: CompletedSession }
  | { type: 'rename-copilot'; session: CoPilotSession }
  | { type: 'delete-copilot'; session: CoPilotSession }
  | null;


const HistoryView: React.FC<HistoryViewProps> = ({ 
    sessions, 
    coPilotSessions, 
    onViewSession, 
    onReturnToDashboard,
    onRenameSession,
    onDeleteSession,
    onRenameCoPilotSession,
    onDeleteCoPilotSession,
}) => {
  const [activeTab, setActiveTab] = useState<HistoryTab>('simulations');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [expandedCoPilotSessionId, setExpandedCoPilotSessionId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const { t } = useTranslation();

  const getScoreColor = (score: number) => {
    if (score > 75) return 'border-green-400 text-green-400';
    if (score > 50) return 'border-yellow-400 text-yellow-400';
    return 'border-red-400 text-red-400';
  };
  
  const handleRenameConfirm = (newTitle: string) => {
    if (!modalState || (modalState.type !== 'rename-sim' && modalState.type !== 'rename-copilot')) return;
    
    if (modalState.type === 'rename-sim') {
      onRenameSession(modalState.session.id, newTitle);
    } else {
      onRenameCoPilotSession(modalState.session.id, newTitle);
    }
    setModalState(null);
  };

  const handleDeleteConfirm = () => {
    if (!modalState || (modalState.type !== 'delete-sim' && modalState.type !== 'delete-copilot')) return;

    if (modalState.type === 'delete-sim') {
        onDeleteSession(modalState.session.id);
    } else {
        onDeleteCoPilotSession(modalState.session.id);
    }
    setModalState(null);
  };


  const renderSimulations = () => (
    <>
      {sessions.length === 0 ? (
        <Card className="p-8 text-center mt-6">
          <h3 className="text-xl font-semibold text-white">{t('history.simulations.emptyTitle')}</h3>
          <p className="text-gray-400 mt-2">{t('history.simulations.emptySubtitle')}</p>
        </Card>
      ) : (
        <div className="space-y-4 mt-6">
          {sessions.map((session) => (
            <Card 
              key={session.id} 
              className="p-4 flex justify-between items-center bg-dark-800 hover:bg-dark-700 transition-colors duration-200"
            >
              <div 
                className="flex items-center gap-4 flex-grow cursor-pointer"
                onClick={() => onViewSession(session)}
              >
                <img src={session.scenario.prospect.avatarUrl} alt={session.scenario.prospect.name} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-md font-semibold text-white">{session.customTitle || session.scenario.title}</h4>
                    {session.managerFeedback && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-300 rounded-full">{t('history.simulations.reviewed')}</span>
                    )}
                  </div>
                  <p className="mt-1 text-gray-400 text-sm">
                    {new Date(session.completedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-2xl ${getScoreColor(session.feedback.overallScore)}`}>
                    {session.feedback.overallScore}
                 </div>
                 <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === session.id ? null : session.id); }} className="p-2 rounded-full hover:bg-dark-600">
                        <EllipsisVerticalIcon className="w-5 h-5"/>
                    </button>
                    {openMenuId === session.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-dark-700 border border-dark-600 rounded-lg shadow-lg z-10 animate-fade-in">
                           <button onClick={(e) => { e.stopPropagation(); setModalState({ type: 'rename-sim', session }); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-600">{t('history.rename')}</button>
                           <button onClick={(e) => { e.stopPropagation(); setModalState({ type: 'delete-sim', session }); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-600">{t('history.delete')}</button>
                        </div>
                    )}
                 </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
  
  const renderCoPilotHistory = () => (
    <>
      {coPilotSessions.length === 0 ? (
        <Card className="p-8 text-center mt-6">
          <h3 className="text-xl font-semibold text-white">{t('history.copilot.emptyTitle')}</h3>
          <p className="text-gray-400 mt-2">{t('history.copilot.emptySubtitle')}</p>
        </Card>
      ) : (
        <div className="space-y-4 mt-6">
          {coPilotSessions.map((session) => (
            <Card key={session.id} className="p-4">
              <div className="flex justify-between items-center">
                <div 
                    className="flex-grow cursor-pointer"
                    onClick={() => setExpandedCoPilotSessionId(expandedCoPilotSessionId === session.id ? null : session.id)}
                >
                    <h4 className="font-semibold text-white">{session.customTitle || t('history.copilot.sessionTitle')}</h4>
                    <p className="text-xs text-gray-400">{new Date(session.timestamp).toLocaleString()} - {t('history.copilot.interventions', { count: session.turns.length })}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setExpandedCoPilotSessionId(expandedCoPilotSessionId === session.id ? null : session.id)}
                        className="p-2 rounded-full hover:bg-dark-600"
                    >
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedCoPilotSessionId === session.id ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === session.id ? null : session.id); }} className="p-2 rounded-full hover:bg-dark-600">
                            <EllipsisVerticalIcon className="w-5 h-5"/>
                        </button>
                         {openMenuId === session.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-dark-700 border border-dark-600 rounded-lg shadow-lg z-10 animate-fade-in">
                               <button onClick={(e) => { e.stopPropagation(); setModalState({ type: 'rename-copilot', session }); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-600">{t('history.rename')}</button>
                               <button onClick={(e) => { e.stopPropagation(); setModalState({ type: 'delete-copilot', session }); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-600">{t('history.delete')}</button>
                            </div>
                        )}
                    </div>
                </div>
              </div>
              {expandedCoPilotSessionId === session.id && (
                <div className="mt-4 pt-4 border-t border-dark-700 space-y-4 animate-fade-in">
                  {session.turns.map((turn) => (
                    <div key={turn.id} className="bg-dark-800 p-4 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-gray-400"/>
                            <h4 className="font-semibold text-gray-300">{t('history.copilot.prospectSaid')}:</h4>
                          </div>
                          <p className="text-white bg-dark-700/50 p-3 rounded-lg">{turn.prospectSays}</p>
                        </div>
                         <div>
                          <div className="flex items-center gap-2 mb-2">
                            <ClipboardDocumentListIcon className="w-5 h-5 text-brand-green"/>
                            <h4 className="font-semibold text-gray-300">{t('history.copilot.copilotSuggested')}:</h4>
                          </div>
                          <p className="text-white bg-dark-700/50 p-3 rounded-lg">{turn.copilotSuggests}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
  
  const renderModals = () => {
    if (!modalState) return null;

    if (modalState.type === 'rename-sim' || modalState.type === 'rename-copilot') {
        const currentTitle = modalState.session.customTitle || (modalState.type === 'rename-sim' 
            ? (modalState.session as CompletedSession).scenario.title 
            : `Live Call - ${new Date(modalState.session.timestamp).toLocaleDateString()}`);
        return <RenameModal currentTitle={currentTitle} onSave={handleRenameConfirm} onClose={() => setModalState(null)} />;
    }

    if (modalState.type === 'delete-sim' || modalState.type === 'delete-copilot') {
        return <ConfirmationModal 
            title={t('history.deleteModal.title')}
            message={t('history.deleteModal.message')}
            onConfirm={handleDeleteConfirm}
            onClose={() => setModalState(null)}
        />;
    }

    return null;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">{t('history.title')}</h2>
          <p className="text-gray-400">{t('history.subtitle')}</p>
        </div>
        <Button onClick={onReturnToDashboard} variant="secondary">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          {t('common.backToDashboard')}
        </Button>
      </div>

      <div className="border-b border-dark-700 flex space-x-1">
        <button 
          onClick={() => setActiveTab('simulations')}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'simulations' ? 'border-b-2 border-brand-purple text-white' : 'text-gray-400 hover:text-white'}`}
        >
          {t('history.tabs.simulations')}
        </button>
        <button 
          onClick={() => setActiveTab('copilot')}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'copilot' ? 'border-b-2 border-brand-purple text-white' : 'text-gray-400 hover:text-white'}`}
        >
          {t('history.tabs.copilot')}
        </button>
      </div>
      
      {activeTab === 'simulations' ? renderSimulations() : renderCoPilotHistory()}

      {renderModals()}
    </div>
  );
};

export default HistoryView;