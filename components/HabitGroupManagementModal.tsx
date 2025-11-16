import React, { useState, useRef } from 'react';
import { HabitGroup, User, Notification } from '../types';
import Icon from './Icon';
import Avatar from './Avatar';

interface HabitGroupManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitGroup: HabitGroup;
  t: any;
  onUpdateHabitGroup: (habitGroupId: string, updates: Partial<HabitGroup>) => void;
  onDeleteHabitGroup: (habitGroupId: string) => void;
  onRemoveMember: (habitGroupId: string, memberId: string) => void;
  currentUser: User;
  notifications: Notification[];
  onJoinRequestResponse: (notification: Notification, accept: boolean) => void;
}

type Tab = 'edit' | 'members' | 'settings';

const EditDetailsTab: React.FC<{ habitGroup: HabitGroup, onUpdateHabitGroup: (habitGroupId: string, updates: Partial<HabitGroup>) => void, t: any }> = ({ habitGroup, onUpdateHabitGroup, t }) => {
    const [name, setName] = useState(habitGroup.name);
    const [description, setDescription] = useState(habitGroup.description);
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(habitGroup.coverImageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCoverImageUrl(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleRemoveImage = () => {
        setCoverImageUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSave = () => {
        onUpdateHabitGroup(habitGroup.id, { name, description, coverImageUrl: coverImageUrl || undefined });
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="huddle-edit-name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">{t.habitGroupName}</label>
                <input
                    type="text"
                    id="huddle-edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-teal-500"
                />
            </div>
            <div>
                <label htmlFor="huddle-edit-desc" className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">{t.habitGroupDescription}</label>
                <textarea
                    id="huddle-edit-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-teal-500 resize-none"
                />
            </div>
            <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">{t.editCoverImage}</label>
                <div className="mt-2 w-full">
                    {coverImageUrl ? (
                        <div className="relative group">
                            <img src={coverImageUrl} alt="Cover preview" className="w-full h-48 object-cover rounded-lg shadow-inner" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={() => fileInputRef.current?.click()} type="button" className="bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors" aria-label="Change image">
                                    <Icon name="pencil" className="w-4 h-4" />
                                </button>
                                <button onClick={handleRemoveImage} type="button" className="bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors" aria-label="Remove image">
                                    <Icon name="trash" className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center text-slate-500 dark:text-slate-400">
                                <Icon name="gallery" className="w-10 h-10 mb-3" />
                                <p className="mb-2 text-sm font-semibold">{t.uploadAnImage}</p>
                            </div>
                        </button>
                    )}
                    <input id="cover-image-upload" type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <button onClick={handleSave} className="px-5 py-2.5 rounded-lg bg-brand-teal-600 text-white font-bold hover:bg-brand-teal-700 transition-colors">
                    {t.saveChanges}
                </button>
            </div>
        </div>
    );
};

const ManageMembersTab: React.FC<{ 
    habitGroup: HabitGroup, 
    onRemoveMember: (habitGroupId: string, memberId: string) => void, 
    t: any,
    joinRequests: Notification[],
    onJoinRequestResponse: (notification: Notification, accept: boolean) => void;
    isCreator: boolean;
}> = ({ habitGroup, onRemoveMember, t, joinRequests, onJoinRequestResponse, isCreator }) => {
    return (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {isCreator && habitGroup.isPrivate && joinRequests.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.joinRequests} ({joinRequests.length})</h4>
                    {joinRequests.map(req => (
                        <div key={req.id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Avatar user={req.actor} className="w-10 h-10" />
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{req.actor.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => onJoinRequestResponse(req, false)}
                                    className="px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">
                                    {t.decline}
                                </button>
                                <button 
                                    onClick={() => onJoinRequestResponse(req, true)}
                                    className="px-3 py-1 text-xs font-bold text-white bg-brand-teal-500 rounded-md hover:bg-brand-teal-600">
                                    {t.accept}
                                </button>
                            </div>
                        </div>
                    ))}
                    <hr className="my-4 border-slate-200 dark:border-slate-700" />
                </div>
            )}
             <div className="space-y-3">
                {[habitGroup.creator, ...habitGroup.members].map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Avatar user={member} className="w-10 h-10" />
                            <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">{member.name}</p>
                                {member.id === habitGroup.creator.id && <p className="text-xs text-brand-teal-600 dark:text-brand-teal-400 font-semibold">{t.creator}</p>}
                            </div>
                        </div>
                        {isCreator && member.id !== habitGroup.creator.id && (
                            <button 
                                onClick={() => onRemoveMember(habitGroup.id, member.id)}
                                className="px-3 py-1 text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50"
                            >
                                {t.remove}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const SettingsTab: React.FC<{ 
    habitGroup: HabitGroup, 
    onUpdateHabitGroup: (habitGroupId: string, updates: Partial<HabitGroup>) => void, 
    t: any,
    onOpenDeleteConfirm: () => void,
}> = ({ habitGroup, onUpdateHabitGroup, t, onOpenDeleteConfirm }) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">{t.privacy}</label>
                <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => onUpdateHabitGroup(habitGroup.id, { isPrivate: false })} className={`p-3 rounded-lg border-2 text-left transition-colors ${!habitGroup.isPrivate ? 'border-brand-teal-500 bg-brand-teal-50 dark:bg-brand-teal-950/50' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{t.open}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.openDesc}</div>
                    </button>
                    <button type="button" onClick={() => onUpdateHabitGroup(habitGroup.id, { isPrivate: true })} className={`p-3 rounded-lg border-2 text-left transition-colors ${habitGroup.isPrivate ? 'border-brand-teal-500 bg-brand-teal-50 dark:bg-brand-teal-950/50' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                            <Icon name="lock" className="w-4 h-4" />
                            {t.locked}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.lockedDesc}</div>
                    </button>
                </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                 <h4 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3">Danger Zone</h4>
                 <button 
                    onClick={onOpenDeleteConfirm}
                    className="w-full text-left bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 p-3 rounded-lg flex justify-between items-center"
                >
                    <span className="font-bold text-red-700 dark:text-red-300">{t.deleteGroup}</span>
                    <Icon name="trash" className="w-5 h-5 text-red-600 dark:text-red-400" />
                </button>
            </div>
        </div>
    );
};


export default function HabitGroupManagementModal({ isOpen, onClose, habitGroup, t, onUpdateHabitGroup, onDeleteHabitGroup, onRemoveMember, currentUser, notifications, onJoinRequestResponse }: HabitGroupManagementModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('members');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!isOpen) return null;

  const isCreator = currentUser.id === habitGroup.creator.id;

  const allTabs: { id: Tab; label: string }[] = [
    { id: 'edit', label: t.editDetails },
    { id: 'members', label: t.manageMembers },
    { id: 'settings', label: t.habitSettings },
  ];
  
  const TABS_FOR_MEMBER: { id: Tab; label: string }[] = [allTabs[1]];
  
  const tabs = isCreator ? allTabs : TABS_FOR_MEMBER;
  
  const joinRequests = notifications.filter(n => n.type === 'join_request' && n.target.id === habitGroup.id);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-300 text-2xl font-light">&times;</button>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t.manageHabitGroup}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{habitGroup.name}</p>
          
          <div className="relative">
            <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
              <nav className="-mb-px flex space-x-6">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-brand-teal-500 text-brand-teal-600 dark:text-brand-teal-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              {activeTab === 'edit' && isCreator && <EditDetailsTab habitGroup={habitGroup} onUpdateHabitGroup={onUpdateHabitGroup} t={t} />}
              {activeTab === 'members' && <ManageMembersTab habitGroup={habitGroup} onRemoveMember={onRemoveMember} t={t} joinRequests={joinRequests} onJoinRequestResponse={onJoinRequestResponse} isCreator={isCreator} />}
              {activeTab === 'settings' && isCreator && <SettingsTab habitGroup={habitGroup} onUpdateHabitGroup={onUpdateHabitGroup} t={t} onOpenDeleteConfirm={() => setIsDeleteConfirmOpen(true)} />}
            </div>

            {isDeleteConfirmOpen && isCreator && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl p-4">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 text-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t.deleteGroupConfirmationTitle}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">{t.deleteGroupConfirmationBody}</p>
                  <div className="flex justify-center gap-3 mt-6">
                    <button onClick={() => setIsDeleteConfirmOpen(false)} className="px-5 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                      {t.cancel}
                    </button>
                    <button onClick={() => onDeleteHabitGroup(habitGroup.id)} className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors">
                      {t.delete}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}