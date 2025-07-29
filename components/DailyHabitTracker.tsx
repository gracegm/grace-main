"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlowBot from './GlowBot';

interface HabitTask {
  id: string;
  title: string;
  description: string;
  category: 'morning' | 'evening' | 'anytime';
  completed: boolean;
  streak: number;
  importance: 'low' | 'medium' | 'high';
  estimatedTime: string;
  icon: string;
}

interface DailyHabitTrackerProps {
  className?: string;
}

const DailyHabitTracker = ({ className = "" }: DailyHabitTrackerProps) => {
  const [currentDate] = useState(new Date());
  const [tasks, setTasks] = useState<HabitTask[]>([
    {
      id: '1',
      title: 'Morning Cleanser',
      description: 'Gentle foam cleanser with ceramides',
      category: 'morning',
      completed: true,
      streak: 15,
      importance: 'high',
      estimatedTime: '2 min',
      icon: '🧼'
    },
    {
      id: '2',
      title: 'Vitamin C Serum',
      description: 'Apply to face and neck, avoid eye area',
      category: 'morning',
      completed: true,
      streak: 12,
      importance: 'high',
      estimatedTime: '1 min',
      icon: '🍊'
    },
    {
      id: '3',
      title: 'SPF Protection',
      description: 'Broad spectrum SPF 30+ sunscreen',
      category: 'morning',
      completed: false,
      streak: 8,
      importance: 'high',
      estimatedTime: '2 min',
      icon: '☀️'
    },
    {
      id: '4',
      title: 'Hydrating Toner',
      description: 'Pat gently, don\'t rub',
      category: 'evening',
      completed: false,
      streak: 5,
      importance: 'medium',
      estimatedTime: '1 min',
      icon: '💧'
    },
    {
      id: '5',
      title: 'Retinol Treatment',
      description: 'Use 2-3 times per week only',
      category: 'evening',
      completed: false,
      streak: 3,
      importance: 'medium',
      estimatedTime: '1 min',
      icon: '✨'
    },
    {
      id: '6',
      title: 'Drink Water',
      description: 'Stay hydrated for healthy skin',
      category: 'anytime',
      completed: true,
      streak: 25,
      importance: 'high',
      estimatedTime: 'ongoing',
      icon: '💧'
    }
  ]);

  const [showCelebration, setShowCelebration] = useState(false);
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;
        if (newCompleted && !task.completed) {
          // Task just completed
          setCompletedTaskId(taskId);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 2000);
        }
        return {
          ...task,
          completed: newCompleted,
          streak: newCompleted ? task.streak + 1 : Math.max(0, task.streak - 1)
        };
      }
      return task;
    }));
  };

  const getCompletionPercentage = () => {
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 20) return "text-[#FFD700]";
    if (streak >= 10) return "text-[#4CAF50]";
    if (streak >= 5) return "text-[#00D4AA]";
    return "text-gray-500";
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return "border-l-red-400 bg-red-50";
      case 'medium': return "border-l-yellow-400 bg-yellow-50";
      case 'low': return "border-l-green-400 bg-green-50";
      default: return "border-l-gray-400 bg-gray-50";
    }
  };

  const getCategoryTasks = (category: string) => {
    return tasks.filter(task => task.category === category);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <GlowBot size="medium" message="Ready for today's skincare routine? Let's glow! ✨" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">Daily Habit Tracker</h3>
            <p className="text-gray-600">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        {/* Daily Progress */}
        <div className="text-right">
          <motion.div
            className="text-2xl font-bold text-[#00D4AA]"
            animate={{ scale: showCelebration ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            {completionPercentage}%
          </motion.div>
          <div className="text-sm text-gray-500">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Today's Progress</span>
          <span className="text-sm text-gray-600">
            {tasks.filter(t => t.completed).length}/{tasks.length} tasks
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00D4AA] to-[#4CAF50] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Task Categories */}
      <div className="space-y-6">
        
        {/* Morning Routine */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="text-lg mr-2">🌅</span>
            Morning Routine
          </h4>
          <div className="space-y-3">
            {getCategoryTasks('morning').map((task, index) => (
              <motion.div
                key={task.id}
                className={`p-4 rounded-xl border-l-4 cursor-pointer transition-all duration-300 ${
                  task.completed 
                    ? 'bg-[#4CAF50]/10 border-l-[#4CAF50]' 
                    : getImportanceColor(task.importance)
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        task.completed 
                          ? 'bg-[#4CAF50] border-[#4CAF50] text-white' 
                          : 'border-gray-300 hover:border-[#00D4AA]'
                      }`}
                      animate={task.completed ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {task.completed && <span className="text-xs">✓</span>}
                    </motion.div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{task.icon}</span>
                        <h5 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-bold ${getStreakColor(task.streak)}`}>
                      {task.streak} day streak
                    </div>
                    <div className="text-xs text-gray-500">{task.estimatedTime}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Evening Routine */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="text-lg mr-2">🌙</span>
            Evening Routine
          </h4>
          <div className="space-y-3">
            {getCategoryTasks('evening').map((task, index) => (
              <motion.div
                key={task.id}
                className={`p-4 rounded-xl border-l-4 cursor-pointer transition-all duration-300 ${
                  task.completed 
                    ? 'bg-[#4CAF50]/10 border-l-[#4CAF50]' 
                    : getImportanceColor(task.importance)
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        task.completed 
                          ? 'bg-[#4CAF50] border-[#4CAF50] text-white' 
                          : 'border-gray-300 hover:border-[#00D4AA]'
                      }`}
                      animate={task.completed ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {task.completed && <span className="text-xs">✓</span>}
                    </motion.div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{task.icon}</span>
                        <h5 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-bold ${getStreakColor(task.streak)}`}>
                      {task.streak} day streak
                    </div>
                    <div className="text-xs text-gray-500">{task.estimatedTime}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Anytime Tasks */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="text-lg mr-2">⏰</span>
            Anytime
          </h4>
          <div className="space-y-3">
            {getCategoryTasks('anytime').map((task, index) => (
              <motion.div
                key={task.id}
                className={`p-4 rounded-xl border-l-4 cursor-pointer transition-all duration-300 ${
                  task.completed 
                    ? 'bg-[#4CAF50]/10 border-l-[#4CAF50]' 
                    : getImportanceColor(task.importance)
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        task.completed 
                          ? 'bg-[#4CAF50] border-[#4CAF50] text-white' 
                          : 'border-gray-300 hover:border-[#00D4AA]'
                      }`}
                      animate={task.completed ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {task.completed && <span className="text-xs">✓</span>}
                    </motion.div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{task.icon}</span>
                        <h5 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-bold ${getStreakColor(task.streak)}`}>
                      {task.streak} day streak
                    </div>
                    <div className="text-xs text-gray-500">{task.estimatedTime}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Completion Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 text-center max-w-sm mx-4"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Task Completed!</h3>
              <p className="text-gray-600 mb-4">Great job staying consistent with your routine!</p>
              <div className="text-3xl">✨</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyHabitTracker;
