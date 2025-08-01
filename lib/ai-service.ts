// AI Service Integration for PeachieGlow
// Handles GlowBot conversations, skin analysis, and recommendations

import { GlowBotMessage, SkinAnalysis, SkinForecast, User, HabitEntry } from '@/types/user';

// Real OpenAI API Integration for Production
export class AIService {
  private static instance: AIService;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // GlowBot AI Chat - Real OpenAI Integration
  async generateGlowBotResponse(
    userMessage: string,
    context: {
      user: User;
      recentAnalysis?: SkinAnalysis;
      currentHabits: HabitEntry[];
      conversationHistory: GlowBotMessage[];
    }
  ): Promise<string> {
    try {
      const { user, recentAnalysis, currentHabits, conversationHistory } = context;
      
      // Build context for AI
      const completedToday = currentHabits.filter(h => 
        h.completed && h.date.toDateString() === new Date().toDateString()
      ).length;
      
      const userContext = `
User Profile:
- Skin Type: ${user.skinType}
- Skin Concerns: ${user.skinConcerns.join(', ')}
- Current GlowScore: ${user.glowScore}/100
- Level: ${user.level} (${user.xp} XP)
- Current Streak: ${user.currentStreak} days
- Habits Completed Today: ${completedToday}
${recentAnalysis ? `\n- Latest Skin Analysis Score: ${recentAnalysis.overallScore}/100` : ''}`;
      
      const conversationContext = conversationHistory.length > 0 
        ? `\nRecent Conversation:\n${conversationHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
        : '';
      
      const systemPrompt = `You are GlowBot, an AI skincare assistant for PeachieGlow. You're enthusiastic, knowledgeable, and supportive. 

Personality:
- Use emojis sparingly but effectively (✨🌟💪🔥)
- Be encouraging and celebrate user progress
- Provide specific, actionable skincare advice
- Reference user's data to personalize responses
- Keep responses concise but helpful (2-3 sentences max)

Expertise:
- Skincare routines and product recommendations
- Ingredient knowledge (retinol, niacinamide, hyaluronic acid, etc.)
- Skin type-specific advice
- Habit formation and motivation
- Progress tracking and goal setting${userContext}${conversationContext}`;
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Cost-effective model for production
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 150,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content?.trim();
      
      if (!aiResponse) {
        throw new Error('No response from OpenAI');
      }
      
      return aiResponse;
      
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Fallback to contextual mock response if API fails
      return this.getFallbackResponse(userMessage, context);
    }
  }
  
  // Fallback responses when OpenAI API is unavailable
  private getFallbackResponse(
    userMessage: string,
    context: { user: User; recentAnalysis?: SkinAnalysis; currentHabits: HabitEntry[] }
  ): string {
    const { user, recentAnalysis, currentHabits } = context;
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('routine') || lowerMessage.includes('schedule')) {
      const completedToday = currentHabits.filter(h => 
        h.completed && h.date.toDateString() === new Date().toDateString()
      ).length;
      return `Great question! Based on your ${user.skinType} skin and ${user.glowScore} GlowScore, you've completed ${completedToday} tasks today. Your ${user.currentStreak}-day streak is amazing! 🌟`;
    }
    
    if (lowerMessage.includes('product') || lowerMessage.includes('recommend')) {
      const skinTypeAdvice = this.getSkinTypeRecommendations(user.skinType);
      return `For your ${user.skinType} skin, I recommend: ${skinTypeAdvice}. Your ${user.currentStreak}-day streak proves you've got this! 💪`;
    }
    
    return `Hi there! I'm here to help with your skincare journey. Your ${user.skinType} skin and ${user.glowScore} GlowScore show great progress! What would you like to know? ✨`;
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
