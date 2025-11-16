import React, { useState } from 'react';
// FIX: The 'Huddle' type does not exist. It has been replaced with 'HabitGroup'.
import { HabitGroup, User } from '../types';
import Icon from './Icon';
import Avatar from './Avatar';

interface HuddleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: The 'Huddle' type does not exist. It has been replaced with 'HabitGroup'.
  huddle: HabitGroup;
  t: any;
  // FIX: The 'Huddle' type does not exist. It has been replaced with 'HabitGroup'.
  onUpdateHuddle: (huddleId: string, updates: Partial<HabitGroup>) => void;
  onRemoveMember: (huddleId: string, memberId: string) => void;
  currentUser: User;
}

type Tab = 'edit' | 'members' | 'settings';

// FIX: The 'Huddle' type does not exist. It has been replaced with 'HabitGroup'.
const EditDetailsTab: React.FC<{ huddle: HabitGroup, onUpdateHuddle: (huddleId: string, updates: Partial<HabitGroup>) => void, t: any }> = ({ huddle, onUpdateHuddle, t }) => {
    const [name, setName] = useState(huddle.name);
    const [description, setDescription] = useState(huddle.description);

    const handleSave = () => {
        onUpdateHuddle(huddle.id, { name, description });
        // Maybe show a success message
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="huddle-edit-name" className="text-sm font-semibold text-slate-700 block mb-2">{t.huddleName}</label>
                <input
                    type="text"
                    id="huddle-edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500"
                />
            </div>
            <div>
                <label htmlFor="huddle-edit-desc" className="text-sm font-semibold text-slate-700 block mb-2">{t.huddleDescription}</label>
                <textarea
                    id="huddle-edit-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 resize-none"
                />
            </div>
            <div className="flex justify-end">
                <button onClick={handleSave} className="px-5 py-2.5 rounded-lg bg-brand-teal-600 text-white font-bold hover:bg-brand-teal-700 transition-colors">
                    {t.saveChanges}
                </button>
            </div>
        </div>
    );
};

// FIX: The 'Huddle' type does not exist. It has been replaced with 'HabitGroup'.
const ManageMembersTab: React.FC<{ huddle: HabitGroup, onRemoveMember: (huddleId: string, memberId: string) => void, t: any }> = ({ huddle, onRemoveMember, t }) => {
    return (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {[huddle.creator, ...huddle.members].map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Avatar user={member} className="w-10 h-10" />
                        <div>
                            <p className="font-bold text-slate-800">{member.name}</p>
                            {member.id === huddle.creator.id && <p className="text-xs text-brand-teal-600 font-semibold">Creator</p>}
                        </div>
                    </div>
                    {member.id !== huddle.creator.id && (
                        <button 
                            onClick={() => onRemoveMember(huddle.id, member.id)}
                            className="px-3 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                        >
                            {t.remove}
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

// FIX: The 'Huddle' type does not exist. It has been replaced with 'HabitGroup'.
const SettingsTab: React.FC<{ huddle: HabitGroup, onUpdateHuddle: (huddleId: string, updates: Partial<HabitGroup>) => void, t: any }> = ({ huddle, onUpdateHuddle, t }) => {
    return (
        <div>
            <label className="text-sm font-semibold text-slate-700 block mb-3">{t.privacy}</label>
            <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => onUpdateHuddle(huddle.id, { isPrivate: false })} className={`p-3 rounded-lg border-2 text-left transition-colors ${!huddle.isPrivate ? 'border-brand-teal-500 bg-brand-teal-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                    <div className="font-bold text-slate-800">{t.open}</div>
                    <div className="text-xs text-slate-500 mt-1">{t.openDesc}</div>
                </button>
                <button type="button" onClick={() => onUpdateHuddle(huddle.id, { isPrivate: true })} className={`p-3 rounded-lg border-2 text-left transition-colors ${huddle.isPrivate ? 'border-brand-teal-500 bg-brand-teal-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                        <Icon name="lock" className="w-4 h-4" />
                        {t.locked}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{t.lockedDesc}</div>
                </button>
            </div>
        </div>
    );
};


export default function HuddleManagementModal({ isOpen, onClose, huddle, t, onUpdateHuddle, onRemoveMember, currentUser }: HuddleManagementModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('edit');

  if (!isOpen) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'edit', label: t.editDetails },
    { id: 'members', label: t.manageMembers },
    { id: 'settings', label: t.habitSettings },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{t.manageHabit}</h2>
          <p className="text-slate-500 mb-6">{huddle.name}</p>

          <div className="border-b border-slate-200 mb-6">
            <nav className="-mb-px flex space-x-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-brand-teal-500 text-brand-teal-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            {activeTab === 'edit' && <EditDetailsTab huddle={huddle} onUpdateHuddle={onUpdateHuddle} t={t} />}
            {activeTab === 'members' && <ManageMembersTab huddle={huddle} onRemoveMember={onRemoveMember} t={t} />}
            {activeTab === 'settings' && <SettingsTab huddle={huddle} onUpdateHuddle={onUpdateHuddle} t={t} />}
          </div>

        </div>
      </div>
    </div>
  );
}