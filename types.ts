

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  memberSince: string;
  bio: string;
}

export enum HabitFrequency {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  CUSTOM = 'Custom',
}

export interface Habit {
  id:string;
  name: string;
  icon: string;
  frequency: HabitFrequency;
  streak: number;
  color?: string;
}

export interface Comment {
  user: User;
  text: string;
  timestamp: Date;
}

export interface Post {
  id:string;
  user: User;
  habitGroupId: string;
  timestamp: Date;
  note: string;
  imageUrl?: string;
  supports: number;
  supportedBy: string[];
  pushes: number;
  pushedBy: string[];
  comments: Comment[];
  streak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  earned: boolean;
}

export interface StreakAchievement {
  id: string;
  name: string;
  days: number;
  earned: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // in days
  reward: number; // in points
  icon: string;
  participants: number;
}

export interface HabitGroup {
  id: string;
  name: string;
  emoji: string;
  description: string;
  memberCount: number;
  members: User[];
  tag: {
    emoji: string;
    text: string;
  };
  color?: string;
  creator: User;
  isPrivate: boolean;
  coverImageUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: ChatMessage[];
}

export interface HabitLog {
    id: string;
    habitId: string;
    date: number; // day of the month
    note: string;
}

export type NotificationType = 'message' | 'cheer' | 'push' | 'comment' | 'join_request';

export interface Notification {
  id: string;
  type: NotificationType;
  actor: User;
  timestamp: Date;
  isRead: boolean;
  target: {
    type: 'post' | 'chat' | 'habit_group';
    id: string; // postId, conversationId, or habitGroupId
    habitGroupId?: string; // only for post
  };
}


export type View = 'feed' | 'profile' | 'settings' | 'messages';