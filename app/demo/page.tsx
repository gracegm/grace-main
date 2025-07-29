"use client";

import { motion } from 'framer-motion';
import PeachieGlowHeader from '@/components/PeachieGlowHeader';
import PeachieGlowHero from '@/components/PeachieGlowHero';
import GlowBot, { GlowBotGreeting, GlowBotCelebration } from '@/components/GlowBot';
import GlowScoreTracker from '@/components/GlowScoreTracker';
import AchievementSystem from '@/components/AchievementSystem';
import SkinForecast from '@/components/SkinForecast';
import DailyHabitTracker from '@/components/DailyHabitTracker';
import SocialProof from '@/components/SocialProof';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <PeachieGlowHeader />
      
      {/* Hero Section */}
      <PeachieGlowHero />
      
      {/* Demo Components Section */}
      <div className="container mx-auto px-6 py-20 space-y-12">
        
        {/* GlowBot Variants */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">GlowBot AI Character</h2>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <GlowBot size="small" />
              <p className="text-sm text-gray-600 mt-2">Small</p>
            </div>
            <div className="text-center">
              <GlowBot size="medium" />
              <p className="text-sm text-gray-600 mt-2">Medium</p>
            </div>
            <div className="text-center">
              <GlowBot size="large" />
              <p className="text-sm text-gray-600 mt-2">Large</p>
            </div>
            <div className="text-center">
              <GlowBotGreeting />
              <p className="text-sm text-gray-600 mt-2">Greeting</p>
            </div>
          </div>
        </section>

        {/* GlowScore Tracker */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">GlowScore Tracking System</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlowScoreTracker />
            <GlowScoreTracker compact={true} className="lg:self-start" />
          </div>
        </section>

        {/* Achievement System */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Achievement System</h2>
          <AchievementSystem className="max-w-4xl mx-auto" />
        </section>

        {/* AI-Powered SkinForecast */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🔮 AI-Powered SkinForecast</h2>
          <SkinForecast className="max-w-4xl mx-auto" />
        </section>

        {/* Daily Habit Tracker */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Daily Habit Tracker</h2>
          <DailyHabitTracker className="max-w-4xl mx-auto" />
        </section>

        {/* Social Proof */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">👥 Social Proof & Live Activity</h2>
          <SocialProof className="max-w-4xl mx-auto" />
        </section>

        {/* Completion Summary */}
        <section className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🎉 Interactive Features Demo Complete!</h2>
            <p className="text-lg text-gray-600 mb-8">
              You've experienced all the AI-powered, gamified features of PeachieGlow. From habit tracking to skin forecasting to social proof - everything is designed to make skincare addictive and effective!
            </p>
            <motion.button
              className="bg-gradient-to-r from-[#FFB5A7] to-[#FF8A80] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 181, 167, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Glow Journey ✨
            </motion.button>
          </motion.div>
        </section>

        {/* Component Summary */}
        <section className="bg-gradient-to-r from-[#FFB5A7] to-[#FF8A80] rounded-2xl p-8 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <GlowBotCelebration />
            <div>
              <h2 className="text-2xl font-bold">🎉 Step 2 Complete!</h2>
              <p className="text-white/90">Core UI Components Development</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold mb-2">Hero Section</h3>
              <p className="text-sm text-white/90">Animated landing with GlowScore counter</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold mb-2">GlowBot AI</h3>
              <p className="text-sm text-white/90">Interactive AI character assistant</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold mb-2">GlowScore Tracker</h3>
              <p className="text-sm text-white/90">Gamified progress tracking</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-bold mb-2">Achievements</h3>
              <p className="text-sm text-white/90">Badge system with rarities</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
