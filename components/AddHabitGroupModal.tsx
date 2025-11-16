import React, { useState, useRef } from 'react';
import Icon from './Icon';
import { HABIT_CATEGORIES } from '../constants';

interface AddHabitGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabitGroup: (data: { name: string, description: string, category: string, rules: string, isPrivate: boolean, coverImageUrl?: string }) => void;
  t: any;
}

const FormInput: React.FC<{ id: string, label: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean }> = 
    ({ id, label, placeholder, value, onChange, required = false }) => (
    <div>
        <label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">{label}</label>
        <input
            type="text"
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            required={required}
        />
    </div>
);

const FormTextarea: React.FC<{ id: string, label: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> = 
    ({ id, label, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">{label}</label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className="w-full p-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
        ></textarea>
    </div>
);

const PrivacyToggle: React.FC<{ isPrivate: boolean; setIsPrivate: (isPrivate: boolean) => void; t: any; }> = ({ isPrivate, setIsPrivate, t }) => (
    <div>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">{t.privacy}</label>
        <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setIsPrivate(false)} className={`p-3 rounded-lg border-2 text-left transition-colors ${!isPrivate ? 'border-brand-teal-500 bg-brand-teal-50 dark:bg-brand-teal-950/50' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <div className="font-bold text-slate-800 dark:text-slate-200">{t.open}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.openDesc}</div>
            </button>
            <button type="button" onClick={() => setIsPrivate(true)} className={`p-3 rounded-lg border-2 text-left transition-colors ${isPrivate ? 'border-brand-teal-500 bg-brand-teal-50 dark:bg-brand-teal-950/50' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                    <Icon name="lock" className="w-4 h-4" />
                    {t.locked}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.lockedDesc}</div>
            </button>
        </div>
    </div>
);

export default function AddHabitGroupModal({ isOpen, onClose, onAddHabitGroup, t }: AddHabitGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [rules, setRules] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim() && category.trim()) {
      onAddHabitGroup({ name, description, category: category, rules, isPrivate, coverImageUrl: imagePreview || undefined });
      setName('');
      setDescription('');
      setCategory('');
      setRules('');
      setIsPrivate(false);
      setImagePreview(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 relative max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-2xl font-light">&times;</button>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">{t.createHabitGroup}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput id="huddle-name" label={t.habitGroupName} placeholder={t.habitGroupNamePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
            <FormTextarea id="huddle-description" label={t.habitGroupDescription} placeholder={t.habitGroupDescriptionPlaceholder} value={description} onChange={(e) => setDescription(e.target.value)} />
            
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">{t.coverImageOptional}</label>
              <div className="mt-2 w-full">
                  {imagePreview ? (
                      <div className="relative group">
                          <img src={imagePreview} alt="Cover preview" className="w-full h-32 object-cover rounded-lg shadow-inner" />
                          <button 
                              onClick={handleRemoveImage} 
                              type="button" 
                              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
                              aria-label="Remove image"
                          >
                              <Icon name="trash" className="w-4 h-4" />
                          </button>
                      </div>
                  ) : (
                      <label htmlFor="cover-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center text-slate-500 dark:text-slate-400">
                              <Icon name="gallery" className="w-8 h-8 mb-3" />
                              <p className="mb-2 text-sm font-semibold">{t.uploadAnImage}</p>
                              <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                          </div>
                      </label>
                  )}
                  <input id="cover-image-upload" type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
              </div>
            </div>

            <div>
                <label htmlFor="huddle-category" className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">{t.habitGroupCategory}</label>
                <select
                    id="huddle-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 outline-none"
                    required
                >
                    <option value="" disabled>{t.habitGroupCategoryPlaceholder}</option>
                    {HABIT_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {t[cat.translationKey]}
                        </option>
                    ))}
                </select>
            </div>
            
            <PrivacyToggle isPrivate={isPrivate} setIsPrivate={setIsPrivate} t={t} />

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                {t.cancel}
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-lg bg-brand-teal-600 text-white font-bold hover:bg-brand-teal-700 transition-colors shadow-md">
                {t.createHabitGroup}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}