import { motion } from 'framer-motion';
import PeachieGlowHeader from '@/components/PeachieGlowHeader';
import PeachieGlowHero from '@/components/PeachieGlowHero';
import GlowBot, { GlowBotGreeting, GlowBotCelebration } from '@/components/GlowBot';
import GlowScoreTracker from '@/components/GlowScoreTracker';
import AchievementSystem from '@/components/AchievementSystem';
import SkinForecast from '@/components/SkinForecast';
import DailyHabitTracker from '@/components/DailyHabitTracker';
import SocialProof from '@/components/SocialProof';
import { Metadata } from 'next';

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'PeachieGlow - AI-Powered Skincare SaaS Platform',
  description: 'Transform your skincare routine with PeachieGlow\'s AI-powered platform. Get personalized skincare advice from GlowBot, track your progress with GlowScore, and achieve radiant skin with our gamified habit-forming system.',
  keywords: 'AI skincare, personalized skincare, skincare SaaS, GlowBot, skincare tracking, beauty AI, skincare habits',
};

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <PeachieGlowHeader />
      
      {/* Hero Section */}
      <PeachieGlowHero />
      
      {/* Main Features Section */}
      <div className="container mx-auto px-6 py-20 space-y-12">
        
        {/* GlowBot AI Assistant */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet GlowBot - Your AI Skincare Assistant</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get personalized skincare advice, product recommendations, and expert guidance powered by advanced AI.</p>
          </div>
          <div className="flex items-center justify-center">
            <GlowBot size="large" />
          </div>
        </section>

        {/* GlowScore Tracker */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Track Your Glow Progress</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Monitor your skincare journey with our intelligent GlowScore system that adapts to your progress.</p>
          </div>
          <GlowScoreTracker />
        </section>

        {/* Achievement System */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Unlock Skincare Achievements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Gamify your skincare journey with our achievement system that rewards consistency and progress.</p>
          </div>
          <AchievementSystem />
        </section>

        {/* Skin Forecast */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">AI Skin Forecast</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get personalized predictions and recommendations based on your skin analysis and habits.</p>
          </div>
          <SkinForecast />
        </section>

        {/* Daily Habit Tracker */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Daily Skincare Habits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Build consistent skincare habits with our intelligent tracking and reminder system.</p>
          </div>
          <DailyHabitTracker />
        </section>

        {/* Social Proof */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Join the Glow Community</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">See what other users are saying about their PeachieGlow transformation journey.</p>
          </div>
          <SocialProof />
        </section>
        
      </div>
    </div>
  );
}
