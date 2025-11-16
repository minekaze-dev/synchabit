
import React, { useState } from 'react';
import { Habit } from '../types';

interface AddHabitLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLog: (note: string) => void;
  habit: Habit;
  date: number;
  t: any;
}

export default function AddHabitLogModal({ isOpen, onClose, onAddLog, habit, date, t }: AddHabitLogModalProps) {
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLog(note);
    setNote('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">{habit.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{t.addHabitNote}</h2>
              <p className="text-slate-600 font-semibold">{habit.name} - November {date}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <label htmlFor="log-note" className="text-sm font-semibold text-slate-600 block mb-2">{t.noteOptional}</label>
            <textarea
              id="log-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.howDidItGo}
              rows={4}
              className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none"
            ></textarea>

            <div className="flex justify-end gap-3 pt-5">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors">
                {t.cancel}
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-lg bg-brand-teal-600 text-white font-bold hover:bg-brand-teal-700 transition-colors shadow-md">
                {t.checkIn}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
