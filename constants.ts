import { User } from './types';

export const CURRENT_USER: User = {
  id: 'user-3',
  name: 'Siti_H.D.',
  avatarUrl: 'https://i.pravatar.cc/150?u=siti_hd',
  memberSince: 'Jan 2023',
  bio: 'Consistency is key!'
};

export const DELETED_USER: User = {
  id: 'deleted-user',
  name: 'Deleted User',
  avatarUrl: '',
  memberSince: '',
  bio: 'This user no longer exists.'
};


export const ENCOURAGEMENT_TEMPLATES: string[] = [
    "Great job!",
    "Keep up the fantastic work!",
    "You're an inspiration!",
    "Consistency is key!",
    "Proud of your progress!",
];

export const PERSONAL_HABIT_ICONS = ['📖', '🏃', '💧', '📝', '🧘', '🎸', '🏋️', '🎨', '💻', '🔍', '🧹', '🚶'];

export const HABIT_CATEGORIES = [
  { id: 'learning', translationKey: 'categoryLearning', emoji: '📚' },
  { id: 'physical_health', translationKey: 'categoryPhysicalHealth', emoji: '💪' },
  { id: 'mental_health', translationKey: 'categoryMentalHealth', emoji: '🧠' },
  { id: 'finance', translationKey: 'categoryFinance', emoji: '💰' },
  { id: 'lifestyle', translationKey: 'categoryLifestyle', emoji: '🎨' },
  { id: 'social', translationKey: 'categorySocial', emoji: '🤝' },
  { id: 'challenges', translationKey: 'categoryChallenges', emoji: '🏆' },
];