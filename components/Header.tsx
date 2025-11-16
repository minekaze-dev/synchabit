import React from 'react';
import { View } from '../App';
import { HabitGroup, User } from '../types';
import Icon from './Icon';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View, user?: User) => void;
  habitGroups: HabitGroup[];
  onOpenAddHabitGroupModal: () => void;
  t: any;
  selectedHabitGroupId: string | null;
  setSelectedHabitGroupId: (id: string | null) => void;
  hasUnreadMessages: boolean;
  newHabitGroupIds: string[];
  onClearNewHabitGroupNotifications: () => void;
}

export default function Sidebar({ 
    currentView,
    setCurrentView, 
    habitGroups, 
    onOpenAddHabitGroupModal, 
    t,
    selectedHabitGroupId,
    setSelectedHabitGroupId,
    hasUnreadMessages,
    newHabitGroupIds,
    onClearNewHabitGroupNotifications
}: SidebarProps) {
    
    const mainNav = [
        { view: 'feed', icon: 'explore', label: t.exploreHabit },
        { view: 'messages', icon: 'comment', label: t.messages },
    ];
    
  return (
    <aside className="w-72 bg-white dark:bg-slate-900 p-5 border-r border-slate-200 dark:border-slate-800 flex flex-col gap-8 overflow-y-auto">
      
        <div>
            <div className="flex items-center mb-5">
                <div className="p-1.5 bg-brand-teal-500 rounded-lg shadow">
                    <Icon name="logo" className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 ml-2">Synchabit</h1>
            </div>
            <button 
                onClick={onOpenAddHabitGroupModal}
                className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-lg font-semibold transition-colors bg-brand-teal-500 text-white hover:bg-brand-teal-600 shadow flex-shrink-0">
                <Icon name="plus" className="w-6 h-6" />
                {t.createHabitGroup}
            </button>
        </div>

      <nav className="flex flex-col gap-8">
        <div className="space-y-2">
            {mainNav.map(item => {
                const isActive = (item.view === 'feed' && currentView === 'feed' && selectedHabitGroupId === null) || (item.view === 'messages' && currentView === 'messages');
                return (
                     <button 
                        key={item.label}
                        onClick={() => {
                            if (item.view === 'feed') {
                                onClearNewHabitGroupNotifications();
                            }
                            setCurrentView(item.view as View);
                            setSelectedHabitGroupId(null);
                        }}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-base transition-colors text-left 
                            ${isActive 
                                ? 'bg-brand-teal-50 dark:bg-brand-teal-950 text-brand-teal-700 dark:text-brand-teal-300 font-bold' 
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100'
                            }`}
                     >
                        <div className="relative">
                            <Icon name={item.icon as any} className={`w-6 h-6 transition-colors ${isActive ? 'text-brand-teal-600 dark:text-brand-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                            {item.view === 'messages' && hasUnreadMessages && (
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-slate-900" />
                            )}
                            {item.view === 'feed' && newHabitGroupIds.length > 0 && (
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-slate-900" />
                            )}
                        </div>
                        <span>{item.label}</span>
                    </button>
                )
            })}
        </div>

        <div>
            <div className="flex justify-between items-center px-3 mb-2">
                <h2 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">{t.myHabitGroups}</h2>
            </div>
            <div className="space-y-1">
                {habitGroups.slice(0, 4).map(habitGroup => {
                    const isActive = habitGroup.id === selectedHabitGroupId;
                    return (
                        <button 
                            key={habitGroup.id} 
                            onClick={() => {
                                setCurrentView('feed');
                                setSelectedHabitGroupId(habitGroup.id);
                            }} 
                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors text-left 
                                ${isActive 
                                    ? 'bg-brand-teal-50 dark:bg-brand-teal-950 text-brand-teal-700 dark:text-brand-teal-300 font-bold' 
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100'
                                }`}
                        >
                            <span className="text-lg">{habitGroup.emoji}</span>
                            <span>{habitGroup.name}</span>
                        </button>
                    )
                })}
            </div>
        </div>
      </nav>

    </aside>
  );
}