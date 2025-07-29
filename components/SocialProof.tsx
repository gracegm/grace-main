"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlowBot from './GlowBot';

interface UserActivity {
  id: string;
  userName: string;
  action: string;
  timeAgo: string;
  glowScore: number;
  location: string;
}

interface Testimonial {
  id: string;
  name: string;
  age: number;
  glowScore: number;
  daysUsing: number;
  testimonial: string;
  beforeAfter?: {
    improvement: string;
    percentage: number;
  };
  verified: boolean;
}

interface SocialProofProps {
  className?: string;
}

const SocialProof = ({ className = "" }: SocialProofProps) => {
  const [liveUserCount, setLiveUserCount] = useState(10247);
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([
    {
      id: '1',
      userName: 'Sarah M.',
      action: 'completed her 89-day GlowScore milestone',
      timeAgo: '2 minutes ago',
      glowScore: 89,
      location: 'California'
    },
    {
      id: '2',
      userName: 'Emma K.',
      action: 'unlocked "AI Consistency Queen" achievement',
      timeAgo: '5 minutes ago',
      glowScore: 45,
      location: 'New York'
    },
    {
      id: '3',
      userName: 'Jessica L.',
      action: 'started her skincare journey with GlowBot',
      timeAgo: '8 minutes ago',
      glowScore: 1,
      location: 'Texas'
    },
    {
      id: '4',
      userName: 'Maya P.',
      action: 'reached 156-day GlowScore legend status',
      timeAgo: '12 minutes ago',
      glowScore: 156,
      location: 'Florida'
    }
  ]);

  const [featuredTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      age: 29,
      glowScore: 127,
      daysUsing: 127,
      testimonial: "I'm on day 127 and my PeachieGlow GlowBot literally knows my skin better than I do! The AI GlowScore system made skincare as addictive as checking Instagram!",
      beforeAfter: {
        improvement: "Skin hydration increased",
        percentage: 89
      },
      verified: true
    },
    {
      id: '2',
      name: 'Emma Rodriguez',
      age: 31,
      glowScore: 89,
      daysUsing: 89,
      testimonial: "The GlowBot's daily SkinForecast for my acne scars kept me motivated. Seeing my AI-analyzed progress score go up every week was like leveling up in a game!",
      beforeAfter: {
        improvement: "Acne scar visibility reduced",
        percentage: 67
      },
      verified: true
    },
    {
      id: '3',
      name: 'Jessica Martinez',
      age: 27,
      glowScore: 156,
      daysUsing: 156,
      testimonial: "I've never stuck to a skincare routine for more than 2 weeks. My GlowBot got me to day 156 and my skin has never looked better!",
      beforeAfter: {
        improvement: "Overall skin texture improved",
        percentage: 78
      },
      verified: true
    }
  ]);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Simulate live user count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUserCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate new user activities
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: UserActivity = {
        id: Date.now().toString(),
        userName: `User ${Math.floor(Math.random() * 1000)}`,
        action: 'just joined PeachieGlow',
        timeAgo: 'just now',
        glowScore: 1,
        location: ['California', 'New York', 'Texas', 'Florida', 'Illinois'][Math.floor(Math.random() * 5)]
      };

      setRecentActivities(prev => [newActivity, ...prev.slice(0, 3)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % featuredTestimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [featuredTestimonials.length]);

  const getGlowScoreColor = (score: number) => {
    if (score >= 100) return "text-[#FFD700]";
    if (score >= 50) return "text-[#4CAF50]";
    if (score >= 20) return "text-[#00D4AA]";
    return "text-[#FF8A80]";
  };

  const getGlowScoreBadge = (score: number) => {
    if (score >= 150) return "🌟 Legend";
    if (score >= 100) return "👑 Champion";
    if (score >= 50) return "⭐ Warrior";
    if (score >= 20) return "💎 Rising Star";
    return "🌱 Beginner";
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <GlowBot size="medium" message="Look at all these amazing transformations! 🌟" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">Social Proof</h3>
            <p className="text-gray-600">Real results from real users</p>
          </div>
        </div>
        
        {/* Live User Counter */}
        <div className="text-right">
          <motion.div
            className="text-2xl font-bold text-[#00D4AA]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {liveUserCount.toLocaleString()}+
          </motion.div>
          <div className="text-sm text-gray-500">Active Users</div>
          <div className="flex items-center justify-end mt-1">
            <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse mr-1"></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="text-lg mr-2">📈</span>
          Live Activity Feed
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FFB5A7]/10 to-[#00D4AA]/10 rounded-lg border border-[#FFB5A7]/20"
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#FFB5A7] to-[#FF8A80] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {activity.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      <span className="font-semibold">{activity.userName}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.timeAgo} • {activity.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${getGlowScoreColor(activity.glowScore)}`}>
                    {activity.glowScore} days
                  </div>
                  <div className="text-xs text-gray-500">
                    {getGlowScoreBadge(activity.glowScore)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Featured Testimonials */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="text-lg mr-2">💬</span>
          Featured Success Stories
        </h4>
        
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              className="bg-gradient-to-br from-[#FFB5A7]/10 to-[#00D4AA]/10 rounded-xl p-6 border border-[#FFB5A7]/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FFB5A7] to-[#FF8A80] rounded-full flex items-center justify-center text-white font-bold">
                    {featuredTestimonials[currentTestimonial].name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 flex items-center">
                      {featuredTestimonials[currentTestimonial].name}
                      {featuredTestimonials[currentTestimonial].verified && (
                        <span className="ml-2 text-[#00D4AA]">✓</span>
                      )}
                    </h5>
                    <p className="text-sm text-gray-600">
                      Age {featuredTestimonials[currentTestimonial].age} • 
                      {featuredTestimonials[currentTestimonial].daysUsing} days with PeachieGlow
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${getGlowScoreColor(featuredTestimonials[currentTestimonial].glowScore)}`}>
                    {featuredTestimonials[currentTestimonial].glowScore}
                  </div>
                  <div className="text-xs text-gray-500">GlowScore</div>
                </div>
              </div>
              
              <blockquote className="text-gray-700 italic mb-4">
                "{featuredTestimonials[currentTestimonial].testimonial}"
              </blockquote>
              
              {featuredTestimonials[currentTestimonial].beforeAfter && (
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    {featuredTestimonials[currentTestimonial].beforeAfter?.improvement}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#4CAF50] to-[#00D4AA] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${featuredTestimonials[currentTestimonial].beforeAfter?.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <span className="text-sm font-bold text-[#4CAF50]">
                      +{featuredTestimonials[currentTestimonial].beforeAfter?.percentage}%
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Testimonial Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-4">
            {featuredTestimonials.map((_, index) => (
              <motion.button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? 'bg-[#00D4AA] w-6' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentTestimonial(index)}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          className="text-center p-4 bg-gradient-to-br from-[#4CAF50]/10 to-[#00D4AA]/10 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-2xl font-bold text-[#4CAF50]">94%</div>
          <div className="text-xs text-gray-600">Stick with it</div>
        </motion.div>
        
        <motion.div
          className="text-center p-4 bg-gradient-to-br from-[#FFD700]/10 to-[#FF8A80]/10 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-2xl font-bold text-[#FFD700]">89</div>
          <div className="text-xs text-gray-600">Avg GlowScore</div>
        </motion.div>
        
        <motion.div
          className="text-center p-4 bg-gradient-to-br from-[#00D4AA]/10 to-[#4CAF50]/10 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-2xl font-bold text-[#00D4AA]">14</div>
          <div className="text-xs text-gray-600">Days to results</div>
        </motion.div>
        
        <motion.div
          className="text-center p-4 bg-gradient-to-br from-[#FFB5A7]/10 to-[#FF8A80]/10 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-2xl font-bold text-[#FF8A80]">4.9</div>
          <div className="text-xs text-gray-600">★ App Rating</div>
        </motion.div>
      </div>
    </div>
  );
};

export default SocialProof;
