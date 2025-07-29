import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
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

    // Get recent analyses for trend analysis
    const recentAnalyses = await db.getSkinAnalyses(userId);

    // Generate AI forecast
    const forecast = await aiService.generateSkinForecast(user, recentAnalyses);

    // Save forecast
    await db.addSkinForecast(forecast);

    // Add activity
    await db.addActivity({
      id: `activity-${Date.now()}`,
      userId,
      type: 'analysis_completed',
      description: 'Generated AI skin forecast',
      timestamp: new Date()
    });

    return NextResponse.json({
      forecast,
      trendsAvailable: recentAnalyses.length > 1,
      confidence: forecast.predictions.reduce((sum, p) => sum + p.confidence, 0) / forecast.predictions.length
    });

  } catch (error) {
    console.error('Skin forecast error:', error);
    return NextResponse.json(
      { error: 'Failed to generate skin forecast' },
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

    const forecasts = await db.getSkinForecasts(userId);
    const latest = forecasts[forecasts.length - 1];

    return NextResponse.json({
      forecasts,
      latest,
      count: forecasts.length
    });

  } catch (error) {
    console.error('Get skin forecasts error:', error);
    return NextResponse.json(
      { error: 'Failed to get skin forecasts' },
      { status: 500 }
    );
  }
}
