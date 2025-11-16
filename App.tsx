import React, { useState, useEffect } from 'react';
import Sidebar from './components/Header';
import Feed from './components/Feed';
import Profile from './components/Dashboard';
import { Post, Habit, User, Badge, Challenge, HabitGroup, HabitLog, Conversation, Notification, Comment } from './types';
import { INITIAL_POSTS, INITIAL_HABITS, CURRENT_USER as INITIAL_CURRENT_USER, BADGES, CHALLENGES, HABIT_GROUPS, HABIT_LOGS, CONVERSATIONS, INITIAL_NOTIFICATIONS, DUMMY_USER } from './constants';
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
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_CURRENT_USER);
  const [currentView, setView] = useState<View>('feed');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>(HABIT_LOGS);
  const [habitGroups, setHabitGroups] = useState<HabitGroup[]>(HABIT_GROUPS);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
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
  const [habitLogContext, setHabitLogContext] = useState<{ habitId: string; date: number } | null>(null);
  
  const [language, setLanguage] = useState<Language>('id');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [initialMessageId, setInitialMessageId] = useState<string | null>(null);
  
  const [newHabitGroupIds, setNewHabitGroupIds] = useState<string[]>([]);

  const [authModal, setAuthModal] = useState<AuthModalState>({ isOpen: false, mode: 'login' });
  
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

  const [hasUnreadMessages, setHasUnreadMessages] = useState(() => {
    return CONVERSATIONS.some(conv => {
        if (conv.messages.length === 0) return false;
        const lastMessage = conv.messages[conv.messages.length - 1];
        return lastMessage.senderId !== INITIAL_CURRENT_USER.id;
    });
  });

  const t = translations[language];
  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;
  const myHabitGroupIds = habitGroups.filter(h => h.members.some(m => m.id === currentUser.id) || h.creator.id === currentUser.id).map(h => h.id);
  const pendingJoinRequestIds = joinRequests.filter(r => r.userId === currentUser.id).map(r => r.habitGroupId);

  const handleLogin = (email: string, pass: string): boolean => {
    if (email === DUMMY_USER.email && pass === DUMMY_USER.password) {
      setAuthUser(DUMMY_USER.user);
      setCurrentUser(DUMMY_USER.user);
      setAuthModal({ isOpen: false, mode: 'login' });
      return true;
    }
    alert("Invalid credentials!");
    return false;
  };

  const handleLogout = () => {
    setAuthUser(null);
  };

  const setCurrentView = (view: View, user: User | null = null) => {
    setView(view);
    if (view === 'profile') {
        setViewingUser(user || currentUser);
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

  const handleAddHabit = (newHabit: Omit<Habit, 'id' | 'streak'>) => {
    const habitToAdd: Habit = {
      ...newHabit,
      id: `habit-${Date.now()}`,
      streak: 0,
      color: ['purple', 'green', 'blue', 'pink'][Math.floor(Math.random() * 4)],
    };
    setHabits(prev => [habitToAdd, ...prev]);
    setIsAddHabitModalOpen(false);
  };
  
  const handleAddHabitGroup = (data: { name: string, description: string, category: string, rules: string, isPrivate: boolean, coverImageUrl?: string }) => {
    const newHabitGroup: HabitGroup = {
        id: `huddle-${Date.now()}`,
        name: data.name,
        emoji: '🆕',
        description: data.description,
        memberCount: 1,
        members: [],
        tag: { emoji: '🏷️', text: data.category },
        color: ['teal', 'purple', 'blue', 'green', 'yellow', 'pink'][Math.floor(Math.random() * 6)],
        creator: currentUser,
        isPrivate: data.isPrivate,
        coverImageUrl: data.coverImageUrl,
    };
    setHabitGroups(prev => [newHabitGroup, ...prev]);
    setNewHabitGroupIds(prev => [...prev, newHabitGroup.id]);
    setIsAddHabitGroupModalOpen(false);
  };

  const handleAddPost = (habitGroupId: string, note: string, imageUrl?: string) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      user: currentUser,
      habitGroupId,
      timestamp: new Date(),
      note,
      imageUrl,
      supports: 0,
      supportedBy: [],
      pushes: 0,
      pushedBy: [],
      comments: [],
      streak: Math.floor(Math.random() * 20) + 1,
    };
    setPosts(prev => [newPost, ...prev]);
  };
  
  const handlePostInteraction = (postId: string, interactionType: 'support' | 'push') => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const newPost = { ...post };
        const userId = currentUser.id;
        
        newPost.supportedBy = [...(newPost.supportedBy || [])];
        newPost.pushedBy = [...(newPost.pushedBy || [])];
        
        const hasSupported = newPost.supportedBy.includes(userId);
        const hasPushed = newPost.pushedBy.includes(userId);

        if (interactionType === 'support') {
          if (hasSupported) {
            newPost.supports--;
            newPost.supportedBy = newPost.supportedBy.filter(id => id !== userId);
          } else {
            newPost.supports++;
            newPost.supportedBy.push(userId);
            if (hasPushed) {
              newPost.pushes--;
              newPost.pushedBy = newPost.pushedBy.filter(id => id !== userId);
            }
          }
        } else if (interactionType === 'push') {
          if (hasPushed) {
            newPost.pushes--;
            newPost.pushedBy = newPost.pushedBy.filter(id => id !== userId);
          } else {
            newPost.pushes++;
            newPost.pushedBy.push(userId);
            if (hasSupported) {
              newPost.supports--;
              newPost.supportedBy = newPost.supportedBy.filter(id => id !== userId);
            }
          }
        }
        return newPost;
      }
      return post;
    }));
  };
  
  const handleAddComment = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      user: currentUser,
      text: commentText.trim(),
      timestamp: new Date(),
    };
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    ));
  };

  const handleJoinHabitGroup = (habitGroupId: string) => {
    setHabitGroups(habitGroups.map(h => h.id === habitGroupId ? { ...h, members: [...h.members, currentUser], memberCount: h.memberCount + 1 } : h));
  };
  
  const handleRequestToJoinHabitGroup = (habitGroupId: string) => {
    const habitGroup = habitGroups.find(h => h.id === habitGroupId);
    if (!habitGroup) return;
    setJoinRequests(prev => [...prev, { userId: currentUser.id, habitGroupId }]);
    
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'join_request',
      actor: currentUser,
      timestamp: new Date(),
      isRead: false,
      target: { type: 'habit_group', id: habitGroupId }
    };
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  const handleJoinRequestResponse = (notification: Notification, accept: boolean) => {
    if (accept) {
        const habitGroupId = notification.target.id;
        setHabitGroups(prev => prev.map(h => h.id === habitGroupId ? { ...h, members: [...h.members, notification.actor], memberCount: h.memberCount + 1 } : h));
    }
    setJoinRequests(prev => prev.filter(r => !(r.userId === notification.actor.id && r.habitGroupId === notification.target.id)));
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
  };

  const handleUpdateHabitGroup = (habitGroupId: string, updates: Partial<HabitGroup>) => {
    setHabitGroups(prev => prev.map(h => h.id === habitGroupId ? {...h, ...updates} : h));
    setManagingHabitGroup(prev => prev ? {...prev, ...updates} : null);
  };

  const handleDeleteHabitGroup = (habitGroupId: string) => {
    setHabitGroups(prev => prev.filter(h => h.id !== habitGroupId));
    if (selectedHabitGroupId === habitGroupId) {
        setSelectedHabitGroupId(null);
        setView('feed');
    }
    setIsManagementModalOpen(false);
    setManagingHabitGroup(null);
  };

  const handleRemoveMember = (habitGroupId: string, memberId: string) => {
    setHabitGroups(prev => prev.map(h => {
        if (h.id === habitGroupId) {
            return {
                ...h,
                members: h.members.filter(m => m.id !== memberId),
                memberCount: h.memberCount -1,
            };
        }
        return h;
    }));
  };

  const handleOpenHabitLogDetail = (log: HabitLog) => {
    setSelectedHabitLog(log);
    setIsHabitLogDetailModalOpen(true);
  };
  
  const handleOpenAddHabitLog = (habitId: string, date: number) => {
    setHabitLogContext({ habitId, date });
    setIsAddHabitLogModalOpen(true);
  };

  const handleAddHabitLog = (note: string) => {
    if (!habitLogContext) return;
    const newLog: HabitLog = {
      id: `log-${Date.now()}`,
      habitId: habitLogContext.habitId,
      date: habitLogContext.date,
      note,
    };
    setHabitLogs(prev => [...prev, newLog]);
    setIsAddHabitLogModalOpen(false);
    setHabitLogContext(null);
  };
  
  const handleEditHabitLog = (logId: string, newNote: string) => {
    setHabitLogs(prevLogs => 
      prevLogs.map(log => 
        log.id === logId ? { ...log, note: newNote } : log
      )
    );
    setIsHabitLogDetailModalOpen(false);
  };

  const handleUpdateAvatar = (newAvatarUrl: string) => {
    setCurrentUser(prevUser => ({ ...prevUser, avatarUrl: newAvatarUrl }));
    setViewingUser(prevUser => (prevUser?.id === currentUser.id ? { ...prevUser, avatarUrl: newAvatarUrl } : prevUser));
  };
  
  const handleUpdateUserName = (newName: string) => {
    setCurrentUser(prev => ({...prev, name: newName }));
    setViewingUser(prev => (prev?.id === currentUser.id ? {...prev, name: newName} : prev));
  };

  const handleDeleteHabit = (habitId: string) => {
    if (window.confirm(t.deleteHabitConfirmation)) {
      setHabits(prev => prev.filter(h => h.id !== habitId));
      setHabitLogs(prev => prev.filter(l => l.habitId !== habitId));
    }
  };

  const handleDeleteHabitLog = (logId: string) => {
    if (window.confirm(t.deleteHabitLogConfirmation)) {
      setHabitLogs(prev => prev.filter(l => l.id !== logId));
    }
  };
  
  const handleClearNewHabitGroupNotifications = () => {
    setNewHabitGroupIds([]);
  };

  const renderContent = () => {
    if (viewingUser) {
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
               />;
    }

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
  
  if (!authUser) {
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
          t={t}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 flex items-center justify-center p-0 sm:p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full h-screen sm:h-[95vh] sm:max-w-7xl bg-slate-100 dark:bg-black sm:rounded-2xl flex overflow-hidden shadow-2xl">
        <Sidebar 
            currentView={currentView}
            setCurrentView={setCurrentView} 
            habitGroups={habitGroups}
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