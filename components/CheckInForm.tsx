
import React, { useState, useEffect } from 'react';
import { Habit } from '../types';

interface CheckInFormProps {
  habits: Habit[];
  onCheckIn: (habitId: string, note: string, imageUrl?: string) => void;
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

export default function CheckInForm({ habits, onCheckIn, isOpen, onClose, t }: CheckInFormProps) {
  const [selectedHabit, setSelectedHabit] = useState<string>('');
  const [note, setNote] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (habits.length > 0) {
      setSelectedHabit(habits[0].id);
    }
  }, [habits]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHabit) {
      alert("Please select a habit to check in.");
      return;
    }
    onCheckIn(selectedHabit, note, imagePreview || undefined);
    setNote('');
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">{t.checkinProgress}</h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="habit-select" className="text-sm font-medium text-slate-700 block mb-1">{t.selectHabit}</label>
              <select
                id="habit-select"
                value={selectedHabit}
                onChange={(e) => setSelectedHabit(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500"
              >
                {habits.map(habit => (
                  <option key={habit.id} value={habit.id}>
                    {habit.icon} {habit.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="note" className="text-sm font-medium text-slate-700 block mb-1">{t.noteOptional}</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.howDidItGo}
                rows={3}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500"
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 text-slate-500 hover:text-brand-blue-600">
                  <span>📷</span>
                  <span className="text-sm font-medium">{t.addPhoto}</span>
                </label>
                <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {imagePreview && <img src={imagePreview} alt="preview" className="w-10 h-10 rounded-md object-cover" />}
              </div>
              <button
                type="submit"
                className="bg-brand-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-teal-700 transition-colors"
              >
                {t.checkIn}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}