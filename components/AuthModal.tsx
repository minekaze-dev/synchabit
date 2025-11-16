import React, { useState } from 'react';
import Icon from './Icon';

type AuthMode = 'login' | 'register' | 'forgot';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AuthMode;
  onSwitchMode: (mode: AuthMode) => void;
  onLogin: (email: string, pass: string) => boolean;
  t: any;
}

const AuthInput: React.FC<{ id: string; type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; icon: React.ReactNode }> = ({ id, type, placeholder, value, onChange, icon }) => (
    <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">{icon}</span>
        <input 
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-lg pl-12 pr-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-teal-500 focus:bg-white dark:focus:bg-slate-800/50 transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-400"
            required
        />
    </div>
);

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode, onLogin, t }: AuthModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (mode === 'login') {
        onLogin(email, password);
      } else if (mode === 'register') {
        // Handle registration logic
        alert('Registration feature coming soon!');
      } else {
        // Handle forgot password logic
        alert('Password reset link sent (not really)!');
      }
  };

  const getTitle = () => {
      switch(mode) {
          case 'login': return t.welcomeBack;
          case 'register': return t.createYourAccount;
          case 'forgot': return t.resetYourPassword;
      }
  };

  const getButtonText = () => {
    switch(mode) {
        case 'login': return t.login;
        case 'register': return t.register;
        case 'forgot': return t.sendResetLink;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-8 relative">
          <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-2xl font-light">&times;</button>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{getTitle()}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
                {mode === 'login' && <>{t.dontHaveAccount} <button type="button" onClick={() => onSwitchMode('register')} className="font-semibold text-brand-teal-600 dark:text-brand-teal-400 hover:underline">{t.register}</button></>}
                {mode === 'register' && <>{t.alreadyHaveAccount} <button type="button" onClick={() => onSwitchMode('login')} className="font-semibold text-brand-teal-600 dark:text-brand-teal-400 hover:underline">{t.login}</button></>}
                {mode === 'forgot' && <>{t.rememberedPassword} <button type="button" onClick={() => onSwitchMode('login')} className="font-semibold text-brand-teal-600 dark:text-brand-teal-400 hover:underline">{t.login}</button></>}
            </p>
          </div>
          
          <div className="space-y-4">
            {mode === 'register' && (
                <AuthInput 
                    id="fullName"
                    type="text"
                    placeholder={t.fullName}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    icon={<Icon name="user" className="w-5 h-5" />}
                />
            )}
            <AuthInput 
                id="email"
                type="email"
                placeholder={t.emailAddress}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<>@</>}
            />
            {mode !== 'forgot' && (
                <div className="relative">
                     <AuthInput 
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t.password}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Icon name="lock" className="w-5 h-5" />}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                        <Icon name={showPassword ? 'eye-slash' : 'eye'} className="w-5 h-5" />
                    </button>
                </div>
            )}
            
            {mode === 'login' && (
                <div className="text-right">
                    <button type="button" onClick={() => onSwitchMode('forgot')} className="text-sm font-semibold text-brand-teal-600 dark:text-brand-teal-400 hover:underline">
                        {t.forgotPassword}
                    </button>
                </div>
            )}

            <button type="submit" className="w-full py-3.5 rounded-lg bg-brand-teal-600 text-white font-bold hover:bg-brand-teal-700 transition-colors shadow-lg">
                {getButtonText()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}