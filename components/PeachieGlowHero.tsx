"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PeachieGlowHero = () => {
  const [glowScore, setGlowScore] = useState(127);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animate the GlowScore counter on mount
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Split text animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const heroText = "Turn Skincare Into Your Most Rewarding Daily Habit";
  const letters = heroText.split("");

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#FFB5A7] via-[#FF8A80] to-[#FFB5A7] overflow-hidden">
      {/* Vanta.js Background Placeholder - In production, this would be the actual Vanta.js waves */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-bounce delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left Column - Content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            
            {/* Logo with AI Accent */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                Pe
                <span className="text-[#00D4AA] drop-shadow-lg glow-text">A</span>
                ch
                <span className="text-[#00D4AA] drop-shadow-lg glow-text">I</span>
                eGlow
              </h1>
              <p className="text-xl text-white/90 font-medium">Your Dewy Skin Assistant</p>
            </motion.div>

            {/* Animated Headline */}
            <div className="mb-6">
              <motion.h2 
                className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {heroText}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="text-lg text-white/90 mb-2"
              >
                Build unstoppable GlowScore streaks with your AI-powered dewy skin assistant
              </motion.p>
            </div>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="text-white/80 text-lg mb-8 leading-relaxed"
            >
              No more forgetting your routine or wondering if it's working. PeachieGlow makes skincare as addictive as your favorite game - with AI-powered SkinForecast insights, GlowScore streaks, achievements, and daily wins that keep you glowing.
            </motion.p>

            {/* Interactive GlowScore Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3, duration: 0.8 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm font-medium mb-1">Your GlowScore Journey</p>
                  <div className="flex items-center">
                    <motion.span
                      animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                      className="text-3xl font-bold text-[#FFD700] mr-2"
                    >
                      {glowScore}
                    </motion.span>
                    <span className="text-white/90">days and counting</span>
                  </div>
                </div>
                
                {/* Progress Ring */}
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="white/30"
                      strokeWidth="4"
                      fill="none"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#4CAF50"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 0.89 }}
                      transition={{ delay: 3.5, duration: 2, ease: "easeInOut" }}
                      strokeDasharray="176"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">89%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4, duration: 0.8 }}
              className="mb-6"
            >
              <button className="bg-gradient-to-r from-[#00D4AA] to-[#4CAF50] text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mr-4">
                Start My GlowScore Today
              </button>
              <p className="text-white/80 text-sm mt-2">Build your first 7-day GlowScore</p>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.5, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <span className="text-[#FFD700] font-bold">10,000+</span>
                <span className="text-white/90 ml-1">Daily Users</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <span className="text-[#FFD700] font-bold">89-day</span>
                <span className="text-white/90 ml-1">Avg GlowScore</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <span className="text-[#FFD700] font-bold">94%</span>
                <span className="text-white/90 ml-1">stick with it</span>
              </div>
            </motion.div>

            {/* Trust Line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5, duration: 0.8 }}
              className="text-white/70 text-sm mt-4"
            >
              10,000+ women are building life-changing skincare habits with PeachieGlow right now
            </motion.p>
          </div>

          {/* Right Column - Phone Mockup with Orbiting Elements */}
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="relative z-10"
            >
              {/* Phone Mockup */}
              <div className="mx-auto w-80 h-[600px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Phone Screen Content */}
                  <div className="p-6 bg-gradient-to-b from-[#FFB5A7] to-[#FF8A80] h-full">
                    <div className="text-center mb-6">
                      <h3 className="text-white font-bold text-lg mb-2">Today's GlowScore</h3>
                      <div className="text-4xl font-bold text-[#FFD700]">Day {glowScore}</div>
                    </div>
                    
                    {/* Mock Daily Tasks */}
                    <div className="space-y-3">
                      <div className="bg-white/20 rounded-lg p-3 flex items-center">
                        <div className="w-6 h-6 bg-[#4CAF50] rounded-full mr-3 flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <span className="text-white">Morning Cleanser</span>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 flex items-center">
                        <div className="w-6 h-6 bg-[#4CAF50] rounded-full mr-3 flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <span className="text-white">Vitamin C Serum</span>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 flex items-center">
                        <div className="w-6 h-6 border-2 border-white/50 rounded-full mr-3"></div>
                        <span className="text-white/70">Evening Routine</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orbiting Achievement Badges */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Achievement Badge 1 */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-2xl">🏆</span>
                </motion.div>

                {/* Achievement Badge 2 */}
                <motion.div
                  className="absolute top-1/2 -left-8 w-12 h-12 bg-[#4CAF50] rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-lg">⭐</span>
                </motion.div>

                {/* Achievement Badge 3 */}
                <motion.div
                  className="absolute -bottom-4 right-1/4 w-14 h-14 bg-[#00D4AA] rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-xl">💎</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom CSS for glow effect */}
      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 10px #00D4AA, 0 0 20px #00D4AA, 0 0 30px #00D4AA;
        }
      `}</style>
    </section>
  );
};

export default PeachieGlowHero;
