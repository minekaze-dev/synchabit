import React, { useState } from 'react';
import { HabitGroup, User } from '../types';
import Avatar from './Avatar';
import HabitGroupDetailModal from './HabitGroupDetailModal';
import Icon from './Icon';

const cardColors: { [key: string]: { bg: string, text: string, button: string } } = {
  teal: { bg: 'bg-teal-50 dark:bg-teal-900/30', text: 'text-teal-800 dark:text-teal-200', button: 'bg-teal-400 hover:bg-teal-500' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-200', button: 'bg-purple-400 hover:bg-purple-500' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-200', button: 'bg-blue-400 hover:bg-blue-500' },
  green: { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-200', button: 'bg-green-400 hover:bg-green-500' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-200', button: 'bg-yellow-400 hover:bg-yellow-500' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-900/30', text: 'text-pink-800 dark:text-pink-200', button: 'bg-pink-400 hover:bg-pink-500' },
};

const HabitCard: React.FC<{ 
    habitGroup: HabitGroup, 
    t: any, 
    onOpen: () => void,
    onJoin: () => void,
    isMember: boolean,
    isPending: boolean
}> = ({ habitGroup, t, onOpen, onJoin, isMember, isPending }) => {
  const color = cardColors[habitGroup.color || 'teal'];
  const isFull = habitGroup.memberCount >= 20;

  const getButtonState = () => {
    if (isMember) return { text: t.joined, disabled: true, className: 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' };
    if (isFull) return { text: t.groupFull, disabled: true, className: 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' };
    if (isPending) return { text: t.requestSent, disabled: true, className: 'bg-amber-300 text-amber-800 cursor-not-allowed' };
    return { text: t.joinHabit, disabled: false, className: `${color.button} text-white shadow-sm` };
  };

  const buttonState = getButtonState();
  
  const hasCover = !!habitGroup.coverImageUrl;
  const cardBg = hasCover ? 'bg-white dark:bg-slate-900' : color.bg;
  const textColor = hasCover ? 'text-slate-800 dark:text-slate-200' : color.text;
  const descriptionColor = hasCover ? 'text-slate-600 dark:text-slate-400' : 'opacity-70';
  const memberCountColor = hasCover ? 'font-bold text-slate-800 dark:text-slate-200' : 'font-bold text-current';
  const tagColor = hasCover ? 'text-slate-500 dark:text-slate-400' : 'opacity-70';

  return (
    <div className={`rounded-2xl shadow-sm flex flex-col ${cardBg} transition-all duration-200 hover:shadow-lg hover:-translate-y-1 overflow-hidden`}>
      {hasCover && (
        <button onClick={onOpen} className="h-32 w-full block group relative">
          <img src={habitGroup.coverImageUrl} alt={habitGroup.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </button>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <button onClick={onOpen} className={`text-left w-full ${textColor}`}>
          <div className="flex items-start gap-3 mb-2">
            {!hasCover && (
              <div className="bg-white/80 dark:bg-slate-900/50 rounded-lg p-2 shadow-sm">
                  <span className="text-3xl">{habitGroup.emoji}</span>
              </div>
            )}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                {hasCover && <span className="text-2xl">{habitGroup.emoji}</span>}
                <h3 className="text-lg font-bold text-current">{habitGroup.name}</h3>
                {habitGroup.isPrivate && <Icon name="lock" className={`w-4 h-4 ${hasCover ? 'opacity-60' : 'opacity-40'}`} />}
              </div>
            </div>
          </div>
          <p className={`text-sm mt-1 line-clamp-2 ${descriptionColor}`}>{habitGroup.description}</p>
        </button>

        <div className="mt-5 flex-1 flex flex-col justify-end">
            <div className="flex items-center justify-between">
            <div>
                <p className={`${memberCountColor}`}>{habitGroup.memberCount} {t.members}</p>
                <div className={`flex items-center gap-1.5 text-sm mt-1 ${tagColor}`}>
                <span>{habitGroup.tag.emoji}</span>
                <span>{habitGroup.tag.text}</span>
                </div>
            </div>
            <div className="flex -space-x-3">
                {habitGroup.members.slice(0, 3).map(member => (
                    <Avatar key={member.id} user={member} className="w-9 h-9 border-2 border-white dark:border-slate-800" />
                ))}
            </div>
            </div>
        </div>
      </div>
      <div className="px-5 pb-5 pt-3">
          <button 
            onClick={onJoin} 
            disabled={buttonState.disabled} 
            className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm transition-colors ${buttonState.className}`}
          >
              {buttonState.text}
          </button>
      </div>
    </div>
  );
}

const FloatingHearts: React.FC = () => (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <span className="absolute text-pink-200/50 dark:text-pink-900/50 text-5xl -top-5 left-1/4 animate-pulse">♡</span>
        <span className="absolute text-purple-200/50 dark:text-purple-900/50 text-3xl top-1/2 -left-10 animate-pulse delay-500">♡</span>
        <span className="absolute text-teal-200/50 dark:text-teal-900/50 text-6xl top-1/4 -right-10 animate-pulse delay-1000">♡</span>
        <span className="absolute text-blue-200/50 dark:text-blue-900/50 text-4xl bottom-0 right-1/4 animate-pulse delay-700">♡</span>
        <span className="absolute text-green-200/50 dark:text-green-900/50 text-2xl bottom-1/4 left-10 animate-pulse delay-300">♡</span>
    </div>
);


interface FeedProps {
  habitGroups: HabitGroup[];
  t: any;
  currentUser: User;
  onJoinHabitGroup: (habitGroupId: string) => void;
  onRequestToJoinHabitGroup: (habitGroupId: string) => void;
  myHabitGroupIds: string[];
  pendingJoinRequestIds: string[];
}

export default function Feed({ habitGroups, t, currentUser, onJoinHabitGroup, onRequestToJoinHabitGroup, myHabitGroupIds, pendingJoinRequestIds }: FeedProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabitGroup, setSelectedHabitGroup] = useState<HabitGroup | null>(null);

  const handleOpenModal = (habitGroup: HabitGroup) => {
    setSelectedHabitGroup(habitGroup);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHabitGroup(null);
  };

  return (
    <div className="space-y-6 relative">
      <FloatingHearts />
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.exploreNewHabits}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {habitGroups.map(habitGroup => {
            const isMember = myHabitGroupIds.includes(habitGroup.id);
            const isPending = pendingJoinRequestIds.includes(habitGroup.id);
            return (
              <HabitCard 
                key={habitGroup.id} 
                habitGroup={habitGroup} 
                t={t} 
                onOpen={() => handleOpenModal(habitGroup)}
                onJoin={() => habitGroup.isPrivate ? onRequestToJoinHabitGroup(habitGroup.id) : onJoinHabitGroup(habitGroup.id)}
                isMember={isMember}
                isPending={isPending}
              />
            );
          })}
        </div>
      </div>
       {selectedHabitGroup && (
          <HabitGroupDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            habitGroup={selectedHabitGroup}
            t={t}
            onJoin={() => selectedHabitGroup.isPrivate ? onRequestToJoinHabitGroup(selectedHabitGroup.id) : onJoinHabitGroup(selectedHabitGroup.id)}
            isMember={myHabitGroupIds.includes(selectedHabitGroup.id)}
            isPending={pendingJoinRequestIds.includes(selectedHabitGroup.id)}
          />
        )}
    </div>
  );
}