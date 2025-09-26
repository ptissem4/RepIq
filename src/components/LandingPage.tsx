import React, { useRef, useEffect, useState } from 'react';
import Button from './common/Button';
import { ArrowRightIcon } from './common/icons/ArrowRightIcon';
import { ChevronDownIcon } from './common/icons/ChevronDownIcon';
import Card from './common/Card';
import { CheckCircleIcon } from './common/icons/CheckCircleIcon';
import { AcmeIncLogo } from './common/icons/AcmeIncLogo';
import { InnovateLLCLogo } from './common/icons/InnovateLLCLogo';
import { SynergyGroupLogo } from './common/icons/SynergyGroupLogo';
import { SolutionsCoLogo } from './common/icons/SolutionsCoLogo';
import { PhoneArrowUpRightIcon } from './common/icons/PhoneArrowUpRightIcon';
import { BriefcaseIcon } from './common/icons/BriefcaseIcon';
import { BuildingStorefrontIcon } from './common/icons/BuildingStorefrontIcon';
import { BrainCircuitIcon } from './common/icons/BrainCircuitIcon';
import { KeyIcon } from './common/icons/KeyIcon';
import { ChartBarIcon } from './common/icons/ChartBarIcon';
import RolePlayScreenshot from './screenshots/RolePlayScreenshot';
import CoPilotScreenshot from './screenshots/CoPilotScreenshot';
import AnalyticsScreenshot from './screenshots/AnalyticsScreenshot';
import ProgramsScreenshot from './screenshots/ProgramsScreenshot';
import { COACHING_STYLES } from '../constants';
import { BotIcon } from './common/icons/BotIcon';
import { useTranslation } from '../contexts/LanguageContext';
import { CoachingStyle } from '../types';

const features = [
  {
    key: 'roleplay',
    animation: <RolePlayScreenshot />,
    glowColor: 'rgba(52,211,153,0.4)'
  },
  {
    key: 'copilot',
    animation: <CoPilotScreenshot />,
    glowColor: 'rgba(139,92,246,0.4)'
  },
  {
    key: 'analytics',
    animation: <AnalyticsScreenshot />,
    glowColor: 'rgba(52,211,153,0.4)'
  },
  {
    key: 'programs',
    animation: <ProgramsScreenshot />,
    glowColor: 'rgba(139,92,246,0.4)'
  }
];

const faqItems = [ 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7' ];

const FAQItem: React.FC<{ itemKey: string }> = ({ itemKey }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { t } = useTranslation();
    return (
        <div className="border-b border-dark-700/50 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-5"
            >
                <span className="font-semibold text-lg text-white">{t(`landing.faq.${itemKey}.q`)}</span>
                <ChevronDownIcon className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="pb-5 pr-10 text-gray-300 animate-fade-in">
                    <p>{t(`landing.faq.${itemKey}.a`)}</p>
                </div>
            )}
        </div>
    )
}

const FeatureListItem: React.FC<{ children: React.ReactNode, available?: boolean }> = ({ children, available = true }) => (
    <li className={`flex items-start gap-3 ${available ? '' : 'text-gray-500'}`}>
        <CheckCircleIcon className={`w-6 h-6 flex-shrink-0 ${available ? 'text-brand-green' : 'text-dark-700'}`} />
        <span className={`text-sm ${available ? 'text-gray-300' : 'line-through'}`}>{children}</span>
    </li>
);


const LandingPage: React.FC = () => {
    const { t, language } = useTranslation();
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    const getLocalizedCoachingStyle = (style: CoachingStyle & { avatarUrl: string, glowColorClass: string }) => {
        if (style.translations && style.translations[language]) {
            const translation = style.translations[language];
            return {
                ...style,
                name: translation.name,
                title: translation.title,
                philosophy: translation.philosophy,
                techniques: translation.techniques,
            };
        }
        return style;
    };
    
    const localizedCoachingStyles = COACHING_STYLES.map(getLocalizedCoachingStyle);
    const [selectedStyle, setSelectedStyle] = useState(localizedCoachingStyles[0]);

    useEffect(() => {
        setSelectedStyle(getLocalizedCoachingStyle(COACHING_STYLES.find(s => s.id === selectedStyle.id)!));
    }, [language]);


    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
    
        const currentRefs = sectionRefs.current;
        currentRefs.forEach(ref => {
          if (ref) observer.observe(ref);
        });
    
        return () => {
          currentRefs.forEach(ref => {
            if (ref) observer.unobserve(ref);
          });
        };
    }, []);

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };


  return (
    <div className="bg-transparent text-gray-200">
      <main>
        <section className="pt-32 pb-20 md:pt-48 md:pb-32">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-violet-500"
               style={{ textShadow: '0 0 40px rgba(139, 92, 246, 0.5)'}}>
              {t('landing.hero.title')}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              {t('landing.hero.subtitle')}
            </p>
            <div className="mt-10">
              <Button onClick={() => document.getElementById('pricing-preview')?.scrollIntoView({ behavior: 'smooth' })} variant="primary" className="!px-8 !py-4 !text-lg bg-gradient-to-r from-brand-purple to-brand-green border-0 shadow-lg shadow-brand-purple/20 hover:shadow-xl hover:shadow-brand-green/20 transition-all duration-300 transform hover:scale-105">
                {t('landing.hero.cta')}
                <ArrowRightIcon className="w-5 h-5 ml-3"/>
              </Button>
            </div>
             <div className="mt-20">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('landing.trustedBy')}</p>
                <div className="flex justify-center items-center gap-12 opacity-60">
                    <AcmeIncLogo className="h-6"/>
                    <InnovateLLCLogo className="h-6"/>
                    <SynergyGroupLogo className="h-7"/>
                    <SolutionsCoLogo className="h-6"/>
                </div>
            </div>
          </div>
        </section>

        
        <div ref={addToRefs} className="py-24 fade-in-section bg-dark-850/50">
            <section id="how-it-works" >
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold text-white">{t('landing.steps.title')}</h2>
                         <p className="text-lg text-gray-400 mt-2">{t('landing.steps.subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="p-8 text-center">
                            <div className="flex items-center justify-center w-16 h-16 bg-brand-purple/20 rounded-xl mx-auto mb-6"><BrainCircuitIcon className="w-8 h-8 text-brand-purple"/></div>
                            <h3 className="text-xl font-bold text-white">{t('landing.steps.step1.title')}</h3>
                            <p className="text-gray-400 mt-2">{t('landing.steps.step1.description')}</p>
                        </Card>
                         <Card className="p-8 text-center">
                            <div className="flex items-center justify-center w-16 h-16 bg-brand-green/20 rounded-xl mx-auto mb-6"><ChartBarIcon className="w-8 h-8 text-brand-green"/></div>
                            <h3 className="text-xl font-bold text-white">{t('landing.steps.step2.title')}</h3>
                            <p className="text-gray-400 mt-2">{t('landing.steps.step2.description')}</p>
                        </Card>
                         <Card className="p-8 text-center">
                            <div className="flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-xl mx-auto mb-6"><KeyIcon className="w-8 h-8 text-yellow-400"/></div>
                            <h3 className="text-xl font-bold text-white">{t('landing.steps.step3.title')}</h3>
                            <p className="text-gray-400 mt-2">{t('landing.steps.step3.description')}</p>
                        </Card>
                    </div>
                </div>
            </section>
        </div>

        <div ref={addToRefs} className="py-24 fade-in-section relative overflow-hidden style-showcase-bg">
             <div className={`glow-effect ${selectedStyle.glowColorClass}`}></div>
             <section id="closing-styles">
                <div className="container mx-auto max-w-5xl px-4">
                    <div className="text-center mb-16">
                         <h2 className="text-3xl font-bold text-white">{t('landing.styles.title')}</h2>
                         <p className="text-lg text-gray-400 mt-2">{t('landing.styles.subtitle')}</p>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        <div className="flex flex-col gap-3">
                            {localizedCoachingStyles.map(style => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style)}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-300 flex items-center gap-4 group hover:scale-105
                                        ${selectedStyle.id === style.id 
                                        ? 'border-brand-purple/80 bg-brand-purple/20 shadow-lg shadow-brand-purple/20'
                                        : 'border-transparent bg-dark-800/50 hover:bg-dark-700/80 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <div className="relative w-12 h-12 flex-shrink-0">
                                        <img 
                                            src={style.avatarUrl} 
                                            alt={style.name} 
                                            className={`w-full h-full rounded-full object-cover transition-all duration-300 border-2 ${selectedStyle.id === style.id ? 'border-brand-purple/80' : 'border-transparent group-hover:border-dark-600'}`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/40 to-brand-purple/40 rounded-full flex items-center justify-center">
                                            <BotIcon className="w-6 h-6 text-white/90" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{style.name}</p>
                                        <p className="text-sm text-gray-400">{style.title}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="lg:col-span-2">
                             <Card className="p-8 sticky top-24">
                                <div key={selectedStyle.id} className="animate-fade-in">
                                    <h3 className="text-2xl font-bold text-white mb-2">{selectedStyle.name}</h3>
                                    <p className="text-md font-semibold text-brand-purple mb-4">{selectedStyle.title}</p>
                                    <p className="text-gray-300 italic mb-6">"{selectedStyle.philosophy}"</p>
                                    <h4 className="font-semibold text-white mb-3">{t('landing.styles.techniques')}:</h4>
                                    <ul className="space-y-2">
                                        {selectedStyle.techniques.map((tech, index) => (
                                             <li key={index} className="flex items-start gap-3">
                                                <CheckCircleIcon className="w-5 h-5 text-brand-green mt-0.5 flex-shrink-0" />
                                                <span>{tech}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                             </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        
        <section ref={addToRefs} id="features" className="py-24 md:py-32 fade-in-section">
            <div className="container mx-auto max-w-6xl px-4 space-y-24">
                 <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-white">{t('landing.features.title')}</h2>
                     <p className="text-lg text-gray-400 mt-2">{t('landing.features.subtitle')}</p>
                </div>
                {features.map((feature, index) => (
                    <div key={index} className={`grid lg:grid-cols-2 gap-12 lg:gap-24 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                       <div className={`flex justify-center ${index % 2 !== 0 ? 'lg:order-last' : ''}`}>
                            <div
                                className="w-[320px] h-[580px] bg-dark-900/60 backdrop-blur-sm border border-dark-700/50 rounded-[40px] shadow-[0_0_80px_rgba(139,92,246,0.25)] overflow-hidden relative flex items-center justify-center p-2 transition-all duration-300 group hover:scale-[1.03]"
                                style={{'--glow-color': feature.glowColor} as React.CSSProperties}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-transparent"></div>
                                <div className="absolute inset-0 rounded-[40px] shadow-inner shadow-black/50"></div>
                                <div className="w-full h-full rounded-[32px] overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_100px_var(--glow-color)]">
                                    {feature.animation}
                                </div>
                            </div>
                        </div>
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">{t(`landing.features.${feature.key}.title`)}</h3>
                            <p className="text-gray-400 text-lg">{t(`landing.features.${feature.key}.description`)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
        
        <div ref={addToRefs} className="py-24 fade-in-section bg-dark-850/50">
            <section id="designed-for-you">
                <div className="container mx-auto max-w-5xl px-4">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold text-white">{t('landing.personas.title')}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="p-8 text-center">
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-xl mx-auto mb-6"><PhoneArrowUpRightIcon className="w-8 h-8 text-blue-400"/></div>
                            <h3 className="text-xl font-bold text-white">{t('landing.personas.sdr.title')}</h3>
                            <p className="text-gray-400 mt-2">{t('landing.personas.sdr.description')}</p>
                        </Card>
                         <Card className="p-8 text-center">
                            <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-xl mx-auto mb-6"><BriefcaseIcon className="w-8 h-8 text-green-400"/></div>
                            <h3 className="text-xl font-bold text-white">{t('landing.personas.ae.title')}</h3>
                            <p className="text-gray-400 mt-2">{t('landing.personas.ae.description')}</p>
                        </Card>
                         <Card className="p-8 text-center">
                            <div className="flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-xl mx-auto mb-6"><BuildingStorefrontIcon className="w-8 h-8 text-yellow-400"/></div>
                            <h3 className="text-xl font-bold text-white">{t('landing.personas.founder.title')}</h3>
                            <p className="text-gray-400 mt-2">{t('landing.personas.founder.description')}</p>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
        
        <section ref={addToRefs} id="testimonials" className="py-24 fade-in-section">
            <div className="container mx-auto max-w-5xl px-4">
                 <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-white">{t('landing.testimonials.title')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-8">
                        <p className="text-gray-300 text-lg italic">{t('landing.testimonials.t1.quote')}</p>
                        <div className="flex items-center mt-6">
                            <img className="w-12 h-12 rounded-full" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Alex Johnson" />
                            <div className="ml-4">
                                <p className="font-bold text-white">{t('landing.testimonials.t1.name')}</p>
                                <p className="text-sm text-gray-400">{t('landing.testimonials.t1.role')}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-8">
                        <p className="text-gray-300 text-lg italic">{t('landing.testimonials.t2.quote')}</p>
                        <div className="flex items-center mt-6">
                            <img className="w-12 h-12 rounded-full" src="https://randomuser.me/api/portraits/women/44.jpg" alt="Samantha Carter" />
                            <div className="ml-4">
                                <p className="font-bold text-white">{t('landing.testimonials.t2.name')}</p>
                                <p className="text-sm text-gray-400">{t('landing.testimonials.t2.role')}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>

        
        <div ref={addToRefs} id="pricing-preview" className="py-20 fade-in-section bg-dark-850/50">
             <section>
                 <div className="container mx-auto max-w-6xl px-4">
                     <h2 className="text-3xl font-bold text-center text-white mb-12">{t('landing.pricing.title')}</h2>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        <Card className="p-8 flex flex-col transition-all hover:border-brand-purple/50 duration-300 hover:-translate-y-2">
                            <h3 className="text-2xl font-bold text-white">{t('landing.pricing.basic.title')}</h3>
                            <p className="text-gray-400 mt-1 flex-grow">{t('landing.pricing.basic.subtitle')}</p>
                            <p className="my-6">
                                <span className="text-4xl font-bold text-white">$19</span>
                                <span className="text-lg font-medium text-gray-400">/{t('landing.pricing.month')}</span>
                            </p>
                             <Button onClick={() => (Array.from(document.querySelectorAll('a, button')).find(el => el.textContent === t('landingLayout.pricing')) as HTMLElement)?.click()} variant="secondary" className="mt-auto w-full justify-center">{t('landing.pricing.basic.cta')}</Button>
                            <hr className="border-dark-700 my-6"/>
                            <p className="text-sm font-semibold text-white mb-4">{t('landing.pricing.includes')}:</p>
                            <ul className="space-y-4">
                               <FeatureListItem>{t('landing.pricing.basic.f1')}</FeatureListItem>
                               <FeatureListItem>{t('landing.pricing.basic.f2')}</FeatureListItem>
                               <FeatureListItem>{t('landing.pricing.basic.f3')}</FeatureListItem>
                               <FeatureListItem>{t('landing.pricing.basic.f4')}</FeatureListItem>
                            </ul>
                        </Card>
                        <Card className="p-8 border-2 border-brand-purple flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-2 shadow-2xl shadow-brand-purple/20">
                            <div className="absolute top-0 right-0 bg-brand-purple text-white text-xs font-bold px-4 py-1 rounded-bl-lg">{t('landing.pricing.bestValue')}</div>
                            <h3 className="text-2xl font-bold text-white">{t('landing.pricing.pro.title')}</h3>
                            <p className="text-gray-400 mt-1 flex-grow">{t('landing.pricing.pro.subtitle')}</p>
                            <p className="my-6">
                                <span className="text-4xl font-bold text-white">$29</span>
                                <span className="text-lg font-medium text-gray-400">/{t('landing.pricing.month')}</span>
                            </p>
                             <Button onClick={() => (Array.from(document.querySelectorAll('a, button')).find(el => el.textContent === t('landingLayout.pricing')) as HTMLElement)?.click()} variant="primary" className="mt-auto w-full justify-center">{t('landing.pricing.pro.cta')}</Button>
                             <hr className="border-dark-700 my-6"/>
                             <p className="text-sm font-semibold text-white mb-4">{t('landing.pricing.pro.includes')}:</p>
                            <ul className="space-y-4">
                               <FeatureListItem>{t('landing.pricing.pro.f1')}</FeatureListItem>
                               <FeatureListItem>{t('landing.pricing.pro.f2')}</FeatureListItem>
                               <FeatureListItem>{t('landing.pricing.pro.f3')}</FeatureListItem>
                               <FeatureListItem>{t('landing.pricing.pro.f4')}</FeatureListItem>
                            </ul>
                        </Card>
                        <Card className="p-8 flex flex-col transition-all hover:border-brand-green/50 duration-300 hover:-translate-y-2">
                            <h3 className="text-2xl font-bold text-white">{t('landing.pricing.enterprise.title')}</h3>
                            <p className="text-gray-400 mt-1 flex-grow">{t('landing.pricing.enterprise.subtitle')}</p>
                            <p className="my-6">
                                <span className="text-4xl font-bold text-white">{t('landing.pricing.enterprise.price')}</span>
                            </p>
                             <a href="mailto:sales@repIQ.ai?subject=Enterprise Plan Inquiry" className="mt-auto w-full">
                                <Button variant="secondary" className="w-full justify-center bg-brand-green/10 !text-brand-green hover:bg-brand-green/20">{t('landing.pricing.enterprise.cta')}</Button>
                             </a>
                             <hr className="border-dark-700 my-6"/>
                             <p className="text-sm font-semibold text-white mb-4">{t('landing.pricing.enterprise.includes')}:</p>
                             <ul className="space-y-4">
                               <FeatureListItem>{t('landing.pricing.enterprise.f1')}</FeatureListItem>
                               <FeatureListItem>{t('landing.pricing.enterprise.f2')}</FeatureListItem>
                               <FeatureListItem>{t('landing.pricing.enterprise.f3')}</FeatureListItem>
                               <FeatureListItem>{t('landing.pricing.enterprise.f4')}</FeatureListItem>
                            </ul>
                        </Card>
                    </div>
                 </div>
            </section>
        </div>

        
        <section ref={addToRefs} id="faq" className="py-20 fade-in-section">
          <div className="container mx-auto max-w-3xl px-4">
              <h2 className="text-3xl font-bold text-center text-white mb-12">{t('landing.faq.title')}</h2>
              <Card className="p-2 sm:p-6">
                  {faqItems.map((itemKey, index) => (
                      <FAQItem key={index} itemKey={itemKey} />
                  ))}
              </Card>
          </div>
        </section>

      </main>
    </div>
  );
};

export default LandingPage;
