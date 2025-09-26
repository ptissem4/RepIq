import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Scenario, ChatMessage, MessageSender } from '../types';
import { createChatSession } from '../services/geminiService';
import Button from './common/Button';
import { UserIcon } from './common/icons/UserIcon';
import { Spinner } from './common/Spinner';
import { PhoneMissedCallIcon } from './common/icons/PhoneMissedCallIcon';
import { MicrophoneIcon } from './common/icons/MicrophoneIcon';
import { SpeakerWaveIcon } from './common/icons/SpeakerWaveIcon';
import { SpeakerXMarkIcon } from './common/icons/SpeakerXMarkIcon';
import AudioPlayer from './AudioPlayer';
import { useTranslation } from '../contexts/LanguageContext';

interface RolePlaySessionProps {
  scenario: Scenario;
  onEndSession: (chatHistory: ChatMessage[]) => void;
  onReturnToDashboard: () => void;
}

const RolePlaySession: React.FC<RolePlaySessionProps> = ({ scenario, onEndSession, onReturnToDashboard }) => {
  const { t, language } = useTranslation();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const chatRef = useRef<Chat | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);
  
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Initialize chat session
  useEffect(() => {
    async function start() {
      try {
        if (!isMounted.current) return;
        setError(null);
        setIsAiThinking(true);
        const systemInstruction = `${scenario.systemInstruction} ${scenario.settings?.coachingStyleModifier || ''}`;
        
        const chat = createChatSession(systemInstruction);
        chatRef.current = chat;
        
        // The AI starts the conversation. Let's send a starting prompt.
        const response = await chat.sendMessage({message: "Begin the role-play scenario now. Greet me and state your opening line."});
        
        if (isMounted.current) {
            const aiMessage: ChatMessage = { sender: MessageSender.AI, text: response.text };
            setHistory([aiMessage]);
        }
      } catch (e) {
        if (isMounted.current) {
            setError(t('roleplay.errors.startError'));
        }
        console.error(e);
      } finally {
        if (isMounted.current) {
            setIsAiThinking(false);
        }
      }
    }
    start();
  }, [scenario, t]);

  // Setup speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setUserInput(finalTranscript);
      }
    };
    
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, [language]);

  const handleSendMessage = useCallback(async () => {
    if (!userInput.trim() || isAiThinking || !chatRef.current) return;

    const userMessage: ChatMessage = { sender: MessageSender.USER, text: userInput.trim() };
    setHistory(prev => [...prev, userMessage]);
    setUserInput('');
    setIsAiThinking(true);
    setError(null);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage.text });
      if (isMounted.current) {
          const aiMessage: ChatMessage = { sender: MessageSender.AI, text: response.text };
          setHistory(prev => [...prev, aiMessage]);
      }
    } catch (e) {
      if(isMounted.current) {
        setError(t('roleplay.errors.responseError'));
      }
      console.error(e);
    } finally {
      if(isMounted.current) {
        setIsAiThinking(false);
      }
    }
  }, [userInput, isAiThinking, t]);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };
  
  const handleRetry = () => {
      setError(null);
  }

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-140px)] max-h-[800px] bg-dark-800/60 backdrop-blur-lg border border-dark-700/50 rounded-lg shadow-md">
      <div className="flex-shrink-0 flex items-center gap-4 p-4 border-b border-dark-700">
        <img src={scenario.prospect.avatarUrl} alt={scenario.prospect.name} className="w-12 h-12 rounded-full"/>
        <div>
            <h2 className="text-xl font-bold text-white">{t('roleplay.playingWith', { name: scenario.prospect.name })}</h2>
            <p className="text-sm text-gray-400">{scenario.prospect.role}</p>
        </div>
        <div className="flex-grow" />
        <Button onClick={() => onEndSession(history)} variant="danger" className="!px-3">
          <PhoneMissedCallIcon className="w-5 h-5 mr-2"/>
          {t('roleplay.endCall')}
        </Button>
      </div>
      
      <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
        {history.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === MessageSender.USER ? 'flex-row-reverse' : ''}`}>
             {msg.sender === MessageSender.AI ? (
                <img src={scenario.prospect.avatarUrl} alt={scenario.prospect.name} className="w-8 h-8 rounded-full flex-shrink-0" />
             ) : (
                <div className="w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center flex-shrink-0"><UserIcon className="w-5 h-5 text-gray-300"/></div>
             )}
            <div className={`max-w-lg p-3 rounded-2xl shadow-md ${ msg.sender === MessageSender.USER ? 'bg-brand-purple text-white rounded-br-lg' : 'bg-dark-700 text-gray-200 rounded-bl-lg'}`}>
                <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isAiThinking && (
           <div className="flex items-start gap-3">
                <img src={scenario.prospect.avatarUrl} alt={scenario.prospect.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="max-w-lg p-3 rounded-2xl shadow-md bg-dark-700 text-gray-200 rounded-bl-lg">
                    <Spinner size="sm" />
                </div>
            </div>
        )}
        {error && (
            <div className="text-center text-red-400 text-sm">
                <p>{error}</p>
                <Button onClick={handleRetry} variant="secondary" className="mt-2 !text-xs !py-1">{t('roleplay.retry')}</Button>
            </div>
        )}
      </div>

      <div className="flex-shrink-0 p-4 border-t border-dark-700 bg-dark-800/80">
        <div className="flex items-center gap-3">
            <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-full hover:bg-dark-700">
                {isMuted ? <SpeakerXMarkIcon className="w-6 h-6 text-gray-400" /> : <SpeakerWaveIcon className="w-6 h-6 text-gray-400" />}
            </button>
            <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                placeholder={t('roleplay.respondPlaceholder', { name: scenario.prospect.name.split(' ')[0] })}
                className="flex-grow bg-dark-700 border border-dark-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none"
                rows={1}
                disabled={isAiThinking}
            />
            {recognitionRef.current && (
                <button onClick={handleMicClick} className={`p-3 rounded-full transition-colors ${isListening ? 'bg-brand-red text-white' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'}`}>
                    {isListening ? <Spinner size="sm"/> : <MicrophoneIcon className="w-5 h-5" />}
                </button>
            )}
            <Button onClick={handleSendMessage} disabled={!userInput.trim() || isAiThinking}>
              {t('common.send')}
            </Button>
        </div>
      </div>
      
      {scenario.settings?.ambientSound && scenario.settings.ambientSound !== 'none' && !isMuted && (
        <AudioPlayer src={`/sounds/${scenario.settings.ambientSound}.mp3`} />
      )}
    </div>
  );
};

export default RolePlaySession;