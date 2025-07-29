import { NextRequest, NextResponse } from 'next/server';
import { db, calculateGlowScore, checkAchievements } from '@/lib/database';
import { aiService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
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

    // Get previous analysis for comparison
    const previousAnalysis = await db.getLatestSkinAnalysis(userId);

    // Generate new AI analysis
    const newAnalysis = await aiService.generateSkinAnalysis(user, previousAnalysis || undefined);

    // Save analysis
    await db.addSkinAnalysis(newAnalysis);

    // Update user's GlowScore
    const newGlowScore = await calculateGlowScore(userId);
    await db.updateUser(userId, { 
      glowScore: newGlowScore,
      lastActive: new Date()
    });

    // Check for new achievements
    const newAchievements = await checkAchievements(userId);

    // Add activity
    await db.addActivity({
      id: `activity-${Date.now()}`,
      userId,
      type: 'analysis_completed',
      description: 'Completed AI skin analysis',
      timestamp: new Date(),
      metadata: {
        glowScoreChange: newGlowScore - user.glowScore
      }
    });

    return NextResponse.json({
      analysis: newAnalysis,
      newGlowScore,
      newAchievements,
      improvement: previousAnalysis ? 
        newAnalysis.overallScore - previousAnalysis.overallScore : 0
    });

  } catch (error) {
    console.error('Skin analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to generate skin analysis' },
      { status: 500 }
    );
  }
}

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

    const analyses = await db.getSkinAnalyses(userId);
    const latest = await db.getLatestSkinAnalysis(userId);

    return NextResponse.json({
      analyses,
      latest,
      count: analyses.length
    });

  } catch (error) {
    console.error('Get skin analyses error:', error);
    return NextResponse.json(
      { error: 'Failed to get skin analyses' },
      { status: 500 }
    );
  }
}
