import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
  t: any;
}

export default function ConfirmationModal({ isOpen, onClose, onGoToLogin, t }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 relative text-center">
          <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-2xl font-light">&times;</button>
          
          <div className="text-5xl mb-4">📧</div>

          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Confirm your email</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            We've sent a confirmation link to your email address. Please check your inbox (and spam folder!) to complete your registration.
          </p>
          
          <div className="mt-6">
            <button 
              onClick={onGoToLogin}
              className="w-full py-3 rounded-lg bg-brand-teal-600 text-white font-bold hover:bg-brand-teal-700 transition-colors shadow-lg"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}