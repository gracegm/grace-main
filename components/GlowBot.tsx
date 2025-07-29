"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlowBotProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  showMessage?: boolean;
  animated?: boolean;
  className?: string;
}

const GlowBot = ({ 
  size = 'medium', 
  message = "Hi! I'm your GlowBot assistant! 🌟", 
  showMessage = false,
  animated = true,
  className = ""
}: GlowBotProps) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(showMessage);

  // Size configurations
  const sizeConfig = {
    small: { width: 'w-12 h-12', text: 'text-lg' },
    medium: { width: 'w-16 h-16', text: 'text-xl' },
    large: { width: 'w-24 h-24', text: 'text-3xl' }
  };

  const config = sizeConfig[size];

  // Blinking animation
  useEffect(() => {
    if (!animated) return;
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000 + Math.random() * 2000); // Random blink between 3-5 seconds

    return () => clearInterval(blinkInterval);
  }, [animated]);

  // Auto-show message on hover or interaction
  const handleInteraction = () => {
    setShowSpeechBubble(true);
    setTimeout(() => setShowSpeechBubble(false), 3000);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20"
          >
            <div className="bg-white rounded-lg shadow-lg px-4 py-2 max-w-xs relative">
              <p className="text-gray-800 text-sm font-medium">{message}</p>
              {/* Speech bubble tail */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GlowBot Character */}
      <motion.div
        className={`${config.width} cursor-pointer relative`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleInteraction}
        animate={animated ? {
          y: [0, -4, 0],
          rotate: [0, 2, -2, 0]
        } : {}}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFB5A7] to-[#00D4AA] rounded-full blur-sm opacity-50 animate-pulse"></div>
        
        {/* Main Peach Body */}
        <div className="relative bg-gradient-to-br from-[#FFB5A7] to-[#FF8A80] rounded-full w-full h-full flex items-center justify-center shadow-lg border-2 border-white/30">
          
          {/* Peach Texture/Gradient */}
          <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
          
          {/* Face */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Eyes */}
            <div className="flex space-x-1 mb-1">
              <motion.div
                className="w-1.5 h-1.5 bg-gray-800 rounded-full"
                animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
                transition={{ duration: 0.1 }}
              />
              <motion.div
                className="w-1.5 h-1.5 bg-gray-800 rounded-full"
                animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
                transition={{ duration: 0.1 }}
              />
            </div>
            
            {/* Smile */}
            <div className="w-3 h-1.5 border-b-2 border-gray-800 rounded-full"></div>
          </div>

          {/* AI Accent Highlights */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-[#00D4AA] rounded-full opacity-80 animate-ping"></div>
          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-[#00D4AA] rounded-full opacity-60"></div>
        </div>

        {/* Floating Sparkles */}
        {animated && (
          <>
            <motion.div
              className="absolute -top-1 -right-1 text-yellow-400 text-xs"
              animate={{
                y: [0, -8, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
                ease: "easeInOut"
              }}
            >
              ✨
            </motion.div>
            
            <motion.div
              className="absolute -bottom-1 -left-1 text-yellow-400 text-xs"
              animate={{
                y: [0, -6, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 1.2,
                ease: "easeInOut"
              }}
            >
              ⭐
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Interaction Hint */}
      {!showSpeechBubble && animated && (
        <motion.div
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 hover:opacity-100 transition-opacity"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          Click me!
        </motion.div>
      )}
    </div>
  );
};

// Predefined GlowBot variants for common use cases
export const GlowBotGreeting = () => (
  <GlowBot 
    size="large" 
    message="Welcome to PeachieGlow! Ready to start your skincare journey? 🌟" 
    showMessage={true}
    animated={true}
  />
);

export const GlowBotSmall = () => (
  <GlowBot 
    size="small" 
    message="Keep going! You're doing great! 💪" 
    animated={true}
  />
);

export const GlowBotCelebration = () => (
  <GlowBot 
    size="medium" 
    message="Congratulations on your GlowScore milestone! 🎉" 
    showMessage={true}
    animated={true}
  />
);

export default GlowBot;
