"use client";

import { useState, useEffect } from 'react';

const SimpleHero = () => {
  const [glowScore, setGlowScore] = useState(127);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#FFB5A7] via-[#FF8A80] to-[#FFB5A7] overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left Column - Content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            
            {/* Logo with AI Accent */}
            <div className="mb-6 animate-fade-in">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                Pe
                <span className="text-[#00D4AA] drop-shadow-lg glow-text">A</span>
                ch
                <span className="text-[#00D4AA] drop-shadow-lg glow-text">I</span>
                eGlow
              </h1>
              <p className="text-xl text-white/90 font-medium">Your Dewy Skin Assistant</p>
            </div>

            {/* Animated Headline */}
            <div className="mb-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4 animate-slide-up">
                Turn Skincare Into Your Most Rewarding Daily Habit
              </h2>
              
              <p className="text-lg text-white/90 mb-2 animate-slide-up delay-500">
                Build unstoppable GlowScore streaks with your AI-powered dewy skin assistant
              </p>
            </div>

            {/* Supporting Text */}
            <p className="text-white/80 text-lg mb-8 leading-relaxed animate-slide-up delay-700">
              No more forgetting your routine or wondering if it's working. PeachieGlow makes skincare as addictive as your favorite game - with AI-powered SkinForecast insights, GlowScore streaks, achievements, and daily wins that keep you glowing.
            </p>

            {/* Interactive GlowScore Counter */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/30 animate-slide-up delay-1000">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm font-medium mb-1">Your GlowScore Journey</p>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-[#FFD700] mr-2 animate-pulse">
                      {glowScore}
                    </span>
                    <span className="text-white/90">days and counting</span>
                  </div>
                </div>
                
                {/* Progress Ring */}
                <div className="relative w-16 h-16">
                  <div className="w-16 h-16 rounded-full border-4 border-white/30"></div>
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-[#4CAF50] border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">89%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mb-6 animate-slide-up delay-1200">
              <button className="bg-gradient-to-r from-[#00D4AA] to-[#4CAF50] text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mr-4">
                Start My GlowScore Today
              </button>
              <p className="text-white/80 text-sm mt-2">Build your first 7-day GlowScore</p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 animate-slide-up delay-1400">
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
            </div>

            {/* Trust Line */}
            <p className="text-white/70 text-sm mt-4 animate-fade-in delay-1600">
              10,000+ women are building life-changing skincare habits with PeachieGlow right now
            </p>
          </div>

          {/* Right Column - Phone Mockup */}
          <div className="lg:w-1/2 relative animate-slide-left">
            <div className="relative z-10">
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

              {/* Floating Achievement Badges */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-2xl">🏆</span>
              </div>

              <div className="absolute top-1/2 -left-8 w-12 h-12 bg-[#4CAF50] rounded-full flex items-center justify-center shadow-lg animate-bounce delay-500">
                <span className="text-lg">⭐</span>
              </div>

              <div className="absolute -bottom-4 right-1/4 w-14 h-14 bg-[#00D4AA] rounded-full flex items-center justify-center shadow-lg animate-bounce delay-1000">
                <span className="text-xl">💎</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations and glow effect */}
      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 10px #00D4AA, 0 0 20px #00D4AA, 0 0 30px #00D4AA;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .animate-slide-left {
          animation: slideLeft 1s ease-out forwards;
        }
        
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1200 { animation-delay: 1.2s; }
        .delay-1400 { animation-delay: 1.4s; }
        .delay-1600 { animation-delay: 1.6s; }
      `}</style>
    </section>
  );
};

export default SimpleHero;
