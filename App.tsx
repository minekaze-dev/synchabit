
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Header';
import Feed from './components/Feed';
import Profile from './components/Dashboard';
import { Post, Habit, User, HabitGroup, HabitLog, Conversation, Notification, Comment } from './types';
import AddHabitModal from './components/AddHabitModal';
import { translations, Language } from './translations';
import Settings from './components/Settings';
import Avatar from './components/Avatar';
import HabitGroupFeed from './components/HabitGroupFeed';
import AddHabitGroupModal from './components/AddHabitGroupModal';
import Messages from './components/Messages';
import HabitLogModal from './components/HabitLogModal';
import AddHabitLogModal from './components/AddHabitLogModal';
import Icon from './components/Icon';
import NotificationDropdown from './components/NotificationDropdown';
import HabitGroupManagementModal from './components/HabitGroupManagementModal';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import ConfirmationModal from './components/ConfirmationModal';
import { HABIT_CATEGORIES } from './constants';

export type View = 'feed' | 'profile' | 'settings' | 'messages';
export type Theme = 'light' | 'dark';

interface JoinRequest {
    userId: string;
    habitGroupId: string;
}

type AuthModalState = {
  isOpen: boolean;
  mode: 'login' | 'register' | 'forgot';
}

// Helper to map Supabase user profile to our User type
const mapProfileToUser = (profile: any): User | null => {
    if (!profile) return null;
    return {
        id: profile.id,
        name: profile.name,
        avatarUrl: profile.avatar_url,
        bio: profile.bio,
        memberSince: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
};

const TopBar: React.FC<{ 
  user: User, 
  t: any, 
  currentView: View, 
  setCurrentView: (view: View, user?: User) => void,
  viewingUser: User | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  unreadNotificationCount: number;
  onToggleNotifications: () => void;
}> = ({ user, t, currentView, setCurrentView, viewingUser, searchQuery, setSearchQuery, unreadNotificationCount, onToggleNotifications }) => {
  
  const handleProfileClick = () => {
    setCurrentView('profile', user);
  };

  return (
    <header className="flex-shrink-0 bg-white dark:bg-slate-900 h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-6">
        <div className="relative w-full max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-transparent rounded-lg w-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-400 dark:text-slate-200 dark:placeholder:text-slate-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setCurrentView('settings')}
          className={`text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white relative p-2 rounded-full flex items-center justify-center ${currentView === 'settings' ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          aria-label={t.settings}
        >
          <Icon name="settings" className="w-6 h-6" />
        </button>
        <button onClick={onToggleNotifications} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <Icon name="bell" className="w-6 h-6" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </button>
        <button 
          onClick={handleProfileClick} 
          className={`flex items-center gap-2 p-1 rounded-lg transition-colors ${
            currentView === 'profile' && viewingUser?.id === user.id ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          aria-label={t.profile}
        >
            <Avatar user={user} className="w-9 h-9" />
            <div className="text-sm font-semibold hidden sm:block">{user.name}</div>
        </button>
      </div>
    </header>
  );
};


export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentView, setView] = useState<View>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [habitGroups, setHabitGroups] = useState<HabitGroup[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  
  const [selectedHabitGroupId, setSelectedHabitGroupId] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  
  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);
  const [isAddHabitGroupModalOpen, setIsAddHabitGroupModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [managingHabitGroup, setManagingHabitGroup] = useState<HabitGroup | null>(null);
  
  const [isHabitLogDetailModalOpen, setIsHabitLogDetailModalOpen] = useState(false);
  const [selectedHabitLog, setSelectedHabitLog] = useState<HabitLog | null>(null);

  const [isAddHabitLogModalOpen, setIsAddHabitLogModalOpen] = useState(false);
  const [habitLogContext, setHabitLogContext] = useState<{ habitId: string; date: Date } | null>(null);
  
  const [language, setLanguage] = useState<Language>('id');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [initialMessageId, setInitialMessageId] = useState<string | null>(null);
  
  const [newHabitGroupIds, setNewHabitGroupIds] = useState<string[]>([]);

  const [authModal, setAuthModal] = useState<AuthModalState>({ isOpen: false, mode: 'login' });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  const [userStats, setUserStats] = useState({ 
    checkinConsistency: 0, 
    maxStreak: 0,
    totalConsistentDays: 0,
    totalCheers: 0,
    totalPushes: 0
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme as Theme;
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (!session) {
            setCurrentUser(null);
            // Clear all data
            setPosts([]);
            setHabits([]);
            setHabitLogs([]);
            setHabitGroups([]);
            setUserStats({ checkinConsistency: 0, maxStreak: 0, totalConsistentDays: 0, totalCheers: 0, totalPushes: 0 });
        }
        setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const calculateAndSetUserStats = useCallback((habitsWithLogs: any[], userInteractions: {cheers: number, pushes: number}) => {
      // 1. Calculate Check-in Consistency for the last 30 days
      const allLogs = habitsWithLogs.flatMap(h => h.habit_logs || []);
      let consistency = 0;
      if (allLogs.length > 0) {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const uniqueDaysInLast30 = new Set(
              allLogs
                  .map(log => new Date(log.date))
                  .filter(date => date >= thirtyDaysAgo)
                  .map(date => date.toISOString().split('T')[0])
          ).size;
          consistency = Math.round((uniqueDaysInLast30 / 30) * 100);
      }

      // 2. Calculate Max Streak
      let maxStreak = 0;
      for (const habit of habitsWithLogs) {
          const logs = habit.habit_logs || [];
          if (logs.length === 0) continue;

          const logDates = new Set(logs.map((log: any) => log.date));
          let currentStreak = 0;
          
          const sortedDates = Array.from(logDates).sort((a, b) => new Date(b as string).getTime() - new Date(a as string).getTime());
          
          const today = new Date();
          today.setHours(0,0,0,0);
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          const latestLogDate = new Date(sortedDates[0] as string);
          latestLogDate.setHours(0,0,0,0);
          
          if (latestLogDate.getTime() === today.getTime() || latestLogDate.getTime() === yesterday.getTime()) {
              currentStreak = 1;
              let lastDate = latestLogDate;
              for (let i = 1; i < sortedDates.length; i++) {
                  const currentDate = new Date(sortedDates[i] as string);
                  currentDate.setHours(0,0,0,0);
                  const expectedPreviousDate = new Date(lastDate);
                  expectedPreviousDate.setDate(expectedPreviousDate.getDate() - 1);
                  
                  if (currentDate.getTime() === expectedPreviousDate.getTime()) {
                      currentStreak++;
                      lastDate = currentDate;
                  } else {
                      break;
                  }
              }
          }
          if (currentStreak > maxStreak) {
              maxStreak = currentStreak;
          }
      }
      
      // 3. Calculate Total Consistent Days
      const totalConsistentDays = new Set(allLogs.map(log => log.date)).size;

      setUserStats({ 
        checkinConsistency: consistency, 
        maxStreak,
        totalConsistentDays: totalConsistentDays,
        totalCheers: userInteractions.cheers,
        totalPushes: userInteractions.pushes
      });
  }, []);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;

    // Fetch personal habits with their logs
    const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*, habit_logs(*)')
        .eq('user_id', currentUser.id);

    let userInteractions = { cheers: 0, pushes: 0 };
    // Fetch user's posts to calculate interactions received
    const { data: userPosts, error: postsError } = await supabase
        .from('posts')
        .select('id')
        .eq('user_id', currentUser.id);

    if (userPosts && userPosts.length > 0) {
        const postIds = userPosts.map(p => p.id);
        const { data: interactions, error: interactionsError } = await supabase
            .from('post_interactions')
            .select('type')
            .in('post_id', postIds);
        
        if (interactions) {
            userInteractions.cheers = interactions.filter(i => i.type === 'support').length;
            userInteractions.pushes = interactions.filter(i => i.type === 'push').length;
        }
    }
    

    if (habitsData) {
        calculateAndSetUserStats(habitsData, userInteractions);
        const mappedHabits: Habit[] = habitsData.map((h: any) => ({
            id: h.id,
            name: h.name,
            icon: h.icon,
            frequency: h.frequency,
            color: h.color,
            streak: 0, // This is calculated in stats now
        }));
        setHabits(mappedHabits);

        const allLogs = habitsData.flatMap((h: any) => h.habit_logs.map((l: any): HabitLog => ({
            id: l.id,
            habitId: l.habit_id,
            date: l.date,
            note: l.note,
        })));
        setHabitLogs(allLogs);
    } else {
        calculateAndSetUserStats([], userInteractions);
        setHabits([]);
        setHabitLogs([]);
    }
    
    // Fetch habit groups
    const { data: groupsData, error: groupsError } = await supabase
        .from('habit_groups')
        .select('*, creator:profiles(*), members:habit_group_members(profiles(*))');

    if (groupsData) {
        // FIX: Explicitly type the return value of the map function and ensure the returned object conforms to the HabitGroup type.
        const mappedGroups: HabitGroup[] = groupsData.map((g: any): HabitGroup | null => {
             const members = g.members.map((m: any) => mapProfileToUser(m.profiles)).filter(Boolean) as User[];
             const creator = mapProfileToUser(g.creator);
             
             if (!creator) return null;

             const category = HABIT_CATEGORIES.find(cat => cat.emoji === g.emoji);
             const tagName = category ? translations[language][category.translationKey] : 'General';

             return {
                id: g.id,
                name: g.name,
                emoji: g.emoji,
                description: g.description,
                isPrivate: g.is_private,
                coverImageUrl: g.cover_image_url || undefined,
                creator: creator,
                members: members,
                memberCount: members.length,
                tag: {
                    emoji: g.emoji,
                    text: tagName
                }
             };
        }).filter((g): g is HabitGroup => g !== null);
        setHabitGroups(mappedGroups);
    }

  }, [currentUser, language, calculateAndSetUserStats]);

  // Fetch user profile and data after session is set
  useEffect(() => {
    if (session && !currentUser) {
      setLoading(true);
      supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({data, error}) => {
          if (data) {
              const userProfile = mapProfileToUser(data);
              if(userProfile) setCurrentUser(userProfile);
          }
          if (error) console.error("Error fetching profile:", error);
          setLoading(false);
      });
    } else if (currentUser) {
        fetchData();
    }
  }, [session, currentUser, fetchData]);


  const [hasUnreadMessages, setHasUnreadMessages] = useState(false); // Placeholder

  const t = translations[language];
  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;
  
  const myHabitGroupIds: string[] = currentUser ? habitGroups.filter(hg => hg.members.some(m => m.id === currentUser.id)).map(hg => hg.id) : []; 
  const pendingJoinRequestIds: string[] = [];

  const handleLogin = async (email: string, pass: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      return error.message;
    }
    setAuthModal({ isOpen: false, mode: 'login' });
    return null;
  };
  
  const handleRegister = async (fullName: string, email: string, pass: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({ 
        email, 
        password: pass,
        options: {
            data: {
                full_name: fullName,
                avatar_url: `https://i.pravatar.cc/150?u=${email}`
            }
        }
    });
     if (error) {
      return error.message;
    }
    setAuthModal({ isOpen: false, mode: 'register'});
    setShowConfirmationModal(true);
    return null;
  };

  const handleForgotPassword = async (email: string): Promise<string | null> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
    });
    if (error) {
        return error.message;
    }
    alert('Password reset link sent! Please check your email.');
    setAuthModal({isOpen: false, mode: 'forgot'});
    return null;
  };


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
  };

  const setCurrentView = (view: View, user: User | null = null) => {
    setView(view);
    if (view === 'profile' && user) {
        setViewingUser(user);
    } else {
        setViewingUser(null);
    }
     if (view !== 'feed') {
        setSelectedHabitGroupId(null);
    }
    if (view === 'messages') {
        setHasUnreadMessages(false);
    }
  };
  
  const handleToggleNotifications = () => {
      setIsNotificationOpen(prev => !prev);
      if (!isNotificationOpen) {
          setTimeout(() => {
            setNotifications(prev => prev.map(n => ({...n, isRead: true})));
          }, 1000);
      }
  };
  
  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notification.id ? {...n, isRead: true} : n));
    setIsNotificationOpen(false);

    if (notification.target.type === 'post') {
        setSelectedHabitGroupId(notification.target.habitGroupId || null);
        setView('feed');
        setViewingUser(null);
    } else if (notification.target.type === 'chat') {
        setInitialMessageId(notification.target.id);
        setView('messages');
        setViewingUser(null);
    }
  };

  const handleAddHabit = async (newHabit: Omit<Habit, 'id' | 'streak'>) => {
    if (!currentUser) return;
    const colors = ['purple', 'green', 'blue', 'pink'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: currentUser.id,
        name: newHabit.name,
        icon: newHabit.icon,
        frequency: newHabit.frequency,
        color: randomColor,
      })
      .select()
      .single();

    if (data) {
        const addedHabit: Habit = {
            id: data.id,
            name: data.name,
            icon: data.icon,
            frequency: data.frequency,
            color: data.color,
            streak: 0,
        };
        setHabits(prev => [...prev, addedHabit]);
    }
    if (error) console.error("Error adding habit:", error);
    setIsAddHabitModalOpen(false);
  };
  
  const handleAddHabitGroup = async (data: { name: string, description: string, category: string, rules: string, isPrivate: boolean, coverImageUrl?: string }) => {
    if (!currentUser) return;
    const categoryInfo = HABIT_CATEGORIES.find(c => c.id === data.category);
    if (!categoryInfo) return;

    const fullDescription = data.rules ? `${data.description}\n\n**Rules:**\n${data.rules}` : data.description;
    
    const { data: newGroupData, error } = await supabase
        .from('habit_groups')
        .insert({
            name: data.name,
            description: fullDescription,
            emoji: categoryInfo.emoji,
            is_private: data.isPrivate,
            cover_image_url: data.coverImageUrl,
            creator_id: currentUser.id
        })
        .select()
        .single();
    
    if (error) {
      console.error("Error adding habit group:", error);
    } else if (newGroupData) {
      // Optimistically update UI for instant feedback, then refetch to ensure consistency.
      const creator = currentUser;
      const category = HABIT_CATEGORIES.find(cat => cat.emoji === newGroupData.emoji);
      const tagName = category ? translations[language][category.translationKey] : 'General';

      const newHabitGroup: HabitGroup = {
          id: newGroupData.id,
          name: newGroupData.name,
          emoji: newGroupData.emoji,
          description: newGroupData.description,
          isPrivate: newGroupData.is_private,
          coverImageUrl: newGroupData.cover_image_url || undefined,
          creator: creator,
          members: [creator],
          memberCount: 1,
          tag: {
              emoji: newGroupData.emoji,
              text: tagName
          }
      };
      setHabitGroups(prev => [...prev, newHabitGroup]);
      
      // Fetch data in the background to sync with the database source of truth
      fetchData();
    }

    setIsAddHabitGroupModalOpen(false);
  };

  const handleAddPost = (habitGroupId: string, note: string, imageUrl?: string) => {
    // Supabase logic here
  };
  
  const handlePostInteraction = (postId: string, interactionType: 'support' | 'push') => {
    // Supabase logic here
  };
  
  const handleAddComment = (postId: string, commentText: string) => {
    // Supabase logic here
  };

  const handleJoinHabitGroup = (habitGroupId: string) => {
    // Supabase logic here
  };
  
  const handleRequestToJoinHabitGroup = (habitGroupId: string) => {
    // Supabase logic here
  };
  
  const handleJoinRequestResponse = (notification: Notification, accept: boolean) => {
    // Supabase logic here
  };

  const handleUpdateHabitGroup = (habitGroupId: string, updates: Partial<HabitGroup>) => {
    setHabitGroups(prev => prev.map(h => h.id === habitGroupId ? {...h, ...updates} : h));
    setManagingHabitGroup(prev => prev ? {...prev, ...updates} : null);
  };

  const handleDeleteHabitGroup = async (habitGroupId: string) => {
    if (!currentUser) return;
    const { error } = await supabase
        .from('habit_groups')
        .delete()
        .eq('id', habitGroupId);

    if (error) {
        console.error("Error deleting habit group:", error);
    } else {
        await fetchData();
        if (selectedHabitGroupId === habitGroupId) {
            setSelectedHabitGroupId(null);
        }
    }
    setIsManagementModalOpen(false);
    setManagingHabitGroup(null);
  };

  const handleRemoveMember = (habitGroupId: string, memberId: string) => {
    // Supabase logic here
  };

  const handleOpenHabitLogDetail = (log: HabitLog) => {
    setSelectedHabitLog(log);
    setIsHabitLogDetailModalOpen(true);
  };
  
  const handleOpenAddHabitLog = (habitId: string, date: Date) => {
    setHabitLogContext({ habitId, date });
    setIsAddHabitLogModalOpen(true);
  };

  const handleAddHabitLog = async (note: string) => {
    if (!currentUser || !habitLogContext) return;

    const dateString = habitLogContext.date.toISOString().split('T')[0];

    const { error } = await supabase
      .from('habit_logs')
      .insert({
        habit_id: habitLogContext.habitId,
        date: dateString,
        note: note
      });

    if (error) {
        console.error("Error adding habit log:", error);
    } else {
        await fetchData();
    }
    
    setIsAddHabitLogModalOpen(false);
    setHabitLogContext(null);
  };
  
  const handleEditHabitLog = async (logId: string, newNote: string) => {
    const { data, error } = await supabase
        .from('habit_logs')
        .update({ note: newNote })
        .eq('id', logId)
        .select()
        .single();
    
    if (error) {
        console.error("Error editing habit log:", error);
    } else if (data) {
        setHabitLogs(prev => prev.map(log => log.id === logId ? { ...log, note: data.note } : log));
    }
    setIsHabitLogDetailModalOpen(false);
  };

  const handleUpdateAvatar = async (newAvatarUrl: string) => {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url: newAvatarUrl })
      .eq('id', currentUser.id)
      .select()
      .single();
    
    if (data) {
        setCurrentUser(prev => prev ? { ...prev, avatarUrl: data.avatar_url } : null);
        if (viewingUser?.id === currentUser.id) {
            setViewingUser(prev => prev ? { ...prev, avatarUrl: data.avatar_url } : null);
        }
    }
    if (error) console.error("Error updating avatar:", error);
  };
  
  const handleUpdateUserName = async (newName: string) => {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from('profiles')
      .update({ name: newName })
      .eq('id', currentUser.id)
      .select()
      .single();
      
    if (data) {
        setCurrentUser(prev => prev ? { ...prev, name: data.name } : null);
        if (viewingUser?.id === currentUser.id) {
            setViewingUser(prev => prev ? { ...prev, name: data.name } : null);
        }
    }
    if (error) console.error("Error updating name:", error);
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!currentUser) return;
    if (window.confirm(t.deleteHabitConfirmation)) {
        const { error } = await supabase
            .from('habits')
            .delete()
            .eq('id', habitId);
        
        if (error) {
            console.error("Error deleting habit:", error);
        } else {
            await fetchData();
        }
    }
  };

  const handleDeleteHabitLog = async (logId: string) => {
    if (window.confirm(t.deleteHabitLogConfirmation)) {
        const { error } = await supabase
            .from('habit_logs')
            .delete()
            .eq('id', logId);
        
        if (error) {
            console.error("Error deleting habit log:", error);
        } else {
            await fetchData();
        }
    }
  };
  
  const handleClearNewHabitGroupNotifications = () => {
    setNewHabitGroupIds([]);
  };

  const renderContent = () => {
    if (viewingUser && currentUser) {
        return <Profile 
                  currentUser={currentUser}
                  viewingUser={viewingUser} 
                  habits={habits} 
                  habitLogs={habitLogs}
                  t={t} 
                  onOpenAddHabitModal={() => setIsAddHabitModalOpen(true)}
                  onOpenHabitLogDetail={handleOpenHabitLogDetail}
                  onOpenAddHabitLog={handleOpenAddHabitLog}
                  onStartConversation={(user: User) => setCurrentView('messages')}
                  onUpdateAvatar={handleUpdateAvatar}
                  onUpdateName={handleUpdateUserName}
                  onDeleteHabit={handleDeleteHabit}
                  onDeleteHabitLog={handleDeleteHabitLog}
                  userStats={userStats}
               />;
    }
    if (!currentUser) return null; // Or a loading spinner

    switch (currentView) {
      case 'messages':
        return <Messages conversations={conversations} currentUser={currentUser} t={t} onViewUser={(user) => setCurrentView('profile', user)} initialSelectedConversationId={initialMessageId} />;
      case 'settings':
        return <Settings language={language} setLanguage={setLanguage} t={t} onLogout={handleLogout} theme={theme} setTheme={setTheme} />;
      case 'feed':
      default:
        const selectedHabitGroup = habitGroups.find(h => h.id === selectedHabitGroupId);
        if (selectedHabitGroup) {
          const habitGroupPosts = posts.filter(p => p.habitGroupId === selectedHabitGroupId);
          return <HabitGroupFeed habitGroup={selectedHabitGroup} posts={habitGroupPosts} onAddPost={handleAddPost} t={t} onViewUser={(user) => setCurrentView('profile', user)} currentUser={currentUser} onOpenManagementModal={(habitGroup) => { setManagingHabitGroup(habitGroup); setIsManagementModalOpen(true); }} onPostInteraction={handlePostInteraction} onAddComment={handleAddComment} />;
        }
        const filteredHabitGroups = habitGroups.filter(habitGroup => 
            habitGroup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            habitGroup.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return <Feed habitGroups={filteredHabitGroups} t={t} currentUser={currentUser} onJoinHabitGroup={handleJoinHabitGroup} onRequestToJoinHabitGroup={handleRequestToJoinHabitGroup} myHabitGroupIds={myHabitGroupIds} pendingJoinRequestIds={pendingJoinRequestIds} />;
    }
  };
  
  const selectedHabit = habits.find(h => h.id === selectedHabitLog?.habitId);
  const habitForAddLog = habits.find(h => h.id === habitLogContext?.habitId);
  
  const isHabitGroupView = currentView === 'feed' && !!selectedHabitGroupId;
  const mainOverflowClass = isHabitGroupView ? 'overflow-hidden' : 'overflow-y-auto';
  
  if (loading) {
    return (
        <div className="min-h-screen font-sans flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
    );
  }

  if (!session) {
    return (
      <>
        <LandingPage 
          onShowLogin={() => setAuthModal({ isOpen: true, mode: 'login' })}
          onShowRegister={() => setAuthModal({ isOpen: true, mode: 'register' })}
          t={t}
          language={language}
          setLanguage={setLanguage}
        />
        <AuthModal 
          {...authModal}
          onClose={() => setAuthModal({ ...authModal, isOpen: false })}
          onSwitchMode={(mode) => setAuthModal({ isOpen: true, mode })}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onForgotPassword={handleForgotPassword}
          t={t}
        />
        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onGoToLogin={() => {
            setShowConfirmationModal(false);
            setAuthModal({ isOpen: true, mode: 'login'});
          }}
          t={t}
        />
      </>
    );
  }

  if (!currentUser) {
     return (
        <div className="min-h-screen font-sans flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <p className="text-slate-500 dark:text-slate-400">Loading user profile...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 flex items-center justify-center p-0 sm:p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full h-screen sm:h-[95vh] sm:max-w-7xl bg-slate-100 dark:bg-black sm:rounded-2xl flex overflow-hidden shadow-2xl">
        <Sidebar 
            currentView={currentView}
            setCurrentView={setCurrentView} 
            habitGroups={habitGroups.filter(hg => myHabitGroupIds.includes(hg.id))}
            onOpenAddHabitGroupModal={() => setIsAddHabitGroupModalOpen(true)}
            t={t}
            selectedHabitGroupId={selectedHabitGroupId}
            setSelectedHabitGroupId={setSelectedHabitGroupId}
            hasUnreadMessages={hasUnreadMessages}
            newHabitGroupIds={newHabitGroupIds}
            onClearNewHabitGroupNotifications={handleClearNewHabitGroupNotifications}
        />
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
            <TopBar 
              user={currentUser} 
              t={t} 
              currentView={currentView} 
              setCurrentView={setCurrentView} 
              viewingUser={viewingUser}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              unreadNotificationCount={unreadNotificationCount}
              onToggleNotifications={handleToggleNotifications}
            />
            {isNotificationOpen && (
                <NotificationDropdown 
                    notifications={notifications}
                    onNotificationClick={handleNotificationClick}
                    onClose={() => setIsNotificationOpen(false)}
                    onAcceptRequest={(n) => handleJoinRequestResponse(n, true)}
                    onDeclineRequest={(n) => handleJoinRequestResponse(n, false)}
                    t={t}
                />
            )}
            <main className={`flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 relative ${mainOverflowClass}`}>
               <div className={`flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 ${isHabitGroupView ? 'h-full' : ''}`}>
                 {renderContent()}
               </div>
            </main>
        </div>
      </div>
      <AddHabitModal isOpen={isAddHabitModalOpen} onClose={() => setIsAddHabitModalOpen(false)} onAddHabit={handleAddHabit} t={t} />
      <AddHabitGroupModal isOpen={isAddHabitGroupModalOpen} onClose={() => setIsAddHabitGroupModalOpen(false)} onAddHabitGroup={handleAddHabitGroup} t={t} />
       {managingHabitGroup && (
        <HabitGroupManagementModal
          isOpen={isManagementModalOpen}
          onClose={() => { setIsManagementModalOpen(false); setManagingHabitGroup(null); }}
          habitGroup={managingHabitGroup}
          onUpdateHabitGroup={handleUpdateHabitGroup}
          onDeleteHabitGroup={handleDeleteHabitGroup}
          onRemoveMember={handleRemoveMember}
          currentUser={currentUser}
          t={t}
          notifications={notifications}
          onJoinRequestResponse={handleJoinRequestResponse}
        />
      )}
      {selectedHabitLog && selectedHabit && (
        <HabitLogModal 
            isOpen={isHabitLogDetailModalOpen} 
            onClose={() => setIsHabitLogDetailModalOpen(false)}
            log={selectedHabitLog}
            habit={selectedHabit}
            t={t}
            onEditLog={handleEditHabitLog}
        />
      )}
      {habitLogContext && habitForAddLog && (
        <AddHabitLogModal
            isOpen={isAddHabitLogModalOpen}
            onClose={() => setIsAddHabitLogModalOpen(false)}
            onAddLog={handleAddHabitLog}
            habit={habitForAddLog}
            date={habitLogContext.date}
            t={t}
        />
      )}
    </div>
  );
}
