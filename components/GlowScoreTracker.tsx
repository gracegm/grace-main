"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlowBot from './GlowBot';

interface GlowScoreData {
  currentStreak: number;
  totalDays: number;
  weekProgress: boolean[];
  achievements: string[];
  level: number;
}

interface GlowScoreTrackerProps {
  data?: GlowScoreData;
  showCelebration?: boolean;
  compact?: boolean;
  className?: string;
}

const GlowScoreTracker = ({ 
  data = {
    currentStreak: 127,
    totalDays: 156,
    weekProgress: [true, true, true, true, true, false, false],
    achievements: ['7-day warrior', '30-day champion', '100-day legend'],
    level: 8
  },
  showCelebration = false,
  compact = false,
  className = ""
}: GlowScoreTrackerProps) => {
  const [animateScore, setAnimateScore] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    // Trigger score animation on mount
    const timer = setTimeout(() => setAnimateScore(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showCelebration) {
      setShowAchievement(true);
      const timer = setTimeout(() => setShowAchievement(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const completedDays = data.weekProgress.filter(Boolean).length;
  const progressPercentage = (completedDays / 7) * 100;

  if (compact) {
    return (
      <div className={`bg-gradient-to-r from-[#FFB5A7]/20 to-[#FF8A80]/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GlowBot size="small" animated={false} />
            <div>
              <div className="flex items-center space-x-2">
                <motion.span
                  className="text-2xl font-bold text-[#FFD700]"
                  animate={animateScore ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  {data.currentStreak}
                </motion.span>
                <span className="text-gray-700 font-medium">day streak</span>
              </div>
              <p className="text-sm text-gray-600">Level {data.level} GlowScore</p>
            </div>
          </div>
          
          {/* Mini Progress Ring */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" stroke="#FFB5A7" strokeWidth="3" fill="none" opacity="0.3" />
              <motion.circle
                cx="24" cy="24" r="20"
                stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progressPercentage / 100 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700">{completedDays}/7</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <GlowBot size="medium" message="Amazing progress! Keep it up! 🔥" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">Your GlowScore</h3>
            <p className="text-gray-600">Building healthy habits daily</p>
          </div>
        </div>
        
        {/* Level Badge */}
        <div className="bg-gradient-to-r from-[#FFD700] to-[#FF8A80] text-white px-4 py-2 rounded-full font-bold">
          Level {data.level}
        </div>
      </div>

      {/* Main Score Display */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-baseline space-x-2 mb-2"
          animate={animateScore ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-5xl font-bold text-[#FFD700]">{data.currentStreak}</span>
          <span className="text-xl text-gray-600 font-medium">day streak</span>
        </motion.div>
        <p className="text-gray-500">Out of {data.totalDays} total days</p>
        
        {/* Streak Fire Animation */}
        <motion.div
          className="text-4xl mt-2"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🔥
        </motion.div>
      </div>

      {/* Weekly Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">This Week's Progress</h4>
          <span className="text-sm text-gray-600">{completedDays}/7 days</span>
        </div>
        
        <div className="flex space-x-2 mb-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <motion.div
              key={day}
              className="flex-1 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-xs text-gray-500 mb-1">{day}</div>
              <motion.div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${
                  data.weekProgress[index]
                    ? 'bg-gradient-to-r from-[#4CAF50] to-[#00D4AA] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
                whileHover={{ scale: 1.1 }}
                animate={data.weekProgress[index] ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {data.weekProgress[index] ? '✓' : '○'}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#4CAF50] to-[#00D4AA] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Recent Achievements</h4>
        <div className="flex flex-wrap gap-2">
          {data.achievements.map((achievement, index) => (
            <motion.div
              key={achievement}
              className="bg-gradient-to-r from-[#FFD700]/20 to-[#FF8A80]/20 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-[#FFD700]/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              🏆 {achievement}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next Milestone */}
      <div className="bg-gradient-to-r from-[#FFB5A7]/10 to-[#00D4AA]/10 rounded-xl p-4 border border-[#FFB5A7]/20">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-semibold text-gray-800">Next Milestone</h5>
            <p className="text-sm text-gray-600">150-day GlowScore Legend</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-[#00D4AA]">
              {150 - data.currentStreak} days to go
            </div>
            <div className="text-xs text-gray-500">Keep the streak alive!</div>
          </div>
        </div>
      </div>

      {/* Achievement Celebration */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 text-center max-w-sm mx-4"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">New Achievement!</h3>
              <p className="text-gray-600 mb-4">You've unlocked a new milestone!</p>
              <motion.button
                className="bg-gradient-to-r from-[#00D4AA] to-[#4CAF50] text-white px-6 py-2 rounded-full font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAchievement(false)}
              >
                Awesome! 🌟
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlowScoreTracker;
