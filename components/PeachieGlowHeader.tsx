"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlowBot from './GlowBot';

interface PeachieGlowHeaderProps {
  className?: string;
}

const PeachieGlowHeader = ({ className = "" }: PeachieGlowHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features', action: () => scrollToSection('features') },
    { label: 'GlowScore', href: '#glowscore', action: () => scrollToSection('glowscore') },
    { label: 'Achievements', href: '#achievements', action: () => scrollToSection('achievements') },
    { label: 'Demo', href: '/demo', action: () => window.location.href = '/demo' },
    { label: 'Testing', href: '/testing', action: () => window.location.href = '/testing' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
      } ${className}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <GlowBot size="small" animated={true} />
            <div>
              <h1 className={`text-2xl font-bold ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                Pe
                <span className="text-[#00D4AA] drop-shadow-lg glow-text">A</span>
                ch
                <span className="text-[#00D4AA] drop-shadow-lg glow-text">I</span>
                eGlow
              </h1>
              <p className={`text-sm font-medium ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>
                Your Dewy Skin Assistant
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                className={`font-medium transition-colors duration-200 hover:text-[#00D4AA] cursor-pointer ${
                  isScrolled ? 'text-gray-700' : 'text-white/90'
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              onClick={() => {
                console.log('Sign In clicked');
                window.open('mailto:contact@peachyglow.com?subject=Early Access Request&body=Hi! I\'d like early access to PeachieGlow. Please let me know when Sign In is available!', '_blank');
              }}
              className={`font-medium transition-colors duration-200 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-[#00D4AA]' 
                  : 'text-white/90 hover:text-white'
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
            >
              Sign In
            </motion.button>
            
            <motion.button
              onClick={() => {
                console.log('Start Free Trial clicked');
                window.open('mailto:contact@peachyglow.com?subject=Free Trial Request&body=Hi! I\'m interested in starting a free trial of PeachieGlow. Please notify me when it\'s available!', '_blank');
              }}
              className="bg-gradient-to-r from-[#00D4AA] to-[#4CAF50] text-white font-semibold px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`rounded-2xl p-4 ${
                isScrolled 
                  ? 'bg-gray-50 border border-gray-200' 
                  : 'bg-white/10 backdrop-blur-md border border-white/20'
              }`}>
                {/* Mobile Navigation Links */}
                <nav className="space-y-3 mb-4">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left font-medium transition-colors duration-200 hover:text-[#00D4AA] ${
                        isScrolled ? 'text-gray-700' : 'text-white/90'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </nav>

                {/* Mobile CTA Buttons */}
                <div className="space-y-3">
                  <motion.button
                    className={`w-full text-center font-medium py-2 rounded-lg transition-colors duration-200 ${
                      isScrolled 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Sign In
                  </motion.button>
                  
                  <motion.button
                    className="w-full bg-gradient-to-r from-[#00D4AA] to-[#4CAF50] text-white font-semibold py-3 rounded-full hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Free Trial
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom CSS for glow effect */}
      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 10px #00D4AA, 0 0 20px #00D4AA;
        }
      `}</style>
    </motion.header>
  );
};

export default PeachieGlowHeader;
