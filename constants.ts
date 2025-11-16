import { User } from './types';

export const CURRENT_USER: User = {
  id: 'user-3',
  name: 'Siti_H.D.',
  avatarUrl: 'https://i.pravatar.cc/150?u=siti_hd',
  memberSince: 'Jan 2023',
  bio: 'Consistency is key!'
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
  { id: 'learning', translationKey: 'categoryLearning' },
  { id: 'physical_health', translationKey: 'categoryPhysicalHealth' },
  { id: 'mental_health', translationKey: 'categoryMentalHealth' },
  { id: 'finance', translationKey: 'categoryFinance' },
  { id: 'lifestyle', translationKey: 'categoryLifestyle' },
  { id: 'social', translationKey: 'categorySocial' },
  { id: 'challenges', translationKey: 'categoryChallenges' },
];