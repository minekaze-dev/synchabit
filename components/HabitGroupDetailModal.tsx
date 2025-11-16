import React from 'react';
import { HabitGroup } from '../types';
import Avatar from './Avatar';
import Icon from './Icon';

interface HabitGroupDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitGroup: HabitGroup;
  t: any;
  onJoin: () => void;
  isMember: boolean;
  isPending: boolean;
}

export default function HabitGroupDetailModal({ isOpen, onClose, habitGroup, t, onJoin, isMember, isPending }: HabitGroupDetailModalProps) {
  if (!isOpen) return null;

  const cardColors: { [key: string]: { bg: string, text: string, button: string, gradient: string } } = {
    teal: { bg: 'bg-teal-50', text: 'text-teal-800', button: 'bg-teal-500 hover:bg-teal-600', gradient: 'from-teal-400 to-cyan-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-800', button: 'bg-purple-500 hover:bg-purple-600', gradient: 'from-purple-500 to-indigo-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-800', button: 'bg-blue-500 hover:bg-blue-600', gradient: 'from-blue-400 to-sky-500' },
    green: { bg: 'bg-green-50', text: 'text-green-800', button: 'bg-green-500 hover:bg-green-600', gradient: 'from-green-400 to-lime-500' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-800', button: 'bg-yellow-400 hover:bg-yellow-500', gradient: 'from-yellow-300 to-amber-400' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-800', button: 'bg-pink-500 hover:bg-pink-600', gradient: 'from-pink-400 to-rose-500' },
  };
  const color = cardColors[habitGroup.color || 'teal'];

  const isFull = habitGroup.memberCount >= 20;

  const getButtonState = () => {
      if (isMember) return { text: t.joined, disabled: true, className: 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400' };
      if (isFull) return { text: t.groupFull, disabled: true, className: 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400' };
      if (isPending) return { text: t.requestSent, disabled: true, className: 'bg-amber-400 text-amber-900' };
      return { text: t.joinHabit, disabled: false, className: color.button };
  };

  const buttonState = getButtonState();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className={`p-8 relative rounded-t-2xl bg-gradient-to-br ${color.gradient} text-white`}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-light">&times;</button>
          <div className="flex items-center gap-4">
            <div className="bg-white/30 p-3 rounded-2xl">
                <span className="text-5xl">{habitGroup.emoji}</span>
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{habitGroup.name}</h2>
                    {habitGroup.isPrivate && <Icon name="lock" className="w-5 h-5 text-white/80" />}
                </div>
                <div className="flex items-center gap-1.5 text-sm opacity-90 mt-1">
                    <span>{habitGroup.tag.emoji}</span>
                    <span>{habitGroup.tag.text}</span>
                </div>
            </div>
          </div>
        </div>

        <div className="p-8">
            <p className="text-slate-600 dark:text-slate-300 mb-6">{habitGroup.description}</p>
            
            <div>
                <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">{habitGroup.memberCount} / 20 {t.members}</h3>
                <div className="flex items-center -space-x-2">
                    {habitGroup.members.slice(0, 5).map(member => (
                        <Avatar key={member.id} user={member} className="w-10 h-10 border-2 border-white dark:border-slate-800" />
                    ))}
                    {habitGroup.memberCount > 5 && (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 border-2 border-white dark:border-slate-800">
                            +{habitGroup.memberCount - 5}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={onJoin}
                disabled={buttonState.disabled}
                className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg transition-colors shadow-lg ${buttonState.className} disabled:cursor-not-allowed`}
              >
                {buttonState.text}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}