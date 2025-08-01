import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/next-auth';
import PeachieGlowHeader from '@/components/PeachieGlowHeader';
import GlowScoreTracker from '@/components/GlowScoreTracker';
import DailyHabitTracker from '@/components/DailyHabitTracker';
import GlowBot from '@/components/GlowBot';
import ButtonAccount from "@/components/ButtonAccount";

export const dynamic = "force-dynamic";

// Protected dashboard page for authenticated PeachieGlow users
export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50">
      <PeachieGlowHeader />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF6B9D] to-[#00D4AA] bg-clip-text text-transparent mb-4">
              Welcome back, {session.user?.name?.split(' ')[0] || 'Glowing User'}! ✨
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to continue your skincare journey? Let's check your progress and keep that glow going!
            </p>
          </div>
          
          {/* Account Management */}
          <div className="flex justify-center mb-8">
            <ButtonAccount />
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* GlowScore Tracker */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Your GlowScore
            </h2>
            <GlowScoreTracker />
          </div>

          {/* Daily Habits */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">✅</span>
              Daily Habits
            </h2>
            <DailyHabitTracker />
          </div>
        </div>

        {/* GlowBot Assistant */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🤖</span>
              Chat with GlowBot
            </h2>
            <p className="text-gray-600 mb-4">
              Get personalized skincare advice and tips from your AI skincare assistant!
            </p>
            <GlowBot />
          </div>
        </section>

        {/* Subscription Status */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Plan: Free Glow ✨</h2>
                <p className="opacity-90 mb-4">
                  Upgrade to unlock unlimited AI conversations, advanced analytics, and personalized skincare routines!
                </p>
                <a 
                  href="/pricing" 
                  className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-block"
                >
                  Upgrade to Pro
                </a>
              </div>
              <div className="text-6xl opacity-20">
                💎
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/skin-analysis" className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer block">
            <div className="text-3xl mb-2">📸</div>
            <h3 className="font-semibold mb-2">Skin Analysis</h3>
            <p className="text-sm opacity-90">Take a photo for AI skin analysis</p>
          </a>
          
          <a href="/skin-forecast" className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer block">
            <div className="text-3xl mb-2">🔮</div>
            <h3 className="font-semibold mb-2">Skin Forecast</h3>
            <p className="text-sm opacity-90">See your 7-day skin predictions</p>
          </a>
          
          <a href="/achievements" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer block">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-semibold mb-2">Achievements</h3>
            <p className="text-sm opacity-90">View your skincare milestones</p>
          </a>
        </section>
      </main>
    </div>
  );
}
