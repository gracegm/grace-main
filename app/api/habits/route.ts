import { NextRequest, NextResponse } from 'next/server';
import { db, calculateGlowScore, checkAchievements } from '@/lib/database';
import { HabitEntry } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const { userId, taskId, taskTitle, category, completed } = await request.json();

    if (!userId || !taskId || !taskTitle || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user
    const user = await db.getUser(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if habit already exists for today
    const today = new Date();
    const existingHabits = await db.getHabitEntries(userId);
    const existingHabit = existingHabits.find(h => h.taskId === taskId);

    if (existingHabit) {
      // Update existing habit
      const updatedHabit = await db.updateHabitEntry(existingHabit.id, {
        completed,
        completedAt: completed ? new Date() : undefined,
        streak: completed ? existingHabit.streak + 1 : Math.max(0, existingHabit.streak - 1)
      });

      if (updatedHabit) {
        // Update user stats
        const newGlowScore = await calculateGlowScore(userId);
        const newStreak = completed ? user.currentStreak + 1 : Math.max(0, user.currentStreak - 1);
        
        await db.updateUser(userId, {
          glowScore: newGlowScore,
          currentStreak: newStreak,
          longestStreak: Math.max(user.longestStreak, newStreak),
          totalDaysActive: completed ? user.totalDaysActive + 1 : user.totalDaysActive,
          xp: user.xp + (completed ? 10 : 0),
          lastActive: new Date()
        });

        // Check for achievements
        const newAchievements = await checkAchievements(userId);

        // Add activity
        if (completed) {
          await db.addActivity({
            id: `activity-${Date.now()}`,
            userId,
            type: 'habit_completed',
            description: `Completed ${taskTitle}`,
            timestamp: new Date(),
            metadata: {
              habitId: taskId,
              streakDays: updatedHabit.streak
            }
          });
        }

        return NextResponse.json({
          habit: updatedHabit,
          newGlowScore,
          newStreak,
          newAchievements,
          xpEarned: completed ? 10 : 0
        });
      }
    } else {
      // Create new habit entry
      const newHabit: HabitEntry = {
        id: `habit-${Date.now()}`,
        userId,
        date: today,
        taskId,
        taskTitle,
        category: category as 'morning' | 'evening' | 'anytime',
        completed,
        completedAt: completed ? new Date() : undefined,
        streak: completed ? 1 : 0,
        xpEarned: completed ? 10 : 0
      };

      await db.addHabitEntry(newHabit);

      // Update user stats
      const newGlowScore = await calculateGlowScore(userId);
      const newStreak = completed ? user.currentStreak + 1 : user.currentStreak;
      
      await db.updateUser(userId, {
        glowScore: newGlowScore,
        currentStreak: newStreak,
        longestStreak: Math.max(user.longestStreak, newStreak),
        totalDaysActive: completed ? user.totalDaysActive + 1 : user.totalDaysActive,
        xp: user.xp + (completed ? 10 : 0),
        lastActive: new Date()
      });

      // Check for achievements
      const newAchievements = await checkAchievements(userId);

      // Add activity
      if (completed) {
        await db.addActivity({
          id: `activity-${Date.now()}`,
          userId,
          type: 'habit_completed',
          description: `Completed ${taskTitle}`,
          timestamp: new Date(),
          metadata: {
            habitId: taskId,
            streakDays: newHabit.streak
          }
        });
      }

      return NextResponse.json({
        habit: newHabit,
        newGlowScore,
        newStreak,
        newAchievements,
        xpEarned: completed ? 10 : 0
      });
    }

  } catch (error) {
    console.error('Habit tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track habit' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );
    }

    const targetDate = date ? new Date(date) : new Date();
    const habits = await db.getHabitEntries(userId);

    // Get user for additional context
    const user = await db.getUser(userId);

    return NextResponse.json({
      habits,
      date: targetDate,
      user: user ? {
        glowScore: user.glowScore,
        currentStreak: user.currentStreak,
        level: user.level,
        xp: user.xp
      } : null
    });

  } catch (error) {
    console.error('Get habits error:', error);
    return NextResponse.json(
      { error: 'Failed to get habits' },
      { status: 500 }
    );
  }
}
