

import { User, Habit, Post, Badge, Challenge, HabitFrequency, StreakAchievement, HabitGroup, Conversation, HabitLog, Notification } from './types';

export const CURRENT_USER: User = {
  id: 'user-3',
  name: 'Siti_H.D.',
  avatarUrl: 'https://i.pravatar.cc/150?u=siti_hd',
  memberSince: 'Jan 2023',
  bio: 'Consistency is key!'
};

export const DUMMY_USER = {
  email: 'test@example.com',
  password: 'password123',
  user: CURRENT_USER,
};

const USER_BUDI: User = {
  id: 'user-2',
  name: 'Budi',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  memberSince: 'Feb 2023',
  bio: 'Trying my best.'
};

const USER_YOU: User = {
    id: 'user-1',
    name: 'You',
    avatarUrl: 'https://i.pravatar.cc/150?u=current_user',
    memberSince: 'Mar 2023',
    bio: 'Just starting out.'
};

const USER_4: User = {
    id: 'user-4',
    name: 'Charlie',
    avatarUrl: 'https://picsum.photos/seed/charlie/100/100',
    memberSince: 'Apr 2023',
    bio: 'Building habits.'
};

const USER_TAYLOR: User = { 
    id: 'user-5', 
    name: 'Taylor S.', 
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', 
    memberSince: 'May 2023', 
    bio: 'Lover of books and running.' 
};
const USER_JAMES: User = { 
    id: 'user-6', 
    name: 'James B.', 
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', 
    memberSince: 'Jun 2023', 
    bio: 'Design enthusiast.' 
};
const USER_ANNA: User = { 
    id: 'user-7', 
    name: 'Anna K.', 
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', 
    memberSince: 'Jul 2023', 
    bio: 'Daily UI challenger.' 
};
const USER_EKA: User = { 
    id: 'user-8', 
    name: 'Eka P.', 
    avatarUrl: 'https://i.pravatar.cc/150?u=eka', 
    memberSince: 'Aug 2023', 
    bio: 'Speaking my mind.' 
};
const USER_FAJAR: User = { 
    id: 'user-9', 
    name: 'Fajar R.', 
    avatarUrl: 'https://i.pravatar.cc/150?u=fajar', 
    memberSince: 'Sep 2023', 
    bio: 'Coding and coffee.' 
};


export const INITIAL_HABITS: Habit[] = [
  { id: 'habit-1', name: 'Lari Pagi Rutin', icon: '🏃', frequency: HabitFrequency.DAILY, streak: 14, color: 'purple' },
  { id: 'habit-2', name: 'Belajar Bahasa Korea', icon: '📚', frequency: HabitFrequency.DAILY, streak: 14, color: 'green' },
  { id: 'habit-3', name: 'Membaca Buku Non-Fiksi', icon: '📚', frequency: HabitFrequency.DAILY, streak: 25 },
  { id: 'habit-4', name: 'Coding Challenge', icon: '</>', frequency: HabitFrequency.WEEKLY, streak: 14 },
];

export const HABIT_1_STREAK_DATES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
export const HABIT_2_STREAK_DATES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];


export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    user: USER_BUDI,
    habitGroupId: 'huddle-1',
    timestamp: new Date(new Date().setHours(8, 10, 0, 0)),
    note: "Selesai 3.5K hari ini! Lumayan pace menurun karena tanjakan 😡\n#RoadTo5K",
    supports: 12,
    supportedBy: [],
    pushes: 0,
    pushedBy: [],
    streak: 12,
    comments: [
        { user: CURRENT_USER, text: "Good job!", timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000) },
        { user: USER_TAYLOR, text: "Awesome!", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) }
    ],
  },
  {
    id: 'post-2',
    user: USER_TAYLOR,
    habitGroupId: 'huddle-1',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    note: "Pagi yang indah untuk berlari! ☀️",
    imageUrl: 'https://picsum.photos/seed/run/400/300',
    supports: 25,
    supportedBy: [],
    pushes: 3,
    pushedBy: [],
    streak: 28,
    comments: [],
  },
   {
    id: 'post-3',
    user: USER_ANNA,
    habitGroupId: 'huddle-3',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), 
    note: "Daily UI Challenge #021 - Calculator. What do you guys think?",
    supports: 18,
    supportedBy: [],
    pushes: 2,
    pushedBy: [],
    streak: 21,
    comments: [],
  },
];

export const BADGES: Badge[] = [
    { id: 'badge-1', name: 'Early Bird', description: 'Completed a habit before 8 AM.', emoji: '⭐', earned: true },
    { id: 'badge-2', name: 'Consistent Coder', description: 'Maintained a 7-day coding streak.', emoji: '💻', earned: true },
    { id: 'badge-3', name: 'Community MVP', description: 'Received 50 cheers.', emoji: '🤝', earned: true },
    { id: 'badge-4', name: 'Trailblazer', description: 'Completed a 30-day challenge.', emoji: '⛰️', earned: true },
    { id: 'badge-5', name: 'Perfect Week', description: 'Complete all daily habits for 7 days.', emoji: '🗓️', earned: false },
];

export const STREAK_ACHIEVEMENTS: StreakAchievement[] = [
    { id: 'sa-1', name: 'Rentetan 30 Hari', days: 30, earned: true },
    { id: 'sa-2', name: 'Rentetan 120 Hari', days: 120, earned: false },
    { id: 'sa-3', name: 'Rentetan 180 Hari', days: 180, earned: false },
    { id: 'sa-4', name: 'Rentetan 365 Hari', days: 365, earned: false },
];


export const CHALLENGES: Challenge[] = [
    { id: 'challenge-1', title: '7-Day Mindful Morning', description: 'Start your day with meditation and journaling.', duration: 7, reward: 100, icon: '🧘', participants: 142 },
    { id: 'challenge-2', title: '30-Day Fitness Boost', description: 'Commit to 30 minutes of exercise every day.', duration: 30, reward: 500, icon: '🏋️', participants: 89 },
    { id: 'challenge-3', title: '14-Day Hydration Challenge', description: 'Drink at least 2 liters of water daily.', duration: 14, reward: 150, icon: '💧', participants: 213 },
];

export const HABIT_GROUPS: HabitGroup[] = [
  {
    id: 'huddle-1',
    name: 'Lari Pagi 5K',
    emoji: '🏃',
    description: 'Yuk, rutin lari bareng tiap pagi! Sehat & semangat!',
    memberCount: 18,
    members: [USER_TAYLOR, USER_JAMES, USER_ANNA],
    tag: { emoji: '🔥', text: 'Tantangan Streak 30-Hari' },
    color: 'teal',
    creator: USER_TAYLOR,
    isPrivate: false,
  },
  {
    id: 'huddle-4',
    name: 'English Speaking Club',
    emoji: '💬',
    description: 'Latihan ngomong Inggris via voice chat & diskusi topik seru!',
    memberCount: 19,
    members: [USER_EKA, USER_JAMES],
    tag: { emoji: '🗣️', text: 'Diskusi Mingguan' },
    color: 'purple',
    creator: USER_EKA,
    isPrivate: true,
  },
  {
    id: 'huddle-5',
    name: 'Early Morning Meditation',
    emoji: '🧘',
    description: 'Start your day with a calm mind. 10 minutes of guided meditation.',
    memberCount: 15,
    members: [USER_FAJAR, USER_YOU, USER_TAYLOR],
    tag: { emoji: '☀️', text: 'Peaceful Mornings' },
    color: 'yellow',
    creator: USER_FAJAR,
    isPrivate: false,
  },
  {
    id: 'huddle-2',
    name: 'Baca Buku Non-Fiksi',
    emoji: '📚',
    description: 'Selesaikan 1 buku/bulan. Berbagi wawasan & jaga akuntabilitas!',
    memberCount: 20,
    members: [USER_BUDI, USER_TAYLOR, USER_JAMES],
    tag: { emoji: '🗳️', text: 'Voting Buku Baru' },
    color: 'blue',
    creator: USER_BUDI,
    isPrivate: false,
  },
  {
    id: 'huddle-3',
    name: 'Tantangan UI Harian',
    emoji: '🎨',
    description: 'Konsisten desain UI tiap hari, tingkatkan skill & dapatkan feedback!',
    memberCount: 18,
    members: [USER_ANNA, USER_YOU, CURRENT_USER],
    tag: { emoji: '✍️', text: 'Kritik Desain' },
    color: 'green',
    creator: USER_ANNA,
    isPrivate: true,
  },
  {
    id: 'huddle-6',
    name: 'Balancing Act: Yoga',
    emoji: '🤸',
    description: 'Tone your body, calm your mind. Saturday morning sessions.',
    memberCount: 19,
    members: [USER_JAMES, USER_ANNA, USER_TAYLOR],
    tag: { emoji: '🧘‍♀️', text: 'Saturday Sessions' },
    color: 'pink',
    creator: USER_JAMES,
    isPrivate: false,
  }
];


export const ENCOURAGEMENT_TEMPLATES: string[] = [
    "Great job!",
    "Keep up the fantastic work!",
    "You're an inspiration!",
    "Consistency is key!",
    "Proud of your progress!",
];

export const STREAK_DATA = [
    { id: 1, streak: 35, color: 'purple', emoji: '😊' },
    { id: 2, streak: 28, color: 'green', emoji: '✅' },
    { id: 3, streak: 25, color: 'green', emoji: '✅' },
    { id: 4, streak: 14, color: 'blue', emoji: '🎉' },
    { id: 5, streak: 8, color: 'purple', emoji: '👟' },
    { id: 6, streak: 8, color: 'orange', emoji: '📖' },
    { id: 7, streak: 3, color: 'yellow', emoji: '💪' },
];

export const PERSONAL_HABIT_ICONS = ['📖', '🏃', '💧', '📝', '🧘', '🎸', '🏋️', '🎨', '💻', '🔍', '🧹', '🚶'];

export const HABIT_CATEGORIES = [
  { id: 'learning', translationKey: 'categoryLearning' },
  { id: 'physical_health', translationKey: 'categoryPhysicalHealth' },
  { id: 'mental_health', translationKey: 'categoryMentalHealth' },
  { id: 'finance', translationKey: 'categoryFinance' },
  { id: 'lifestyle', translationKey: 'categoryLifestyle' },
  { id: 'social', translationKey: 'categorySocial' },
  { id: 'challenges', translationKey: 'categoryChallenges' },
];

export const CONVERSATIONS: Conversation[] = [
    {
        id: 'conv-1',
        participants: [CURRENT_USER, USER_BUDI],
        messages: [
            { id: 'msg-1', senderId: 'user-2', text: 'Great run today!', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)},
            { id: 'msg-2', senderId: 'user-3', text: 'Thanks! You too. The hill was tough though.', timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000)},
            { id: 'msg-3', senderId: 'user-2', text: 'For sure! 🔥', timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000)},
        ]
    },
    {
        id: 'conv-2',
        participants: [CURRENT_USER, USER_ANNA],
        messages: [
            { id: 'msg-4', senderId: 'user-7', text: 'Saw your UI challenge post, looked amazing!', timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000)},
            { id: 'msg-5', senderId: 'user-3', text: 'Thank you! I appreciate that. Yours was great too.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)},
        ]
    }
];

export const HABIT_LOGS: HabitLog[] = [
    { id: 'log-1', habitId: 'habit-1', date: 14, note: 'Ran 3.5K, felt strong. Pace was good.' },
    { id: 'log-2', habitId: 'habit-1', date: 13, note: 'Morning jog, a bit slower today.' },
    { id: 'log-3', habitId: 'habit-2', date: 10, note: 'Studied new vocabulary for an hour.' },
    { id: 'log-4', habitId: 'habit-1', date: 12, note: 'Easy 2K run to recover.' },
    { id: 'log-5', habitId: 'habit-2', date: 14, note: 'Reviewed grammar concepts and did practice exercises.' },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        type: 'comment',
        actor: USER_BUDI,
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false,
        target: { type: 'post', id: 'post-2', habitGroupId: 'huddle-1' }
    },
    {
        id: 'notif-2',
        type: 'cheer',
        actor: USER_TAYLOR,
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
        target: { type: 'post', id: 'post-3', habitGroupId: 'huddle-3' }
    },
     {
        id: 'notif-5',
        type: 'join_request',
        actor: CURRENT_USER,
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isRead: false,
        target: { type: 'habit_group', id: 'huddle-3' }, // Request to join Anna's huddle
    },
    {
        id: 'notif-3',
        type: 'message',
        actor: USER_ANNA,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        target: { type: 'chat', id: 'conv-2' }
    },
    {
        id: 'notif-4',
        type: 'push',
        actor: USER_JAMES,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        isRead: true,
        target: { type: 'post', id: 'post-2', habitGroupId: 'huddle-1' }
    }
];