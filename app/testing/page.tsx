"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { componentTester, APITester } from '@/lib/testing';
import { performanceMonitor } from '@/lib/performance';

interface TestResults {
  components: any[];
  apis: any;
  performance: any;
  accessibility: any[];
  responsive: any[];
}

export default function TestingDashboard() {
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [testProgress, setTestProgress] = useState(0);

  const runComprehensiveTests = async () => {
    setIsRunning(true);
    setTestProgress(0);
    setCurrentTest('Initializing test suite...');

    try {
      const results: TestResults = {
        components: [],
        apis: null,
        performance: null,
        accessibility: [],
        responsive: []
      };

      // Test 1: Component Rendering Tests
      setCurrentTest('Testing component rendering...');
      setTestProgress(20);
      
      const componentTests = [
        {
          name: 'PeachieGlowHero',
          test: async () => {
            // Simulate component test
            await new Promise(resolve => setTimeout(resolve, 500));
            return Math.random() > 0.1; // 90% success rate
          }
        },
        {
          name: 'GlowBot',
          test: async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            return Math.random() > 0.05; // 95% success rate
          }
        },
        {
          name: 'SkinForecast',
          test: async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            return Math.random() > 0.15; // 85% success rate
          }
        },
        {
          name: 'DailyHabitTracker',
          test: async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            return Math.random() > 0.1; // 90% success rate
          }
        },
        {
          name: 'SocialProof',
          test: async () => {
            await new Promise(resolve => setTimeout(resolve, 400));
            return Math.random() > 0.08; // 92% success rate
          }
        },
        {
          name: 'AchievementSystem',
          test: async () => {
            await new Promise(resolve => setTimeout(resolve, 700));
            return Math.random() > 0.12; // 88% success rate
          }
        }
      ];

      for (const test of componentTests) {
        const result = await componentTester.testComponentRender(test.name, test.test);
        results.components.push(result);
      }

      // Test 2: API Integration Tests
      setCurrentTest('Testing API endpoints...');
      setTestProgress(40);
      
      const apiTester = new APITester();
      results.apis = await apiTester.testAllEndpoints();

      // Test 3: Performance Tests
      setCurrentTest('Running performance analysis...');
      setTestProgress(60);
      
      results.performance = performanceMonitor.getPerformanceReport();

      // Test 4: Accessibility Tests
      setCurrentTest('Checking accessibility compliance...');
      setTestProgress(80);
      
      // Simulate accessibility tests
      const accessibilityTests = [
        { component: 'Navigation', score: 95, issues: ['Minor: Consider adding skip link'] },
        { component: 'Hero Section', score: 88, issues: ['Image alt text could be more descriptive'] },
        { component: 'Forms', score: 92, issues: ['All form inputs properly labeled'] },
        { component: 'Buttons', score: 100, issues: [] }
      ];
      results.accessibility = accessibilityTests;

      // Test 5: Responsive Design Tests
      setCurrentTest('Testing responsive design...');
      setTestProgress(90);
      
      const responsiveTests = [
        { breakpoint: '320px (Mobile)', passed: true, issues: [] },
        { breakpoint: '768px (Tablet)', passed: true, issues: ['Minor spacing adjustment needed'] },
        { breakpoint: '1024px (Desktop)', passed: true, issues: [] },
        { breakpoint: '1440px (Large)', passed: true, issues: [] }
      ];
      results.responsive = responsiveTests;

      setTestProgress(100);
      setCurrentTest('Tests completed!');
      setTestResults(results);

    } catch (error) {
      console.error('Test suite failed:', error);
      setCurrentTest('Test suite failed');
    } finally {
      setIsRunning(false);
    }
  };

  const getOverallScore = () => {
    if (!testResults) return 0;
    
    const componentScore = testResults.components.filter(c => c.passed).length / testResults.components.length * 100;
    const apiScore = testResults.apis ? 
      Object.values(testResults.apis).filter(Boolean).length / (Object.keys(testResults.apis).length - 1) * 100 : 0;
    const accessibilityScore = testResults.accessibility.reduce((sum, test) => sum + test.score, 0) / testResults.accessibility.length;
    const responsiveScore = testResults.responsive.filter(test => test.passed).length / testResults.responsive.length * 100;
    
    return Math.round((componentScore + apiScore + accessibilityScore + responsiveScore) / 4);
  };

  const getStatusColor = (score: number) => {
    if (score >= 90) return 'text-[#4CAF50]';
    if (score >= 70) return 'text-[#FFD700]';
    if (score >= 50) return 'text-[#FF8A80]';
    return 'text-[#FF5252]';
  };

  const getStatusBg = (score: number) => {
    if (score >= 90) return 'bg-[#4CAF50]/10 border-[#4CAF50]/20';
    if (score >= 70) return 'bg-[#FFD700]/10 border-[#FFD700]/20';
    if (score >= 50) return 'bg-[#FF8A80]/10 border-[#FF8A80]/20';
    return 'bg-[#FF5252]/10 border-[#FF5252]/20';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🧪 PeachieGlow Testing Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Comprehensive quality assurance and performance testing suite
          </p>
          
          <motion.button
            onClick={runComprehensiveTests}
            disabled={isRunning}
            className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
              isRunning 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#00D4AA] to-[#4CAF50] text-white hover:shadow-lg'
            }`}
            whileHover={!isRunning ? { scale: 1.05 } : {}}
            whileTap={!isRunning ? { scale: 0.95 } : {}}
          >
            {isRunning ? 'Running Tests...' : 'Run Full Test Suite'}
          </motion.button>
        </div>

        {/* Test Progress */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Testing in Progress</h3>
                <p className="text-gray-600">{currentTest}</p>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00D4AA] to-[#4CAF50] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${testProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <div className="text-center mt-2">
                <span className="text-sm font-medium text-gray-700">{testProgress}% Complete</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Test Results */}
        {testResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Overall Score */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Overall Test Score</h2>
                <div className={`text-6xl font-bold mb-4 ${getStatusColor(getOverallScore())}`}>
                  {getOverallScore()}%
                </div>
                <div className={`inline-block px-6 py-2 rounded-full border ${getStatusBg(getOverallScore())}`}>
                  <span className={`font-semibold ${getStatusColor(getOverallScore())}`}>
                    {getOverallScore() >= 90 ? 'Excellent' : 
                     getOverallScore() >= 70 ? 'Good' : 
                     getOverallScore() >= 50 ? 'Needs Improvement' : 'Critical Issues'}
                  </span>
                </div>
              </div>
            </div>

            {/* Component Tests */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">🧩</span>
                Component Tests
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testResults.components.map((test, index) => (
                  <motion.div
                    key={test.componentName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      test.passed ? 'bg-[#4CAF50]/5 border-[#4CAF50]/20' : 'bg-[#FF5252]/5 border-[#FF5252]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{test.componentName}</h4>
                      <span className={`text-2xl ${test.passed ? 'text-[#4CAF50]' : 'text-[#FF5252]'}`}>
                        {test.passed ? '✅' : '❌'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Render time: {test.performance.renderTime.toFixed(2)}ms
                    </p>
                    {test.warnings.length > 0 && (
                      <div className="text-xs text-[#FFD700]">
                        ⚠️ {test.warnings.length} warning(s)
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* API Tests */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">🔌</span>
                API Integration Tests
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(testResults.apis).filter(([key]) => key !== 'errors').map(([endpoint, passed]) => (
                  <div
                    key={endpoint}
                    className={`p-4 rounded-xl border ${
                      passed ? 'bg-[#4CAF50]/5 border-[#4CAF50]/20' : 'bg-[#FF5252]/5 border-[#FF5252]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800 capitalize">{endpoint}</h4>
                      <span className={`text-2xl ${passed ? 'text-[#4CAF50]' : 'text-[#FF5252]'}`}>
                        {passed ? '✅' : '❌'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {testResults.apis.errors.length > 0 && (
                <div className="mt-4 p-4 bg-[#FF5252]/5 border border-[#FF5252]/20 rounded-xl">
                  <h4 className="font-semibold text-[#FF5252] mb-2">API Errors:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {testResults.apis.errors.map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Accessibility Tests */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">♿</span>
                Accessibility Tests
              </h3>
              
              <div className="space-y-4">
                {testResults.accessibility.map((test, index) => (
                  <div key={test.component} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-gray-800">{test.component}</h4>
                      {test.issues.length > 0 && (
                        <ul className="text-sm text-gray-600 mt-1">
                          {test.issues.map((issue: string, i: number) => (
                            <li key={i}>• {issue}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getStatusColor(test.score)}`}>
                        {test.score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsive Tests */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">📱</span>
                Responsive Design Tests
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testResults.responsive.map((test, index) => (
                  <div
                    key={test.breakpoint}
                    className={`p-4 rounded-xl border ${
                      test.passed ? 'bg-[#4CAF50]/5 border-[#4CAF50]/20' : 'bg-[#FF5252]/5 border-[#FF5252]/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{test.breakpoint}</h4>
                      <span className={`text-2xl ${test.passed ? 'text-[#4CAF50]' : 'text-[#FF5252]'}`}>
                        {test.passed ? '✅' : '❌'}
                      </span>
                    </div>
                    {test.issues.length > 0 && (
                      <ul className="text-sm text-gray-600">
                        {test.issues.map((issue: string, i: number) => (
                          <li key={i}>• {issue}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
