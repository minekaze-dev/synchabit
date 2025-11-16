import React, { useState } from 'react';
import { Habit, HabitFrequency } from '../types';
import { PERSONAL_HABIT_ICONS } from '../constants';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (newHabit: Omit<Habit, 'id' | 'streak'>) => void;
  t: any;
}

export default function AddHabitModal({ isOpen, onClose, onAddHabit, t }: AddHabitModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💧');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddHabit({ name, icon, frequency: HabitFrequency.DAILY });
      setName('');
      setIcon('💧');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-2xl font-light">&times;</button>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">{t.addNewHabit}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="habit-name" className="text-sm font-semibold text-slate-600 dark:text-slate-300 block mb-2">{t.habitName}</label>
              <input
                type="text"
                id="habit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.habitNamePlaceholder}
                className="w-full p-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none placeholder-slate-400 dark:placeholder-slate-500"
                required
              />
            </div>
             <div>
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 block mb-2">{t.chooseAnIcon}</label>
              <div className="grid grid-cols-6 gap-2">
                {PERSONAL_HABIT_ICONS.map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setIcon(opt)}
                    className={`text-3xl p-2 rounded-lg border-2 transition-all ${icon === opt ? 'border-brand-teal-500 bg-brand-teal-50 dark:bg-brand-teal-900/50' : 'border-transparent bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                {t.cancel}
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-lg bg-brand-teal-600 text-white font-bold hover:bg-brand-teal-700 transition-colors shadow-md">
                {t.addHabit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}