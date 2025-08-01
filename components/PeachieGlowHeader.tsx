"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ButtonSignin from './ButtonSignin';
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

  // CTA button following FeNAgO template pattern
  const cta = <ButtonSignin text="Get Started" extraStyle="btn-primary" />;

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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlowBot size="small" animated={true} />
            <span className={`text-2xl font-bold transition-colors duration-200 ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}>
              Pe
              <span className="text-[#00D4AA] drop-shadow-lg glow-text">A</span>
              ch
              <span className="text-[#00D4AA] drop-shadow-lg glow-text">I</span>
              eGlow
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                className={`font-medium transition-colors duration-200 hover:scale-105 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-[#00D4AA]' 
                    : 'text-white/90 hover:text-white'
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* CTA Button - Following FeNAgO Template Pattern */}
          <div className="hidden md:flex items-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              {cta}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
              isScrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white/90 hover:bg-white/10'
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            whileTap={{ scale: 0.95 }}
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
              className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-6 py-6">
                {/* Mobile Navigation */}
                <nav className="space-y-4 mb-6">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left font-medium text-gray-700 hover:text-[#00D4AA] py-2 transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </nav>

                {/* Mobile CTA Button */}
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {cta}
                  </motion.div>
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

      {/* GlowBot Integration */}
      <div className="fixed bottom-6 right-6 z-40">
        <GlowBot />
      </div>
    </motion.header>
  );
};

export default PeachieGlowHeader;
