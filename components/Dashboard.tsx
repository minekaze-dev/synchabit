import React, { useState } from 'react';
import { User, Habit, StreakAchievement, HabitLog } from '../types';
import Avatar from './Avatar';
import Icon from './Icon';

interface ProfileProps {
  currentUser: User;
  viewingUser: User;
  habits: Habit[];
  habitLogs: HabitLog[];
  t: any;
  onOpenAddHabitModal: () => void;
  onOpenHabitLogDetail: (log: HabitLog) => void;
  onOpenAddHabitLog: (habitId: string, date: number) => void;
  onStartConversation: (user: User) => void;
  onUpdateAvatar: (newUrl: string) => void;
  onUpdateName: (newName: string) => void;
  onDeleteHabit: (habitId: string) => void;
  onDeleteHabitLog: (logId: string) => void;
}

const ProgressCard: React.FC<{ 
    currentUser: User; 
    viewingUser: User; 
    t: any; 
    onStartConversation: (user: User) => void;
    onUpdateAvatar: (newUrl: string) => void;
    onUpdateName: (newName: string) => void;
}> = ({ currentUser, viewingUser, t, onStartConversation, onUpdateAvatar, onUpdateName }) => {
    const isOwnProfile = currentUser.id === viewingUser.id;
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(viewingUser.name);

    const handleAvatarClick = () => {
        if (isOwnProfile) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    onUpdateAvatar(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedName(e.target.value);
    };

    const handleNameSave = () => {
        if (editedName.trim() && editedName !== viewingUser.name) {
            onUpdateName(editedName.trim());
        }
        setIsEditingName(false);
    };
    
    const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleNameSave();
        } else if (e.key === 'Escape') {
            setEditedName(viewingUser.name);
            setIsEditingName(false);
        }
    };

    return (
    <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{isOwnProfile ? t.myProgress : `${viewingUser.name}'s Progress`}</h2>
        <div className="bg-white dark:bg-slate-900/70 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
                 <div className="flex items-center gap-6">
                    <div className="relative group flex-shrink-0">
                        <button onClick={handleAvatarClick} disabled={!isOwnProfile} className="rounded-full disabled:cursor-default focus:outline-none focus:ring-4 focus:ring-brand-teal-300">
                            <Avatar user={viewingUser} className="w-24 h-24 border-4 border-slate-200 dark:border-slate-700" />
                             {isOwnProfile && (
                                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-label="Change profile picture">
                                    <Icon name="camera" className="w-8 h-8"/>
                                </div>
                             )}
                        </button>
                         {isOwnProfile && (
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/gif"
                            />
                         )}
                    </div>
                    <div className="pt-2">
                        {isEditingName ? (
                            <input
                                type="text"
                                value={editedName}
                                onChange={handleNameChange}
                                onBlur={handleNameSave}
                                onKeyDown={handleNameKeyDown}
                                className="text-2xl font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border border-brand-teal-400 rounded-lg px-2 py-1 -ml-2 focus:outline-none"
                                autoFocus
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{viewingUser.name}</h2>
                                {isOwnProfile && (
                                    <button onClick={() => setIsEditingName(true)} className="text-slate-400 hover:text-brand-teal-500 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <Icon name="pencil" className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="mt-4 flex justify-start items-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
                            <span>{`41 ${t.totalConsistentDays}`}</span>
                            <span>{`15 ${t.cheers}`}</span>
                            <span>{`3 ${t.pushes}`}</span>
                        </div>
                    </div>
                </div>
                {!isOwnProfile && (
                    <button onClick={() => onStartConversation(viewingUser)} className="bg-brand-teal-500 hover:bg-brand-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow">
                        {t.message}
                    </button>
                )}
            </div>
        </div>
    </div>
)};

const HabitCalendar: React.FC<{ 
    habit: Habit; 
    logs: HabitLog[]; 
    onOpenHabitLogDetail: (log: HabitLog) => void; 
    onOpenAddHabitLog: (habitId: string, date: number) => void;
    onDeleteHabit: (habitId: string) => void;
    onDeleteHabitLog: (logId: string) => void;
    isOwnProfile: boolean;
}> = ({ habit, logs, onOpenHabitLogDetail, onOpenAddHabitLog, onDeleteHabit, onDeleteHabitLog, isOwnProfile }) => {
    const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const today = 14; 
    
    const calendarGrid = Array.from({ length: 35 }, (_, i) => {
        const day = i - 5;
        return day > 0 && day <= 30 ? day : null;
    });
    
    const colorClasses: { [key: string]: { bg: string, text: string, border: string, gradient: string, hover: string } } = {
        purple: { bg: 'bg-pink-200', text: 'text-pink-600', border: 'border-pink-500', gradient: 'from-purple-400 to-pink-400', hover: 'hover:bg-pink-300' },
        green: { bg: 'bg-green-200', text: 'text-green-600', border: 'border-green-500', gradient: 'from-green-400 to-teal-400', hover: 'hover:bg-green-300' },
        blue: { bg: 'bg-blue-200', text: 'text-blue-600', border: 'border-blue-500', gradient: 'from-blue-400 to-cyan-400', hover: 'hover:bg-blue-300' },
        pink: { bg: 'bg-rose-200', text: 'text-rose-600', border: 'border-rose-500', gradient: 'from-rose-400 to-red-400', hover: 'hover:bg-rose-300' },
    };
    
    const colors = colorClasses[habit.color || 'green'];

    const handleDateClick = (day: number) => {
        const logForDay = logs.find(log => log.habitId === habit.id && log.date === day);
        if (logForDay) {
            onOpenHabitLogDetail(logForDay);
        } else if (day <= today) {
            onOpenAddHabitLog(habit.id, day);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900/70 p-4 rounded-xl shadow-sm">
            <div className={`p-3 rounded-lg flex justify-between items-center bg-gradient-to-r ${colors.gradient}`}>
                <h3 className="font-bold text-white text-sm uppercase tracking-wide">{habit.name}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{habit.icon}</span>
                    {isOwnProfile && (
                        <button onClick={() => onDeleteHabit(habit.id)} className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Delete habit">
                            <Icon name="trash" className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center my-3 px-2">
                <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">{'<'}</button>
                <div className="font-bold text-slate-700 dark:text-slate-300">November 2025</div>
                <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">{'>'}</button>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center">
                {daysOfWeek.map(day => <div key={day} className="text-xs font-bold text-slate-400 dark:text-slate-500">{day}</div>)}
                {calendarGrid.map((day, i) => {
                    if (!day) return <div key={`empty-${i}`} />;
                    
                    const logForDay = logs.find(log => log.habitId === habit.id && log.date === day);
                    const isStreaked = !!logForDay;
                    const isToday = day === today;
                    const isPast = day < today;
                    const isClickable = isStreaked || (isPast && !isStreaked);

                    const dayClasses = `w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold mx-auto transition-colors
                        ${isToday ? `${colors.bg} ${colors.text} border-2 ${colors.border}` : ''}
                        ${!isToday && isStreaked ? `${colors.bg} ${colors.text}` : ''}
                        ${!isToday && !isStreaked ? 'text-slate-400 dark:text-slate-500' : ''}
                        ${isClickable ? `cursor-pointer ${isStreaked ? colors.hover : 'hover:bg-slate-100 dark:hover:bg-slate-800'}` : 'cursor-default'}
                    `;

                    return (
                        <div key={day} className="relative h-8 group" onClick={() => isClickable && handleDateClick(day)}>
                           <div className={dayClasses}>
                                {day}
                           </div>
                           {isOwnProfile && logForDay && (
                               <button 
                                   onClick={(e) => { 
                                       e.stopPropagation(); 
                                       onDeleteHabitLog(logForDay.id); 
                                   }} 
                                   className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all transform -translate-y-1 translate-x-1"
                                   aria-label="Delete log"
                               >
                                    <Icon name="trash" className="h-3 w-3" />
                               </button>
                           )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const InteractionStatsCard: React.FC<{t: any}> = ({t}) => {
    const percentage = 65;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
         <div className="bg-white dark:bg-slate-900/70 p-5 rounded-xl shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{t.interactionStats}</h3>
            <div className="flex items-center gap-4">
                 <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-slate-200 dark:text-slate-700" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="50" cy="50" />
                        <circle
                            className="text-brand-teal-500"
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="50"
                            cy="50"
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-base font-bold text-slate-800 dark:text-slate-200">{percentage}%</span>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{t.checkinConsistency}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.consistencyMessage}</p>
                </div>
            </div>
        </div>
    );
};

// FIX: The STREAK_ACHIEVEMENTS constant was previously imported but is not available in `constants.ts`.
// It's now defined locally within the component. This resolves the import error and allows for translation of achievement names using the `t` prop.
const AchievementsCard: React.FC<{t: any}> = ({t}) => {
    const STREAK_ACHIEVEMENTS: StreakAchievement[] = [
        { id: '1', name: t.streak30Days, days: 30, earned: true },
        { id: '2', name: t.streak120Days, days: 120, earned: true },
        { id: '3', name: t.streak180Days, days: 180, earned: false },
        { id: '4', name: t.streak365Days, days: 365, earned: false },
    ];
    return (
        <div className="bg-white dark:bg-slate-900/70 p-5 rounded-xl shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{t.badgesAndAchievements}</h3>
            <div className="space-y-3">
                {STREAK_ACHIEVEMENTS.map(ach => (
                    <div key={ach.id} className={`flex items-center p-3 rounded-lg ${ach.earned ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        <span className="text-2xl mr-3">{ach.earned ? '🏆' : '🔒'}</span>
                        <div className="flex-grow">
                            <p className={`font-bold ${ach.earned ? 'text-amber-800 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300'}`}>{ach.name}</p>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                                <div className="bg-amber-400 h-1.5 rounded-full" style={{width: ach.earned ? '100%' : '50%'}}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Profile: React.FC<ProfileProps> = ({
  currentUser,
  viewingUser,
  habits,
  habitLogs,
  t,
  onOpenAddHabitModal,
  onOpenHabitLogDetail,
  onOpenAddHabitLog,
  onStartConversation,
  onUpdateAvatar,
  onUpdateName,
  onDeleteHabit,
  onDeleteHabitLog,
}) => {
  const isOwnProfile = currentUser.id === viewingUser.id;
  const userHabits = isOwnProfile ? habits : habits.slice(0, 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <ProgressCard
          currentUser={currentUser}
          viewingUser={viewingUser}
          t={t}
          onStartConversation={onStartConversation}
          onUpdateAvatar={onUpdateAvatar}
          onUpdateName={onUpdateName}
        />

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t.habitStreaks}</h2>
            {isOwnProfile && (
                <button 
                  onClick={onOpenAddHabitModal} 
                  className="flex items-center gap-2 bg-brand-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-teal-600 transition-colors text-sm shadow">
                    <Icon name="plus" className="w-4 h-4" />
                    <span>{t.addHabitNote}</span>
                </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userHabits.map((habit) => (
              <HabitCalendar
                key={habit.id}
                habit={habit}
                logs={habitLogs.filter(l => l.habitId === habit.id)}
                onOpenHabitLogDetail={onOpenHabitLogDetail}
                onOpenAddHabitLog={onOpenAddHabitLog}
                onDeleteHabit={onDeleteHabit}
                onDeleteHabitLog={onDeleteHabitLog}
                isOwnProfile={isOwnProfile}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <InteractionStatsCard t={t} />
        <AchievementsCard t={t} />
      </div>
    </div>
  );
};

export default Profile;