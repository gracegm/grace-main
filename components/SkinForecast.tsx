"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlowBot from './GlowBot';
import { SkinForecast as SkinForecastType, SkinAnalysis } from '@/types/user';

interface SkinForecastProps {
  className?: string;
}

const SkinForecast = ({ className = "" }: SkinForecastProps) => {
  const [forecast, setForecast] = useState<SkinForecastType | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userId = 'user-1'; // Demo user ID

  // Load initial data
  useEffect(() => {
    loadForecastData();
  }, []);

  const loadForecastData = async () => {
    try {
      setIsLoading(true);
      
      // Get latest analysis
      const analysisResponse = await fetch(`/api/skin/analysis?userId=${userId}`);
      const analysisData = await analysisResponse.json();
      
      if (analysisData.latest) {
        setAnalysis(analysisData.latest);
      }
      
      // Get latest forecast
      const forecastResponse = await fetch(`/api/skin/forecast?userId=${userId}`);
      const forecastData = await forecastResponse.json();
      
      if (forecastData.latest) {
        setForecast(forecastData.latest);
      }
      
    } catch (err) {
      setError('Failed to load skin data');
      console.error('Load forecast error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const runAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Generate new analysis
      const analysisResponse = await fetch('/api/skin/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      const analysisResult = await analysisResponse.json();
      
      if (analysisResult.analysis) {
        setAnalysis(analysisResult.analysis);
        
        // Generate new forecast
        const forecastResponse = await fetch('/api/skin/forecast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        
        const forecastResult = await forecastResponse.json();
        
        if (forecastResult.forecast) {
          setForecast(forecastResult.forecast);
        }
      }
      
    } catch (err) {
      setError('Failed to generate analysis');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#4CAF50]";
    if (score >= 60) return "text-[#FFD700]";
    if (score >= 40) return "text-[#FF8A80]";
    return "text-[#FF5252]";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-[#4CAF50] to-[#00D4AA]";
    if (score >= 60) return "from-[#FFD700] to-[#FF8A80]";
    if (score >= 40) return "from-[#FF8A80] to-[#FFB5A7]";
    return "from-[#FF5252] to-[#FF8A80]";
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D4AA] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading AI skin analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 ${className}`}>
        <div className="text-center text-red-500">
          <p className="mb-4">{error}</p>
          <button 
            onClick={loadForecastData}
            className="bg-[#00D4AA] text-white px-4 py-2 rounded-lg hover:bg-[#00B894] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const overallScore = analysis?.overallScore || forecast?.predictions[0]?.currentScore || 0;
  const improvements = analysis?.improvements || [];
  const concerns = analysis?.concerns || [];
  const recommendations = analysis?.recommendations || [];
  const nextCheckIn = analysis?.nextCheckIn ? 
    Math.ceil((new Date(analysis.nextCheckIn).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) + ' days' : '7 days';

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <GlowBot size="medium" message="Your AI SkinForecast is ready! 🔮✨" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">AI SkinForecast</h3>
            <p className="text-gray-600">Powered by advanced skin analysis</p>
          </div>
        </div>
        
        <motion.button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
            isAnalyzing 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#00D4AA] to-[#4CAF50] text-white hover:shadow-lg'
          }`}
          whileHover={!isAnalyzing ? { scale: 1.05 } : {}}
          whileTap={!isAnalyzing ? { scale: 0.95 } : {}}
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            'New Analysis'
          )}
        </motion.button>
      </div>

      {/* Main Score Display */}
      <div className="text-center mb-8">
        <motion.div
          className="relative inline-block"
          animate={isAnalyzing ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0 }}
        >
          {/* Circular Progress */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64" cy="64" r="56"
                stroke="#E5E7EB" strokeWidth="8" fill="none"
              />
              <motion.circle
                cx="64" cy="64" r="56"
                stroke="url(#scoreGradient)" strokeWidth="8" fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: overallScore / 100 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                strokeDasharray="352"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4CAF50" />
                  <stop offset="100%" stopColor="#00D4AA" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className={`h-full bg-gradient-to-r ${getScoreGradient(overallScore)} rounded-full transition-all duration-1000`}
                initial={{ width: 0 }}
                animate={{ width: `${(overallScore / 100) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(overallScore)} mb-2`}>
              {overallScore}/100
            </div>  
            <span className="text-sm text-gray-600">Skin Score</span>
          </div>
          
          <div className="mb-2">
            <h4 className="text-lg font-semibold text-gray-800">Overall Skin Health</h4>
            <p className="text-sm text-gray-500 text-center">Next analysis: {nextCheckIn}</p>
          </div>
        </motion.div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          className="bg-gradient-to-br from-[#4CAF50]/10 to-[#00D4AA]/10 rounded-xl p-4 border border-[#4CAF50]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">📈</span>
            <h5 className="font-semibold text-gray-800">Improvements</h5>
          </div>
          <p className="text-sm text-gray-600">{improvements.length} positive changes detected</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#FFD700]/10 to-[#FF8A80]/10 rounded-xl p-4 border border-[#FFD700]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">⚠️</span>
            <h5 className="font-semibold text-gray-800">Watch Areas</h5>
          </div>
          <p className="text-sm text-gray-600">{concerns.length} areas need attention</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#00D4AA]/10 to-[#4CAF50]/10 rounded-xl p-4 border border-[#00D4AA]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">💡</span>
            <h5 className="font-semibold text-gray-800">AI Recommendations</h5>
          </div>
          <p className="text-sm text-gray-600">{recommendations.length} personalized tips</p>
        </motion.div>
      </div>

      {/* Detailed View Toggle */}
      <div className="text-center mb-4">
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
          <motion.div
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >↓</motion.div>
        </motion.button>
      </div>

      {/* Detailed Analysis */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Improvements */}
            <div>
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="text-[#4CAF50] mr-2">✓</span>
                Recent Improvements
              </h5>
              <div className="space-y-2">
                {improvements.map((improvement: any, index: number) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-[#4CAF50]/5 rounded-lg border border-[#4CAF50]/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-[#4CAF50] rounded-full"></div>
                    <p className="text-gray-700">{improvement.description || improvement}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Concerns */}
            <div>
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="text-[#FFD700] mr-2">⚠️</span>
                Areas to Watch
              </h5>
              <div className="space-y-2">
                {concerns.map((concern: any, index: number) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-[#FFD700]/5 rounded-lg border border-[#FFD700]/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                    <p className="text-gray-700">{concern.description || concern}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="text-[#00D4AA] mr-2">💡</span>
                AI-Powered Recommendations
              </h5>
              <div className="space-y-2">
                {recommendations.map((recommendation: any, index: number) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-[#00D4AA]/5 rounded-lg border border-[#00D4AA]/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-[#00D4AA] rounded-full"></div>
                    <p className="text-gray-700">{recommendation.description || recommendation}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Check-in */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#FFB5A7]/10 to-[#00D4AA]/10 rounded-xl border border-[#FFB5A7]/20">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-semibold text-gray-800">Next AI Analysis</h5>
            <p className="text-sm text-gray-600">
              Scheduled in {nextCheckIn}
            </p>
          </div>
          <motion.div
            className="text-2xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🔮
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SkinForecast;
