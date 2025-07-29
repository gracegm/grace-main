"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlowBot from './GlowBot';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'consistency' | 'milestone' | 'special';
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementSystemProps {
  achievements?: Achievement[];
  showUnlockedOnly?: boolean;
  compact?: boolean;
  className?: string;
}

const defaultAchievements: Achievement[] = [
  {
    id: 'first-week',
    title: '7-Day AI Warrior',
    description: 'Complete your first week with GlowBot guidance',
    icon: '⚔️',
    category: 'streak',
    requirement: 7,
    progress: 7,
    unlocked: true,
    unlockedDate: '2025-01-15',
    rarity: 'common'
  },
  {
    id: 'month-champion',
    title: '30-Day AI Champion',
    description: 'Maintain your GlowScore for 30 consecutive days',
    icon: '🏆',
    category: 'streak',
    requirement: 30,
    progress: 30,
    unlocked: true,
    unlockedDate: '2025-02-10',
    rarity: 'rare'
  },
  {
    id: 'consistency-queen',
    title: 'AI Consistency Queen',
    description: 'Complete 90% of daily tasks for 2 weeks',
    icon: '👑',
    category: 'consistency',
    requirement: 14,
    progress: 14,
    unlocked: true,
    unlockedDate: '2025-02-20',
    rarity: 'epic'
  },
  {
    id: 'hundred-days',
    title: '100-Day AI Legend',
    description: 'Reach the legendary 100-day GlowScore milestone',
    icon: '🌟',
    category: 'milestone',
    requirement: 100,
    progress: 100,
    unlocked: true,
    unlockedDate: '2025-03-15',
    rarity: 'legendary'
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week Achiever',
    description: 'Complete all daily tasks for 7 consecutive days',
    icon: '💎',
    category: 'consistency',
    requirement: 7,
    progress: 5,
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'early-bird',
    title: 'Morning Glow Getter',
    description: 'Complete morning routine before 8 AM for 10 days',
    icon: '🌅',
    category: 'special',
    requirement: 10,
    progress: 8,
    unlocked: false,
    rarity: 'common'
  }
];

const AchievementSystem = ({
  achievements = defaultAchievements,
  showUnlockedOnly = false,
  compact = false,
  className = ""
}: AchievementSystemProps) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const filteredAchievements = showUnlockedOnly 
    ? achievements.filter(a => a.unlocked)
    : achievements;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  if (compact) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-4 border border-gray-100 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Achievements</h3>
          <span className="text-sm text-gray-600">{unlockedCount}/{totalCount}</span>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filteredAchievements.slice(0, 4).map((achievement) => (
            <motion.div
              key={achievement.id}
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 ${
                achievement.unlocked 
                  ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} ${getRarityBorder(achievement.rarity)} text-white`
                  : 'bg-gray-100 border-gray-200 text-gray-400'
              }`}
              whileHover={{ scale: 1.1 }}
              onClick={() => setSelectedAchievement(achievement)}
            >
              {achievement.unlocked ? achievement.icon : '🔒'}
            </motion.div>
          ))}
          {filteredAchievements.length > 4 && (
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-xs text-gray-500">
              +{filteredAchievements.length - 4}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <GlowBot size="medium" message="Look at all these amazing achievements! 🏆" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">AI-Curated Achievements</h3>
            <p className="text-gray-600">Your skincare journey milestones</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-[#FFD700]">{unlockedCount}/{totalCount}</div>
          <div className="text-sm text-gray-500">Unlocked</div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-600">{Math.round((unlockedCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FFD700] to-[#FF8A80] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              achievement.unlocked
                ? `bg-gradient-to-br from-white to-gray-50 ${getRarityBorder(achievement.rarity)} hover:shadow-lg`
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedAchievement(achievement)}
          >
            {/* Rarity Glow Effect */}
            {achievement.unlocked && achievement.rarity !== 'common' && (
              <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(achievement.rarity)} opacity-10 rounded-xl`} />
            )}
            
            <div className="relative z-10">
              {/* Icon and Status */}
              <div className="flex items-center justify-between mb-3">
                <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                {achievement.unlocked && (
                  <div className={`px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Title and Description */}
              <h4 className={`font-bold mb-1 ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                {achievement.title}
              </h4>
              <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                {achievement.description}
              </p>

              {/* Progress Bar */}
              {!achievement.unlocked && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.requirement}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#FFB5A7] to-[#FF8A80] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              {/* Unlock Date */}
              {achievement.unlocked && achievement.unlockedDate && (
                <div className="text-xs text-gray-500">
                  Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next Achievement Preview */}
      <div className="bg-gradient-to-r from-[#FFB5A7]/10 to-[#00D4AA]/10 rounded-xl p-4 border border-[#FFB5A7]/20">
        <h4 className="font-semibold text-gray-800 mb-2">Next Achievement</h4>
        {(() => {
          const nextAchievement = achievements.find(a => !a.unlocked);
          return nextAchievement ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl opacity-50">🔒</div>
                <div>
                  <div className="font-medium text-gray-700">{nextAchievement.title}</div>
                  <div className="text-sm text-gray-600">
                    {nextAchievement.requirement - nextAchievement.progress} more to unlock
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#00D4AA]">
                  {Math.round((nextAchievement.progress / nextAchievement.requirement) * 100)}%
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">All achievements unlocked! 🎉</p>
          );
        })()}
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{selectedAchievement.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedAchievement.title}
                </h3>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(selectedAchievement.rarity)} mb-3`}>
                  {selectedAchievement.rarity.toUpperCase()}
                </div>
                <p className="text-gray-600 mb-4">{selectedAchievement.description}</p>
                
                {selectedAchievement.unlocked ? (
                  <div className="text-sm text-gray-500">
                    Unlocked on {selectedAchievement.unlockedDate && new Date(selectedAchievement.unlockedDate).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      Progress: {selectedAchievement.progress}/{selectedAchievement.requirement}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-full bg-gradient-to-r from-[#FFB5A7] to-[#FF8A80] rounded-full"
                        style={{ width: `${(selectedAchievement.progress / selectedAchievement.requirement) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <button
                className="w-full bg-gradient-to-r from-[#00D4AA] to-[#4CAF50] text-white py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
                onClick={() => setSelectedAchievement(null)}
              >
                {selectedAchievement.unlocked ? 'Awesome! 🌟' : 'Keep Going! 💪'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementSystem;
