import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { aiService } from '@/lib/ai-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );
    }

    // Get comprehensive user stats
    const user = await db.getUser(userId);
    const stats = await db.getUserStats(userId);
    const activities = await db.getUserActivities(userId, 20);
    const achievements = await db.getUserAchievements(userId);
    const habits = await db.getHabitEntries(userId);

    if (!user || !stats) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get AI-powered achievement analysis
    const achievementAnalysis = await aiService.analyzeAchievementProgress(user, habits);

    // Calculate additional insights
    const completedHabitsToday = habits.filter(h => 
      h.completed && h.date.toDateString() === new Date().toDateString()
    ).length;

    const weeklyProgress = habits.filter(h => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return h.date >= weekAgo && h.completed;
    }).length;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        glowScore: user.glowScore,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        level: user.level,
        xp: user.xp,
        skinType: user.skinType,
        joinDate: user.joinDate
      },
      stats,
      activities,
      achievements: {
        unlocked: achievements.filter(a => a.isUnlocked),
        total: achievements.length,
        recentUnlocks: achievements
          .filter(a => a.isUnlocked)
          .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime())
          .slice(0, 3)
      },
      insights: {
        completedHabitsToday,
        weeklyProgress,
        improvementTrend: stats.improvementPercentage > 0 ? 'improving' : 'stable',
        nextMilestone: achievementAnalysis.nearbyAchievements[0],
        motivationalMessage: achievementAnalysis.motivationalMessage
      },
      aiAnalysis: achievementAnalysis
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get user stats' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, updates } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await db.updateUser(userId, {
      ...updates,
      lastActive: new Date()
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: updatedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
