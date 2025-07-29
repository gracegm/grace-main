// User Data Types for PeachieGlow AI System

export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  skinType: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';
  skinConcerns: string[];
  joinDate: Date;
  lastActive: Date;
  glowScore: number;
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  level: number;
  xp: number;
}

export interface SkinAnalysis {
  id: string;
  userId: string;
  date: Date;
  overallScore: number;
  hydrationLevel: number;
  acneScore: number;
  wrinkleScore: number;
  darknessScore: number;
  rednessScore: number;
  improvements: {
    category: string;
    percentage: number;
    description: string;
  }[];
  concerns: {
    category: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
  recommendations: {
    type: 'product' | 'routine' | 'lifestyle';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }[];
  nextCheckIn: Date;
}

export interface HabitEntry {
  id: string;
  userId: string;
  date: Date;
  taskId: string;
  taskTitle: string;
  category: 'morning' | 'evening' | 'anytime';
  completed: boolean;
  completedAt?: Date;
  streak: number;
  xpEarned: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'consistency' | 'milestone' | 'improvement' | 'social' | 'ai';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  xpReward: number;
  unlockedBy: string[]; // user IDs who unlocked this
  requirements: {
    type: 'streak' | 'days' | 'score' | 'improvement';
    value: number;
    description: string;
  };
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
  isUnlocked: boolean;
}

export interface GlowBotConversation {
  id: string;
  userId: string;
  messages: GlowBotMessage[];
  context: {
    skinType: string;
    recentAnalysis?: SkinAnalysis;
    currentHabits: HabitEntry[];
    userConcerns: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GlowBotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    analysisReferenced?: boolean;
    recommendationGiven?: boolean;
    habitSuggested?: boolean;
  };
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'habit_completed' | 'achievement_unlocked' | 'analysis_completed' | 'streak_milestone';
  description: string;
  timestamp: Date;
  metadata?: {
    habitId?: string;
    achievementId?: string;
    streakDays?: number;
    glowScoreChange?: number;
  };
}

export interface SkinForecast {
  id: string;
  userId: string;
  generatedAt: Date;
  forecastDate: Date;
  predictions: {
    category: string;
    currentScore: number;
    predictedScore: number;
    confidence: number;
    factors: string[];
  }[];
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  aiInsights: string;
}

export interface UserStats {
  userId: string;
  totalHabitsCompleted: number;
  averageGlowScore: number;
  improvementPercentage: number;
  consistencyRate: number;
  favoriteTimeOfDay: 'morning' | 'evening' | 'anytime';
  mostImprovedArea: string;
  aiInteractions: number;
  achievementsUnlocked: number;
}
