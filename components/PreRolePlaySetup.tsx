import React, { useState } from 'react';
import { CoachingStyle, Scenario } from '../types';
import { COACHING_STYLES, COACHING_ARCHETYPES } from '../constants';
import Card from './common/Card';
import Button from './common/Button';
import { ArrowLeftIcon } from './common/icons/ArrowLeftIcon';
import { CheckCircleIcon } from './common/icons/CheckCircleIcon';
import { useTranslation } from '../contexts/LanguageContext';
import { BotIcon } from './common/icons/BotIcon';

interface PreRolePlaySetupProps {
  scenario: Scenario;
  onStartRolePlay: (scenario: Scenario, settings: { coachingStyleId: string; ambientSound: string }) => void;
  onReturnToDashboard: () => void;
}

const ambientSounds = [
    { id: 'none', name: 'None' },
    { id: 'office', name: 'Busy Office' },
    { id: 'cafe', name: 'Noisy Cafe' },
    { id: 'call-center', name: 'Call Center' },
];


const PreRolePlaySetup: React.FC<PreRolePlaySetupProps> = ({ scenario, onStartRolePlay, onReturnToDashboard }) => {
  const { t, language } = useTranslation();

  const getLocalizedCoachingStyle = (style: CoachingStyle) => {
    if (style.translations && style.translations[language]) {
      const translation = style.translations[language];
      return { ...style, ...translation };
    }
    return style;
  };
  
  const localizedCoachingStyles = COACHING_STYLES.map(getLocalizedCoachingStyle);
  const localizedArchetypes = COACHING_ARCHETYPES.map(getLocalizedCoachingStyle);
  const allLocalizedStyles = [...localizedCoachingStyles, ...localizedArchetypes];

  const [coachingStyleId, setCoachingStyleId] = useState(COACHING_STYLES[0].id);
  const [ambientSound, setAmbientSound] = useState('none');
  

  const handleStart = () => {
    onStartRolePlay(scenario, { coachingStyleId, ambientSound });
  };
  
  const selectedStyle = allLocalizedStyles.find(s => s.id === coachingStyleId);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white">{t('setup.title')}</h2>
          <p className="text-lg text-gray-400">{t('setup.subtitle')} <span className="font-bold text-white">{scenario.title}</span>.</p>
        </div>
        <Button onClick={onReturnToDashboard} variant="secondary">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          {t('common.backToDashboard')}
        </Button>
      </div>

      <Card className="p-8 space-y-8">
        <div>
          <h3 className="block text-lg font-semibold text-white mb-3">
            {t('setup.trainWithGreats')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {localizedCoachingStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setCoachingStyleId(style.id)}
                className={`p-3 rounded-lg text-center border-2 transition-all duration-200 h-full flex flex-col items-center justify-start group
                  ${coachingStyleId === style.id
                    ? 'bg-brand-purple/20 border-brand-purple shadow-lg'
                    : 'bg-dark-700 border-transparent hover:border-brand-purple/50'
                }`}
              >
                <div className="relative w-16 h-16 mb-3">
                    <img
                        src={(style as any).avatarUrl}
                        alt={style.name}
                        className={`w-full h-full rounded-full object-cover border-2 transition-colors ${
                            coachingStyleId === style.id ? 'border-brand-purple' : 'border-dark-600 group-hover:border-dark-500'
                        }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-green/40 to-brand-purple/40 rounded-full flex items-center justify-center">
                        <BotIcon className="w-8 h-8 text-white/90" />
                    </div>
                </div>
                <span className="text-sm font-bold text-white">{style.name}</span>
                <span className="text-xs text-gray-300 mt-1 flex-grow">{style.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="block text-lg font-semibold text-white mb-3">
            {t('setup.masterArchetypes')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {localizedArchetypes.map((style) => (
              <button
                key={style.id}
                onClick={() => setCoachingStyleId(style.id)}
                className={`p-3 rounded-lg text-center font-semibold border-2 transition-all duration-200 h-full flex flex-col items-center justify-center
                  ${coachingStyleId === style.id
                    ? 'bg-brand-purple border-brand-purple text-white shadow-lg'
                    : 'bg-dark-700 border-dark-600 hover:border-brand-purple/50'
                }`}
              >
                <span className="text-sm font-bold">{style.name}</span>
                 <span className="text-xs text-gray-300 mt-1">{style.title}</span>
              </button>
            ))}
          </div>
        </div>
        
        {selectedStyle && (
            <Card className="mt-4 p-4 bg-dark-900/50">
                <p className="text-sm text-gray-300"><span className="font-bold text-white">{t('setup.philosophy')}:</span> {selectedStyle.philosophy}</p>
            </Card>
        )}


        <div>
          <label className="block text-lg font-semibold text-white mb-3">
            {t('setup.ambientSound')}
          </label>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ambientSounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => setAmbientSound(sound.id)}
                className={`p-4 rounded-lg text-center font-semibold border-2 transition-all duration-200 ${
                  ambientSound === sound.id
                    ? 'bg-brand-green border-brand-green text-black shadow-lg'
                    : 'bg-dark-700 border-dark-600 hover:border-brand-green/50'
                }`}
              >
                {t(`setup.sounds.${sound.id}`)}
              </button>
            ))}
          </div>
        </div>
      </Card>
      
      <div className="text-center">
        <Button onClick={handleStart} variant="primary" className="!px-10 !py-4 !text-lg">
            {t('setup.startRolePlay')}
        </Button>
      </div>
    </div>
  );
};

export default PreRolePlaySetup;