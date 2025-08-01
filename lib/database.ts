// Database utilities for PeachieGlow AI System
// Production MongoDB integration with fallback to in-memory for demo

import { MongoClient, Db, Collection } from 'mongodb';
import { 
  User, 
  SkinAnalysis, 
  HabitEntry, 
  Achievement, 
  UserAchievement, 
  GlowBotConversation,
  UserActivity,
  SkinForecast,
  UserStats 
} from '@/types/user';

// Production MongoDB Database
class MongoDatabase {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected = false;
  
  // Collections
  private users: Collection<User> | null = null;
  private skinAnalyses: Collection<SkinAnalysis> | null = null;
  private habitEntries: Collection<HabitEntry> | null = null;
  private achievements: Collection<Achievement> | null = null;
  private userAchievements: Collection<UserAchievement> | null = null;
  private conversations: Collection<GlowBotConversation> | null = null;
  private activities: Collection<UserActivity> | null = null;
  private forecasts: Collection<SkinForecast> | null = null;

  async connect(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        console.warn('MONGODB_URI not found, falling back to in-memory storage');
        return;
      }

      this.client = new MongoClient(mongoUri);
      await this.client.connect();
      this.db = this.client.db('peachieglow');
      
      // Initialize collections
      this.users = this.db.collection<User>('users');
      this.skinAnalyses = this.db.collection<SkinAnalysis>('skin_analyses');
      this.habitEntries = this.db.collection<HabitEntry>('habit_entries');
      this.achievements = this.db.collection<Achievement>('achievements');
      this.userAchievements = this.db.collection<UserAchievement>('user_achievements');
      this.conversations = this.db.collection<GlowBotConversation>('conversations');
      this.activities = this.db.collection<UserActivity>('activities');
      this.forecasts = this.db.collection<SkinForecast>('forecasts');
      
      // Create indexes for better performance
      await this.createIndexes();
      
      this.isConnected = true;
      console.log('✅ Connected to MongoDB successfully');
      
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      console.log('📝 Falling back to in-memory storage for demo');
    }
  }
  
  private async createIndexes(): Promise<void> {
    if (!this.users || !this.skinAnalyses || !this.habitEntries) return;
    
    try {
      // User indexes
      await this.users.createIndex({ email: 1 }, { unique: true });
      await this.users.createIndex({ lastActive: -1 });
      
      // Skin analysis indexes
      await this.skinAnalyses.createIndex({ userId: 1, date: -1 });
      
      // Habit entries indexes
      await this.habitEntries.createIndex({ userId: 1, date: -1 });
      
      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('⚠️ Index creation failed:', error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('📤 Disconnected from MongoDB');
    }
  }

  // User operations
  async getUser(userId: string): Promise<User | null> {
    if (this.isConnected && this.users) {
      return await this.users.findOne({ id: userId }) || null;
    }
    return this.fallbackDatabase.getUser(userId);
  }

  async createUser(user: User): Promise<void> {
    if (this.isConnected && this.users) {
      await this.users.insertOne(user);
      return;
    }
    // Fallback: Add user to in-memory storage
    this.fallbackDatabase.users.set(user.id, user);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    if (this.isConnected && this.users) {
      await this.users.updateOne({ id: userId }, { $set: updates });
      return;
    }
    this.fallbackDatabase.updateUser(userId, updates);
  }

  // Skin analysis operations
  async getSkinAnalyses(userId: string): Promise<SkinAnalysis[]> {
    if (this.isConnected && this.skinAnalyses) {
      return await this.skinAnalyses.find({ userId }).sort({ date: -1 }).toArray();
    }
    return this.fallbackDatabase.getSkinAnalyses(userId);
  }

  async createSkinAnalysis(analysis: SkinAnalysis): Promise<void> {
    if (this.isConnected && this.skinAnalyses) {
      await this.skinAnalyses.insertOne(analysis);
      return;
    }
    // Fallback: Add analysis to in-memory storage
    const existing = this.fallbackDatabase.skinAnalyses.get(analysis.userId) || [];
    existing.push(analysis);
    this.fallbackDatabase.skinAnalyses.set(analysis.userId, existing);
  }

  // Habit entry operations
  async getHabitEntries(userId: string): Promise<HabitEntry[]> {
    if (this.isConnected && this.habitEntries) {
      return await this.habitEntries.find({ userId }).sort({ date: -1 }).toArray();
    }
    return this.fallbackDatabase.getHabitEntries(userId);
  }

  async createHabitEntry(entry: HabitEntry): Promise<void> {
    if (this.isConnected && this.habitEntries) {
      await this.habitEntries.insertOne(entry);
      return;
    }
    // Fallback: Add habit entry to in-memory storage
    const existing = this.fallbackDatabase.habitEntries.get(entry.userId) || [];
    existing.push(entry);
    this.fallbackDatabase.habitEntries.set(entry.userId, existing);
  }

  async updateHabitEntry(entryId: string, updates: Partial<HabitEntry>): Promise<void> {
    if (this.isConnected && this.habitEntries) {
      await this.habitEntries.updateOne({ id: entryId }, { $set: updates });
      return;
    }
    this.fallbackDatabase.updateHabitEntry(entryId, updates);
  }

  // Fallback in-memory database for demo/development
  private fallbackDatabase = new InMemoryDatabase();
}

// In-memory storage fallback for development/demo
class InMemoryDatabase {
  public users: Map<string, User> = new Map();
  public skinAnalyses: Map<string, SkinAnalysis[]> = new Map();
  public habitEntries: Map<string, HabitEntry[]> = new Map();
  public achievements: Map<string, Achievement> = new Map();
  public userAchievements: Map<string, UserAchievement[]> = new Map();
  public conversations: Map<string, GlowBotConversation[]> = new Map();
  public activities: Map<string, UserActivity[]> = new Map();
  public forecasts: Map<string, SkinForecast[]> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample user
    const sampleUser: User = {
      id: 'user-1',
      email: 'demo@peachieglow.com',
      name: 'Demo User',
      age: 28,
      skinType: 'combination',
      skinConcerns: ['acne', 'dark spots', 'hydration'],
      joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      lastActive: new Date(),
      glowScore: 67,
      currentStreak: 12,
      longestStreak: 25,
      totalDaysActive: 28,
      level: 3,
      xp: 1250
    };
    this.users.set(sampleUser.id, sampleUser);

    // Sample achievements
    const sampleAchievements: Achievement[] = [
      {
        id: 'consistency-week',
        title: 'Week Warrior',
        description: 'Complete your routine for 7 days straight',
        category: 'consistency',
        rarity: 'common',
        icon: '🗓️',
        xpReward: 100,
        unlockedBy: ['user-1'],
        requirements: {
          type: 'streak',
          value: 7,
          description: '7-day streak'
        }
      },
      {
        id: 'ai-chat-master',
        title: 'GlowBot Best Friend',
        description: 'Have 50 conversations with GlowBot',
        category: 'ai',
        rarity: 'rare',
        icon: '🤖',
        xpReward: 250,
        unlockedBy: [],
        requirements: {
          type: 'days',
          value: 50,
          description: '50 AI conversations'
        }
      },
      {
        id: 'glow-legend',
        title: 'Glow Legend',
        description: 'Reach GlowScore of 100',
        category: 'milestone',
        rarity: 'legendary',
        icon: '👑',
        xpReward: 1000,
        unlockedBy: [],
        requirements: {
          type: 'score',
          value: 100,
          description: 'GlowScore 100+'
        }
      }
    ];

    sampleAchievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });

    // Sample habit entries
    const sampleHabits: HabitEntry[] = [
      {
        id: 'habit-1',
        userId: 'user-1',
        date: new Date(),
        taskId: 'morning-cleanser',
        taskTitle: 'Morning Cleanser',
        category: 'morning',
        completed: true,
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        streak: 12,
        xpEarned: 10
      },
      {
        id: 'habit-2',
        userId: 'user-1',
        date: new Date(),
        taskId: 'vitamin-c',
        taskTitle: 'Vitamin C Serum',
        category: 'morning',
        completed: true,
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        streak: 10,
        xpEarned: 15
      }
    ];

    this.habitEntries.set('user-1', sampleHabits);
  }

  // User methods
  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Skin Analysis methods
  async getSkinAnalyses(userId: string): Promise<SkinAnalysis[]> {
    return this.skinAnalyses.get(userId) || [];
  }

  async getLatestSkinAnalysis(userId: string): Promise<SkinAnalysis | null> {
    const analyses = this.skinAnalyses.get(userId) || [];
    return analyses.length > 0 ? analyses[analyses.length - 1] : null;
  }

  async addSkinAnalysis(analysis: SkinAnalysis): Promise<void> {
    const existing = this.skinAnalyses.get(analysis.userId) || [];
    existing.push(analysis);
    this.skinAnalyses.set(analysis.userId, existing);
  }

  // Habit methods
  async getHabitEntries(userId: string, date?: Date): Promise<HabitEntry[]> {
    const habits = this.habitEntries.get(userId) || [];
    if (!date) return habits;
    
    const targetDate = date.toDateString();
    return habits.filter(habit => habit.date.toDateString() === targetDate);
  }

  async addHabitEntry(habit: HabitEntry): Promise<void> {
    const existing = this.habitEntries.get(habit.userId) || [];
    existing.push(habit);
    this.habitEntries.set(habit.userId, existing);
  }

  async updateHabitEntry(habitId: string, updates: Partial<HabitEntry>): Promise<HabitEntry | null> {
    for (const [userId, habits] of this.habitEntries.entries()) {
      const habitIndex = habits.findIndex(h => h.id === habitId);
      if (habitIndex !== -1) {
        habits[habitIndex] = { ...habits[habitIndex], ...updates };
        this.habitEntries.set(userId, habits);
        return habits[habitIndex];
      }
    }
    return null;
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return this.userAchievements.get(userId) || [];
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement | null> {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) return null;

    const userAchievement: UserAchievement = {
      id: `ua-${Date.now()}`,
      userId,
      achievementId,
      unlockedAt: new Date(),
      progress: 100,
      isUnlocked: true
    };

    const existing = this.userAchievements.get(userId) || [];
    existing.push(userAchievement);
    this.userAchievements.set(userId, existing);

    // Update achievement unlocked by list
    achievement.unlockedBy.push(userId);
    this.achievements.set(achievementId, achievement);

    return userAchievement;
  }

  // Conversation methods
  async getConversations(userId: string): Promise<GlowBotConversation[]> {
    return this.conversations.get(userId) || [];
  }

  async addConversation(conversation: GlowBotConversation): Promise<void> {
    const existing = this.conversations.get(conversation.userId) || [];
    existing.push(conversation);
    this.conversations.set(conversation.userId, existing);
  }

  async updateConversation(conversationId: string, updates: Partial<GlowBotConversation>): Promise<GlowBotConversation | null> {
    for (const [userId, conversations] of this.conversations.entries()) {
      const convIndex = conversations.findIndex(c => c.id === conversationId);
      if (convIndex !== -1) {
        conversations[convIndex] = { ...conversations[convIndex], ...updates };
        this.conversations.set(userId, conversations);
        return conversations[convIndex];
      }
    }
    return null;
  }

  // Activity methods
  async getUserActivities(userId: string, limit = 10): Promise<UserActivity[]> {
    const activities = this.activities.get(userId) || [];
    return activities.slice(-limit).reverse(); // Get latest activities
  }

  async addActivity(activity: UserActivity): Promise<void> {
    const existing = this.activities.get(activity.userId) || [];
    existing.push(activity);
    this.activities.set(activity.userId, existing);
  }

  // Forecast methods
  async getSkinForecasts(userId: string): Promise<SkinForecast[]> {
    return this.forecasts.get(userId) || [];
  }

  async addSkinForecast(forecast: SkinForecast): Promise<void> {
    const existing = this.forecasts.get(forecast.userId) || [];
    existing.push(forecast);
    this.forecasts.set(forecast.userId, existing);
  }

  // Stats methods
  async getUserStats(userId: string): Promise<UserStats | null> {
    const user = await this.getUser(userId);
    const habits = await this.getHabitEntries(userId);
    const analyses = await this.getSkinAnalyses(userId);
    const achievements = await this.getUserAchievements(userId);
    const conversations = await this.getConversations(userId);

    if (!user) return null;

    const completedHabits = habits.filter(h => h.completed);
    const totalHabits = habits.length;

    return {
      userId,
      totalHabitsCompleted: completedHabits.length,
      averageGlowScore: user.glowScore,
      improvementPercentage: analyses.length > 1 ? 
        ((analyses[analyses.length - 1].overallScore - analyses[0].overallScore) / analyses[0].overallScore) * 100 : 0,
      consistencyRate: totalHabits > 0 ? (completedHabits.length / totalHabits) * 100 : 0,
      favoriteTimeOfDay: this.getMostFrequentCategory(completedHabits),
      mostImprovedArea: 'hydration', // Simplified for demo
      aiInteractions: conversations.reduce((sum, conv) => sum + conv.messages.length, 0),
      achievementsUnlocked: achievements.filter(a => a.isUnlocked).length
    };
  }

  private getMostFrequentCategory(habits: HabitEntry[]): 'morning' | 'evening' | 'anytime' {
    const counts = { morning: 0, evening: 0, anytime: 0 };
    habits.forEach(habit => counts[habit.category]++);
    
    return Object.entries(counts).reduce((a, b) => counts[a[0] as keyof typeof counts] > counts[b[0] as keyof typeof counts] ? a : b)[0] as 'morning' | 'evening' | 'anytime';
  }
}

// Export singleton instance with MongoDB support
const mongoDb = new MongoDatabase();
const fallbackDb = new InMemoryDatabase();

// Initialize MongoDB connection on startup
if (typeof window === 'undefined') {
  // Server-side only
  mongoDb.connect().catch(console.error);
}

// Database service with MongoDB and fallback
class DatabaseService {
  async getUser(userId: string): Promise<User | null> {
    return await mongoDb.getUser(userId);
  }

  async createUser(user: User): Promise<void> {
    return await mongoDb.createUser(user);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    return await mongoDb.updateUser(userId, updates);
  }

  async getSkinAnalyses(userId: string): Promise<SkinAnalysis[]> {
    return await mongoDb.getSkinAnalyses(userId);
  }

  async createSkinAnalysis(analysis: SkinAnalysis): Promise<void> {
    return await mongoDb.createSkinAnalysis(analysis);
  }

  async getHabitEntries(userId: string): Promise<HabitEntry[]> {
    return await mongoDb.getHabitEntries(userId);
  }

  async createHabitEntry(entry: HabitEntry): Promise<void> {
    return await mongoDb.createHabitEntry(entry);
  }

  async updateHabitEntry(entryId: string, updates: Partial<HabitEntry>): Promise<void> {
    return await mongoDb.updateHabitEntry(entryId, updates);
  }

  async getUserStats(userId: string): Promise<UserStats | null> {
    return await fallbackDb.getUserStats(userId);
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement | null> {
    // Check if achievement exists
    const achievements = await this.getAchievements();
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (!achievement) {
      return null;
    }

    // Check if user already has this achievement
    const userAchievements = await this.getUserAchievements(userId);
    const existingAchievement = userAchievements.find(ua => ua.achievementId === achievementId);
    
    if (existingAchievement) {
      return existingAchievement;
    }

    // Create new user achievement
    const newUserAchievement: UserAchievement = {
      id: `ua-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      achievementId,
      unlockedAt: new Date(),
      progress: achievement.maxProgress || 1
    };

    // Add to database
    await this.addUserAchievement(newUserAchievement);
    
    return newUserAchievement;
  }

  // Delegate other methods to fallback for now (can be extended)
  async getAchievements(): Promise<Achievement[]> {
    return await fallbackDb.getAchievements();
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await fallbackDb.getUserAchievements(userId);
  }

  async addUserAchievement(achievement: UserAchievement): Promise<void> {
    // Add to fallback storage
    const existing = fallbackDb.userAchievements.get(achievement.userId) || [];
    existing.push(achievement);
    fallbackDb.userAchievements.set(achievement.userId, existing);
  }

  async getConversations(userId: string): Promise<GlowBotConversation[]> {
    return await fallbackDb.getConversations(userId);
  }

  async addConversation(conversation: GlowBotConversation): Promise<void> {
    return await fallbackDb.addConversation(conversation);
  }

  async getActivities(userId: string): Promise<UserActivity[]> {
    return fallbackDb.activities.get(userId) || [];
  }

  async addActivity(activity: UserActivity): Promise<void> {
    return await fallbackDb.addActivity(activity);
  }

  async getSkinForecasts(userId: string): Promise<SkinForecast[]> {
    return await fallbackDb.getSkinForecasts(userId);
  }

  async addSkinForecast(forecast: SkinForecast): Promise<void> {
    return await fallbackDb.addSkinForecast(forecast);
  }
}

export const db = new DatabaseService();

// Helper functions
export async function calculateGlowScore(userId: string): Promise<number> {
  const habits = await db.getHabitEntries(userId);
  const user = await db.getUser(userId);
  
  if (!user) return 0;

  const recentHabits = habits.filter(h => {
    const daysDiff = (Date.now() - h.date.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30; // Last 30 days
  });

  const completedHabits = recentHabits.filter(h => h.completed);
  const consistencyScore = recentHabits.length > 0 ? (completedHabits.length / recentHabits.length) * 50 : 0;
  const streakBonus = Math.min(user.currentStreak * 2, 30);
  const levelBonus = user.level * 5;

  return Math.min(Math.round(consistencyScore + streakBonus + levelBonus), 100);
}

export async function checkAchievements(userId: string): Promise<UserAchievement[]> {
  const user = await db.getUser(userId);
  const userAchievements = await db.getUserAchievements(userId);
  const allAchievements = await db.getAchievements();
  
  if (!user) return [];

  const newAchievements: UserAchievement[] = [];
  const unlockedIds = userAchievements.filter(ua => ua.isUnlocked).map(ua => ua.achievementId);

  for (const achievement of allAchievements) {
    if (unlockedIds.includes(achievement.id)) continue;

    let shouldUnlock = false;

    switch (achievement.requirements.type) {
      case 'streak':
        shouldUnlock = user.currentStreak >= achievement.requirements.value;
        break;
      case 'days':
        shouldUnlock = user.totalDaysActive >= achievement.requirements.value;
        break;
      case 'score':
        shouldUnlock = user.glowScore >= achievement.requirements.value;
        break;
    }

    if (shouldUnlock) {
      const newAchievement = await db.unlockAchievement(userId, achievement.id);
      if (newAchievement) {
        newAchievements.push(newAchievement);
      }
    }
  }

  return newAchievements;
}
