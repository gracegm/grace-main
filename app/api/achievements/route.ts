import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

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

    // Get all achievements and user's progress
    const allAchievements = await db.getAchievements();
    const userAchievements = await db.getUserAchievements(userId);
    const user = await db.getUser(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Combine achievement data with user progress
    const achievementsWithProgress = allAchievements.map(achievement => {
      const userProgress = userAchievements.find(ua => ua.achievementId === achievement.id);
      
      // Calculate current progress based on achievement type
      let currentProgress = 0;
      let isUnlocked = userProgress?.isUnlocked || false;

      if (!isUnlocked) {
        switch (achievement.requirements.type) {
          case 'streak':
            currentProgress = Math.min(100, (user.currentStreak / achievement.requirements.value) * 100);
            break;
          case 'days':
            currentProgress = Math.min(100, (user.totalDaysActive / achievement.requirements.value) * 100);
            break;
          case 'score':
            currentProgress = Math.min(100, (user.glowScore / achievement.requirements.value) * 100);
            break;
          default:
            currentProgress = userProgress?.progress || 0;
        }
      } else {
        currentProgress = 100;
      }

      return {
        ...achievement,
        userProgress: {
          progress: Math.round(currentProgress),
          isUnlocked,
          unlockedAt: userProgress?.unlockedAt,
          daysToUnlock: isUnlocked ? 0 : Math.ceil((achievement.requirements.value - getCurrentValue(user, achievement.requirements.type)) / 1)
        },
        globalStats: {
          totalUnlocked: achievement.unlockedBy.length,
          rarityPercentage: getRarityPercentage(achievement.rarity)
        }
      };
    });

    // Sort by rarity and unlock status
    const sortedAchievements = achievementsWithProgress.sort((a, b) => {
      // Unlocked achievements first
      if (a.userProgress.isUnlocked !== b.userProgress.isUnlocked) {
        return a.userProgress.isUnlocked ? -1 : 1;
      }
      
      // Then by rarity (legendary first)
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
      return rarityOrder[a.rarity as keyof typeof rarityOrder] - rarityOrder[b.rarity as keyof typeof rarityOrder];
    });

    return NextResponse.json({
      achievements: sortedAchievements,
      summary: {
        total: allAchievements.length,
        unlocked: userAchievements.filter(ua => ua.isUnlocked).length,
        totalXp: userAchievements
          .filter(ua => ua.isUnlocked)
          .reduce((sum, ua) => {
            const achievement = allAchievements.find(a => a.id === ua.achievementId);
            return sum + (achievement?.xpReward || 0);
          }, 0),
        recentUnlocks: userAchievements
          .filter(ua => ua.isUnlocked)
          .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime())
          .slice(0, 3)
      }
    });

  } catch (error) {
    console.error('Get achievements error:', error);
    return NextResponse.json(
      { error: 'Failed to get achievements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, achievementId } = await request.json();

    if (!userId || !achievementId) {
      return NextResponse.json(
        { error: 'UserId and achievementId are required' },
        { status: 400 }
      );
    }

    // Manually unlock achievement (for testing or special cases)
    const unlockedAchievement = await db.unlockAchievement(userId, achievementId);

    if (!unlockedAchievement) {
      return NextResponse.json(
        { error: 'Failed to unlock achievement' },
        { status: 400 }
      );
    }

    // Update user XP
    const achievement = (await db.getAchievements()).find(a => a.id === achievementId);
    if (achievement) {
      const user = await db.getUser(userId);
      if (user) {
        await db.updateUser(userId, {
          xp: user.xp + achievement.xpReward,
          level: Math.floor((user.xp + achievement.xpReward) / 500) + 1 // 500 XP per level
        });
      }
    }

    // Add activity
    await db.addActivity({
      id: `activity-${Date.now()}`,
      userId,
      type: 'achievement_unlocked',
      description: `Unlocked achievement: ${achievement?.title}`,
      timestamp: new Date(),
      metadata: {
        achievementId
      }
    });

    return NextResponse.json({
      achievement: unlockedAchievement,
      xpEarned: achievement?.xpReward || 0,
      message: 'Achievement unlocked successfully!'
    });

  } catch (error) {
    console.error('Unlock achievement error:', error);
    return NextResponse.json(
      { error: 'Failed to unlock achievement' },
      { status: 500 }
    );
  }
}

// Helper functions
function getCurrentValue(user: any, type: string): number {
  switch (type) {
    case 'streak':
      return user.currentStreak;
    case 'days':
      return user.totalDaysActive;
    case 'score':
      return user.glowScore;
    default:
      return 0;
  }
}

function getRarityPercentage(rarity: string): number {
  const rarityPercentages = {
    common: 60,
    rare: 25,
    epic: 12,
    legendary: 3
  };
  return rarityPercentages[rarity as keyof typeof rarityPercentages] || 50;
}
