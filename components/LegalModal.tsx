import React from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  t: any;
}

export default function LegalModal({ isOpen, onClose, title, children, t }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl h-full sm:h-3/4 flex flex-col transition-transform duration-300 transform scale-95" 
        onClick={(e) => e.stopPropagation()}
        style={isOpen ? { transform: 'scale(1)', opacity: 1 } : { transform: 'scale(0.95)', opacity: 0 }}
      >
        <header className="p-5 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-2xl font-light">&times;</button>
        </header>
        <main className="p-6 overflow-y-auto flex-grow text-slate-700 dark:text-slate-300 leading-relaxed">
          {children}
        </main>
        <footer className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-end rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            {t.close}
          </button>
        </footer>
      </div>
    </div>
  );
}