
import React, { useState } from 'react';
import Icon from './Icon';
import { HABIT_CATEGORIES } from '../constants';

interface AddHuddleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHuddle: (data: { name: string, description: string, category: string, rules: string, isPrivate: boolean }) => void;
  t: any;
}

const FormInput: React.FC<{ id: string, label: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean }> = 
    ({ id, label, placeholder, value, onChange, required = false }) => (
    <div>
        <label htmlFor={id} className="text-sm font-semibold text-slate-700 block mb-2">{label}</label>
        <input
            type="text"
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none"
            required={required}
        />
    </div>
);

const FormTextarea: React.FC<{ id: string, label: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> = 
    ({ id, label, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="text-sm font-semibold text-slate-700 block mb-2">{label}</label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none resize-none"
        ></textarea>
    </div>
);

const PrivacyToggle: React.FC<{ isPrivate: boolean; setIsPrivate: (isPrivate: boolean) => void; t: any; }> = ({ isPrivate, setIsPrivate, t }) => (
    <div>
        <label className="text-sm font-semibold text-slate-700 block mb-3">{t.privacy}</label>
        <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setIsPrivate(false)} className={`p-3 rounded-lg border-2 text-left transition-colors ${!isPrivate ? 'border-brand-teal-500 bg-brand-teal-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                <div className="font-bold text-slate-800">{t.open}</div>
                <div className="text-xs text-slate-500 mt-1">{t.openDesc}</div>
            </button>
            <button type="button" onClick={() => setIsPrivate(true)} className={`p-3 rounded-lg border-2 text-left transition-colors ${isPrivate ? 'border-brand-teal-500 bg-brand-teal-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Icon name="lock" className="w-4 h-4" />
                    {t.locked}
                </div>
                <div className="text-xs text-slate-500 mt-1">{t.lockedDesc}</div>
            </button>
        </div>
    </div>
);

export default function AddHuddleModal({ isOpen, onClose, onAddHuddle, t }: AddHuddleModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [rules, setRules] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim() && category.trim()) {
      const selectedCategory = HABIT_CATEGORIES.find(c => c.id === category);
      const categoryName = selectedCategory ? t[selectedCategory.translationKey] : category;
      onAddHuddle({ name, description, category: categoryName, rules, isPrivate });
      setName('');
      setDescription('');
      setCategory('');
      setRules('');
      setIsPrivate(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">{t.createHuddle}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput id="huddle-name" label={t.huddleName} placeholder={t.huddleNamePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
            <FormTextarea id="huddle-description" label={t.huddleDescription} placeholder={t.huddleDescriptionPlaceholder} value={description} onChange={(e) => setDescription(e.target.value)} />
            
            <div>
                <label htmlFor="huddle-category" className="text-sm font-semibold text-slate-700 block mb-2">{t.huddleCategory}</label>
                <select
                    id="huddle-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none"
                    required
                >
                    <option value="" disabled>{t.huddleCategoryPlaceholder}</option>
                    {HABIT_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {t[cat.translationKey]}
                        </option>
                    ))}
                </select>
            </div>
            
            <PrivacyToggle isPrivate={isPrivate} setIsPrivate={setIsPrivate} t={t} />

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors">
                {t.cancel}
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-lg bg-brand-teal-600 text-white font-bold hover:bg-brand-teal-700 transition-colors shadow-md">
                {t.createHuddle}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}