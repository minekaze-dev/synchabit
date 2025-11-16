import React from 'react';
import { Language } from '../translations';
import Icon from './Icon';

interface LandingPageProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
  t: any;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const FeatureTag: React.FC<{ icon: string; text: string; }> = ({ icon, text }) => (
    <div className="bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
        <span>{icon}</span>
        <span>{text}</span>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onShowLogin, onShowRegister, t, language, setLanguage }) => {
  const heroImageUrl = 'https://i.imgur.com/FxjjSYr.jpg';

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-brand-teal-500 to-brand-teal-800 font-sans text-white overflow-hidden">
      <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center">
        <div className="flex items-center">
            <Icon name="logo" className="h-8 w-8 text-white" />
            <div className="text-2xl font-bold tracking-wider ml-2">Synchabit</div>
        </div>
        <button onClick={toggleLanguage} className="border border-white/50 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors w-16">
            {language === 'en' ? 'ID' : 'EN'}
        </button>
      </header>
      
      <main className="h-full w-full flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto px-8">
            {/* Left Column */}
            <div className="flex flex-col items-start text-left">
                <div className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                    {t.communityTagline}
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)'}} dangerouslySetInnerHTML={{ __html: t.heroTitle }}>
                </h1>
                <p className="text-lg text-white/80 mb-6 max-w-md">
                    {t.heroSubtitle}
                </p>
                <div className="flex items-center gap-3 mb-8">
                    <FeatureTag icon="😟" text={t.featureTag1} />
                    <FeatureTag icon="📅" text={t.featureTag2} />
                    <FeatureTag icon="🤝" text={t.featureTag3} />
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onShowLogin}
                        className="bg-black/20 backdrop-blur-lg text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105"
                    >
                        {t.login}
                    </button>
                    <button 
                        onClick={onShowRegister}
                        className="bg-white text-brand-teal-700 font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
                    >
                        {t.registerFree}
                    </button>
                </div>
            </div>

            {/* Right Column */}
            <div className="hidden lg:flex items-center justify-center relative">
                <div className="bg-white p-4 rounded-3xl shadow-2xl w-full max-w-xl aspect-video relative">
                    <img 
                        src={heroImageUrl} 
                        alt="App preview" 
                        className="w-full h-full object-contain rounded-xl"
                    />
                    {/* Floating UI elements to mimic the design */}
                    <div className="absolute top-0 left-8 bg-white p-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                        <span className="text-xl">🏃</span>
                        <div className="text-sm">
                            <p className="font-bold text-slate-700">Running 5K</p>
                            <div className="w-20 h-1 bg-slate-200 rounded-full mt-1">
                                <div className="w-3/4 h-1 bg-brand-teal-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 p-8 text-xs text-white/60 flex justify-between items-center">
        <span>{t.copyright}</span>
        <div className="flex gap-4">
            <a href="#" className="hover:text-white">{t.privacy}</a>
            <a href="#" className="hover:text-white">{t.terms}</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;