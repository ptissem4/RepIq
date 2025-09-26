

import React, { useState, useEffect, useRef } from 'react';
import Button from './common/Button';
import { Spinner } from './common/Spinner';
import Card from './common/Card';
import { generateLiveResponse } from '../services/geminiService';
import { EarIcon } from './common/icons/EarIcon';
import { ClipboardDocumentListIcon } from './common/icons/ClipboardDocumentListIcon';
import { CoPilotTurn } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface LiveAssistSessionProps {
  onReturnToDashboard: () => void;
  onSaveCoPilotTurn: (turn: Omit<CoPilotTurn, 'id' | 'timestamp'>) => void;
}

const LiveAssistSession: React.FC<LiveAssistSessionProps> = ({ onReturnToDashboard, onSaveCoPilotTurn }) => {
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(null);
  const [prospectTranscript, setProspectTranscript] = useState<string | null>(null);

  const { t, language } = useTranslation();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported by your browser. Please try Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setProspectTranscript(transcript);
    };

    recognition.onstart = () => {
        setProspectTranscript(null);
        setGeneratedResponse(null);
        setError(null);
        setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setError(`Speech recognition error: ${event.error}. Please ensure microphone access is granted.`);
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;

  }, [language]);

  useEffect(() => {
    const fetchResponse = async () => {
        if (prospectTranscript && !isListening) {
            setIsGenerating(true);
            setError(null);
            try {
                const result = await generateLiveResponse(prospectTranscript);
                if (result && result.response) {
                    setGeneratedResponse(result.response);
                    onSaveCoPilotTurn({
                        prospectSays: prospectTranscript,
                        copilotSuggests: result.response,
                    });
                } else {
                    setError("Co-Pilot couldn't generate a response. Please try again.");
                }
            } catch (err) {
                 console.error("Error generating live response:", err);
                 setError("An unexpected error occurred. Please try again.");
            }
            setIsGenerating(false);
        }
    };
    fetchResponse();
  }, [prospectTranscript, isListening, onSaveCoPilotTurn]);

  const handleListenStart = () => {
    if (recognitionRef.current && !isListening && !isGenerating) {
      recognitionRef.current.start();
    }
  };

  const handleListenEnd = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white">{t('liveAssist.title')}</h2>
          <p className="text-lg text-gray-400">{t('liveAssist.subtitle')}</p>
        </div>
        <Button onClick={onReturnToDashboard} variant="secondary">
          {t('common.backToDashboard')}
        </Button>
      </div>

      <Card className="p-8 flex flex-col items-center justify-center min-h-[200px]">
        <p className="text-gray-400 mb-4">
            {isListening ? t('liveAssist.listening') : t('liveAssist.ready')}
        </p>
        <button
          onMouseDown={handleListenStart}
          onMouseUp={handleListenEnd}
          onTouchStart={handleListenStart}
          onTouchEnd={handleListenEnd}
          disabled={isGenerating}
          className={`flex items-center justify-center w-32 h-32 rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-brand-purple/50 disabled:opacity-60 disabled:cursor-not-allowed
            ${isListening 
                ? 'bg-brand-red/80 scale-110 shadow-2xl shadow-brand-red/30' 
                : 'bg-brand-purple hover:bg-brand-purple/90 scale-100'}`}
        >
          <EarIcon className="w-16 h-16 text-white" />
        </button>
        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
      </Card>

      <Card>
        <div className="p-4 border-b border-dark-700 flex items-center gap-3">
          <ClipboardDocumentListIcon className="w-5 h-5 text-brand-green" />
          <h3 className="font-semibold text-white">{t('liveAssist.suggestedResponse')}</h3>
        </div>
        <div className="p-6 min-h-[150px] bg-dark-900/50 flex items-center justify-center">
          {isGenerating && <Spinner />}
          {!isGenerating && !generatedResponse && (
            <p className="text-gray-500 text-center">
              {t('liveAssist.responsePlaceholder')}
            </p>
          )}
          {!isGenerating && generatedResponse && (
            <p className="text-gray-200 text-lg animate-fade-in">{generatedResponse}</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LiveAssistSession;
