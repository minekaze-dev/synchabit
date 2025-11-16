import React, { useState } from 'react';
import { Language } from '../translations';
import LegalModal from './LegalModal';
import Icon from './Icon';
import { Theme } from '../App';

interface SettingsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: any;
  onLogout: () => void;
}

export default function Settings({ language, setLanguage, theme, setTheme, t, onLogout }: SettingsProps) {
  const [modalContent, setModalContent] = useState<'terms' | 'policy' | null>(null);

  const LanguageButton: React.FC<{ lang: Language, children: React.ReactNode }> = ({ lang, children }) => {
    const isActive = language === lang;
    return (
      <button
        onClick={() => setLanguage(lang)}
        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
          isActive
            ? 'bg-brand-teal-600 text-white shadow'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {children}
      </button>
    );
  };
  
  const ThemeButton: React.FC<{ themeName: Theme, children: React.ReactNode }> = ({ themeName, children }) => {
    const isActive = theme === themeName;
    return (
      <button
        onClick={() => setTheme(themeName)}
        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
          isActive
            ? 'bg-brand-teal-600 text-white shadow'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {children}
      </button>
    );
  };
  
  const getModalTitle = () => {
      if (modalContent === 'terms') return t.termsAndConditions;
      if (modalContent === 'policy') return t.privacyPolicy;
      return '';
  }

  const contentToShow = modalContent === 'terms' 
    ? t.termsContent 
    : modalContent === 'policy' 
    ? t.privacyPolicyContent 
    : '';

  return (
    <>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.settings}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your application settings.</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{t.language}</h3>
          <div className="flex items-center gap-4">
            <LanguageButton lang="en">English</LanguageButton>
            <LanguageButton lang="id">Bahasa Indonesia</LanguageButton>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{t.theme}</h3>
          <div className="flex items-center gap-4">
            <ThemeButton themeName="light">{t.light}</ThemeButton>
            <ThemeButton themeName="dark">{t.dark}</ThemeButton>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{t.legal}</h3>
          <div className="flex items-center gap-4">
              <button onClick={() => setModalContent('terms')} className="text-brand-teal-600 dark:text-brand-teal-400 hover:underline font-semibold">
                  {t.termsAndConditions}
              </button>
              <button onClick={() => setModalContent('policy')} className="text-brand-teal-600 dark:text-brand-teal-400 hover:underline font-semibold">
                  {t.privacyPolicy}
              </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/70 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">{t.account}</h3>
            <button 
                onClick={onLogout} 
                className="flex items-center gap-3 w-full sm:w-auto px-4 py-2.5 rounded-lg text-base transition-colors text-left bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-bold"
            >
                <Icon name="logout" className="w-5 h-5" />
                <span>{t.logout}</span>
            </button>
        </div>
      </div>
      
      {/* FIX: Explicitly pass children prop to LegalModal to satisfy its prop requirements. */}
      <LegalModal
          isOpen={!!modalContent}
          onClose={() => setModalContent(null)}
          title={getModalTitle()}
          t={t}
          children={
            <div 
                className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: contentToShow }} 
            />
          }
      />
    </>
  );
}