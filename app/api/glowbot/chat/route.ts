import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { aiService } from '@/lib/ai-service';
import { GlowBotMessage, GlowBotConversation } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const { message, userId, conversationId } = await request.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and userId are required' },
        { status: 400 }
      );
    }

    // Get user context
    const user = await db.getUser(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get additional context
    const recentAnalysis = await db.getLatestSkinAnalysis(userId);
    const currentHabits = await db.getHabitEntries(userId, new Date());
    const conversations = await db.getConversations(userId);
    
    let conversation: GlowBotConversation;
    
    if (conversationId) {
      // Find existing conversation
      conversation = conversations.find(c => c.id === conversationId) || conversations[0];
    } else {
      // Create new conversation
      conversation = {
        id: `conv-${Date.now()}`,
        userId,
        messages: [],
        context: {
          skinType: user.skinType,
          recentAnalysis: recentAnalysis || undefined,
          currentHabits,
          userConcerns: user.skinConcerns
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.addConversation(conversation);
    }

    // Add user message
    const userMessage: GlowBotMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    conversation.messages.push(userMessage);

    // Generate AI response
    const aiResponse = await aiService.generateGlowBotResponse(message, {
      user,
      recentAnalysis: recentAnalysis || undefined,
      currentHabits,
      conversationHistory: conversation.messages
    });

    // Add AI message
    const aiMessage: GlowBotMessage = {
      id: `msg-${Date.now()}-ai`,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      metadata: {
        analysisReferenced: !!recentAnalysis && message.toLowerCase().includes('analysis'),
        recommendationGiven: aiResponse.includes('recommend'),
        habitSuggested: aiResponse.includes('routine') || aiResponse.includes('habit')
      }
    };

    conversation.messages.push(aiMessage);
    conversation.updatedAt = new Date();

    // Update conversation in database
    await db.updateConversation(conversation.id, conversation);

    // Add activity
    await db.addActivity({
      id: `activity-${Date.now()}`,
      userId,
      type: 'habit_completed',
      description: 'Had a conversation with GlowBot',
      timestamp: new Date(),
      metadata: {
        habitId: 'ai-chat'
      }
    });

    return NextResponse.json({
      message: aiMessage,
      conversationId: conversation.id,
      context: {
        userGlowScore: user.glowScore,
        currentStreak: user.currentStreak,
        hasRecentAnalysis: !!recentAnalysis
      }
    });

  } catch (error) {
    console.error('GlowBot chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
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

    const conversations = await db.getConversations(userId);
    
    return NextResponse.json({
      conversations: conversations.map(conv => ({
        id: conv.id,
        messageCount: conv.messages.length,
        lastMessage: conv.messages[conv.messages.length - 1],
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt
      }))
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: 'Failed to get conversations' },
      { status: 500 }
    );
  }
}
