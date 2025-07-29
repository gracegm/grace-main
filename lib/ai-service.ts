// AI Service Integration for PeachieGlow
// Handles GlowBot conversations, skin analysis, and recommendations

import { GlowBotMessage, SkinAnalysis, SkinForecast, User, HabitEntry } from '@/types/user';

// Mock AI responses for demo (replace with real AI API in production)
export class AIService {
  private static instance: AIService;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // GlowBot AI Chat
  async generateGlowBotResponse(
    userMessage: string,
    context: {
      user: User;
      recentAnalysis?: SkinAnalysis;
      currentHabits: HabitEntry[];
      conversationHistory: GlowBotMessage[];
    }
  ): Promise<string> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const { user, recentAnalysis, currentHabits } = context;
    const lowerMessage = userMessage.toLowerCase();

    // Context-aware responses based on user data
    if (lowerMessage.includes('routine') || lowerMessage.includes('schedule')) {
      const completedToday = currentHabits.filter(h => 
        h.completed && h.date.toDateString() === new Date().toDateString()
      ).length;
      
      return `Great question! Based on your ${user.skinType} skin type and current ${user.glowScore} GlowScore, I see you've completed ${completedToday} tasks today. For your ${user.skinConcerns.join(' and ')} concerns, I recommend focusing on consistency with your morning cleanser and vitamin C serum. Your ${user.currentStreak}-day streak is amazing! 🌟`;
    }

    if (lowerMessage.includes('skin') || lowerMessage.includes('analysis')) {
      if (recentAnalysis) {
        const topImprovement = recentAnalysis.improvements[0];
        return `Looking at your latest skin analysis, your overall score is ${recentAnalysis.overallScore}/100! Your ${topImprovement?.category} has improved by ${topImprovement?.percentage}% - that's fantastic progress! The AI detected that your consistency with hydrating products is really paying off. Keep up the great work! ✨`;
      }
      return `I'd love to help analyze your skin! Based on your profile, your ${user.skinType} skin with ${user.skinConcerns.join(' and ')} concerns would benefit from a consistent routine. Your current GlowScore of ${user.glowScore} shows you're on the right track! 🎯`;
    }

    if (lowerMessage.includes('product') || lowerMessage.includes('recommend')) {
      const skinTypeAdvice = this.getSkinTypeRecommendations(user.skinType);
      return `For your ${user.skinType} skin, I recommend: ${skinTypeAdvice}. Given your concerns about ${user.skinConcerns.join(' and ')}, consistency is key! Your ${user.currentStreak}-day streak proves you've got this! 💪`;
    }

    if (lowerMessage.includes('streak') || lowerMessage.includes('motivation')) {
      return `Your ${user.currentStreak}-day streak is incredible! 🔥 You're at level ${user.level} with ${user.xp} XP. Remember, even small consistent actions compound into amazing results. Your skin is already thanking you - keep glowing! ✨`;
    }

    if (lowerMessage.includes('concern') || lowerMessage.includes('problem')) {
      const concernAdvice = user.skinConcerns.map(concern => 
        this.getConcernAdvice(concern)
      ).join(' ');
      return `I understand your concerns about ${user.skinConcerns.join(' and ')}. ${concernAdvice} Your dedication with a ${user.currentStreak}-day streak is exactly what will help address these issues! 🌟`;
    }

    // Default encouraging responses
    const defaultResponses = [
      `Hi there! I'm so excited to help you on your skincare journey! With your ${user.skinType} skin and ${user.glowScore} GlowScore, you're doing amazing. What would you like to know about your routine? ✨`,
      `Your ${user.currentStreak}-day streak is inspiring! 🔥 As your AI skincare companion, I'm here to help optimize your routine for your ${user.skinType} skin. What's on your mind?`,
      `Level ${user.level} and ${user.xp} XP - you're crushing it! 💪 Your consistency with skincare is paying off. How can I help you glow even brighter today?`,
      `I love seeing your progress! Your skin analysis shows real improvement, and your ${user.currentStreak}-day streak proves dedication works. What would you like to explore next? 🌟`
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  private getSkinTypeRecommendations(skinType: string): string {
    const recommendations = {
      oily: 'gentle foaming cleansers, niacinamide serums, and lightweight moisturizers',
      dry: 'cream cleansers, hyaluronic acid serums, and rich moisturizers',
      combination: 'balanced cleansers, targeted treatments, and adaptive moisturizing',
      sensitive: 'fragrance-free products, gentle ingredients, and barrier repair',
      normal: 'maintaining balance with antioxidants and consistent hydration'
    };
    return recommendations[skinType as keyof typeof recommendations] || 'products suited to your unique skin needs';
  }

  private getConcernAdvice(concern: string): string {
    const advice = {
      acne: 'Salicylic acid and consistent cleansing can help manage breakouts.',
      'dark spots': 'Vitamin C and retinol are excellent for evening skin tone.',
      hydration: 'Hyaluronic acid and ceramides will boost moisture levels.',
      wrinkles: 'Retinol and peptides can help with anti-aging concerns.',
      redness: 'Niacinamide and gentle ingredients can calm irritation.'
    };
    return advice[concern as keyof typeof advice] || 'Consistent care will help address this concern.';
  }

  // AI Skin Analysis Generation
  async generateSkinAnalysis(user: User, previousAnalysis?: SkinAnalysis): Promise<SkinAnalysis> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    const baseScore = previousAnalysis?.overallScore || 60;
    const improvement = Math.random() * 10 - 2; // -2 to +8 improvement
    const newScore = Math.max(30, Math.min(100, Math.round(baseScore + improvement)));

    const analysis: SkinAnalysis = {
      id: `analysis-${Date.now()}`,
      userId: user.id,
      date: new Date(),
      overallScore: newScore,
      hydrationLevel: Math.round(newScore + (Math.random() * 20 - 10)),
      acneScore: Math.round(Math.max(0, 100 - (user.skinConcerns.includes('acne') ? 30 : 10) + (Math.random() * 20 - 10))),
      wrinkleScore: Math.round(Math.max(0, 100 - (user.age || 25) + (Math.random() * 15 - 5))),
      darknessScore: Math.round(Math.max(0, 100 - (user.skinConcerns.includes('dark spots') ? 25 : 5) + (Math.random() * 15 - 5))),
      rednessScore: Math.round(Math.max(0, 100 - (user.skinType === 'sensitive' ? 20 : 5) + (Math.random() * 15 - 5))),
      improvements: [
        {
          category: 'Hydration',
          percentage: Math.round(Math.random() * 15 + 5),
          description: 'Your consistent use of moisturizing products is showing great results!'
        },
        {
          category: 'Texture',
          percentage: Math.round(Math.random() * 12 + 3),
          description: 'Regular cleansing routine has improved skin smoothness.'
        },
        {
          category: 'Radiance',
          percentage: Math.round(Math.random() * 18 + 7),
          description: 'Your dedication to the routine is giving you that healthy glow!'
        }
      ],
      concerns: this.generateConcerns(user),
      recommendations: this.generateRecommendations(user, newScore),
      nextCheckIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };

    return analysis;
  }

  private generateConcerns(user: User): SkinAnalysis['concerns'] {
    const concerns: SkinAnalysis['concerns'] = [];
    
    user.skinConcerns.forEach(concern => {
      concerns.push({
        category: concern,
        severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        description: `${concern} requires continued attention with targeted treatments.`
      });
    });

    return concerns;
  }

  private generateRecommendations(user: User, currentScore: number): SkinAnalysis['recommendations'] {
    const recommendations: SkinAnalysis['recommendations'] = [];

    if (currentScore < 70) {
      recommendations.push({
        type: 'routine',
        title: 'Increase Consistency',
        description: 'Focus on completing your daily routine to see faster improvements.',
        priority: 'high'
      });
    }

    if (user.skinConcerns.includes('hydration')) {
      recommendations.push({
        type: 'product',
        title: 'Hyaluronic Acid Serum',
        description: 'Add a hydrating serum to boost moisture levels.',
        priority: 'medium'
      });
    }

    recommendations.push({
      type: 'lifestyle',
      title: 'Stay Hydrated',
      description: 'Drink plenty of water and get adequate sleep for healthy skin.',
      priority: 'medium'
    });

    return recommendations;
  }

  // AI Skin Forecast Generation
  async generateSkinForecast(user: User, recentAnalyses: SkinAnalysis[]): Promise<SkinForecast> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2500));

    const currentScore = recentAnalyses[recentAnalyses.length - 1]?.overallScore || user.glowScore;
    const trend = recentAnalyses.length > 1 ? 
      recentAnalyses[recentAnalyses.length - 1].overallScore - recentAnalyses[recentAnalyses.length - 2].overallScore : 0;

    const forecast: SkinForecast = {
      id: `forecast-${Date.now()}`,
      userId: user.id,
      generatedAt: new Date(),
      forecastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      predictions: [
        {
          category: 'Overall Health',
          currentScore: currentScore,
          predictedScore: Math.min(100, Math.max(30, currentScore + trend + Math.random() * 15)),
          confidence: 85 + Math.random() * 10,
          factors: ['routine consistency', 'product effectiveness', 'lifestyle habits']
        },
        {
          category: 'Hydration',
          currentScore: Math.round(currentScore + (Math.random() * 20 - 10)),
          predictedScore: Math.round(currentScore + trend + Math.random() * 12),
          confidence: 78 + Math.random() * 15,
          factors: ['moisturizer usage', 'water intake', 'environmental factors']
        },
        {
          category: 'Texture',
          currentScore: Math.round(currentScore + (Math.random() * 15 - 5)),
          predictedScore: Math.round(currentScore + trend + Math.random() * 10),
          confidence: 82 + Math.random() * 12,
          factors: ['exfoliation routine', 'cleansing consistency', 'product absorption']
        }
      ],
      recommendations: {
        immediate: [
          'Continue your current streak - consistency is key!',
          'Focus on hydrating products for the next week',
          'Ensure proper cleansing before bed'
        ],
        shortTerm: [
          'Consider adding a weekly exfoliation treatment',
          'Monitor how your skin responds to current products',
          'Maintain your current routine for best results'
        ],
        longTerm: [
          'Gradually introduce anti-aging ingredients',
          'Consider seasonal routine adjustments',
          'Track progress with regular skin analyses'
        ]
      },
      aiInsights: `Based on your ${user.currentStreak}-day streak and ${user.skinType} skin type, the AI predicts continued improvement. Your consistency with the routine is the strongest predictor of success. Keep up the amazing work! 🌟`
    };

    return forecast;
  }

  // Achievement Analysis
  async analyzeAchievementProgress(user: User, habits: HabitEntry[]): Promise<{
    nearbyAchievements: { id: string; title: string; progress: number; daysToUnlock: number }[];
    motivationalMessage: string;
  }> {
    const completedHabits = habits.filter(h => h.completed);
    const streakProgress = (user.currentStreak / 30) * 100; // Assuming 30-day milestone
    const consistencyRate = habits.length > 0 ? (completedHabits.length / habits.length) * 100 : 0;

    const nearbyAchievements = [
      {
        id: 'streak-30',
        title: 'Monthly Master',
        progress: Math.min(100, streakProgress),
        daysToUnlock: Math.max(0, 30 - user.currentStreak)
      },
      {
        id: 'consistency-90',
        title: 'Consistency Champion',
        progress: Math.min(100, consistencyRate),
        daysToUnlock: consistencyRate >= 90 ? 0 : Math.ceil((90 - consistencyRate) / 10)
      }
    ];

    const motivationalMessage = user.currentStreak > 20 
      ? `You're on fire! 🔥 ${user.currentStreak} days strong and climbing!`
      : user.currentStreak > 7
      ? `Great momentum! 💪 Keep building that streak!`
      : `Every day counts! 🌱 You're building something amazing!`;

    return { nearbyAchievements, motivationalMessage };
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();
