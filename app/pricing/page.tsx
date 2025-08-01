import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/next-auth';
import PeachieGlowHeader from '@/components/PeachieGlowHeader';
import ButtonCheckout from '@/components/ButtonCheckout';
import config from '@/config';

export default async function Pricing() {
  const session = await getServerSession(authOptions);

  const plans = [
    {
      name: "Free Glow",
      price: "$0",
      period: "forever",
      features: [
        "Basic GlowBot chat (5 messages/day)",
        "Simple habit tracking",
        "Weekly GlowScore updates",
        "Community access"
      ],
      priceId: null,
      popular: false,
      cta: session ? "Current Plan" : "Get Started Free"
    },
    {
      name: "Glow Pro",
      price: "$19",
      period: "month",
      features: [
        "Unlimited GlowBot conversations",
        "Advanced habit tracking & analytics",
        "Daily GlowScore & insights",
        "AI skin analysis & photos",
        "7-day SkinForecast predictions",
        "Achievement system & rewards",
        "Priority customer support"
      ],
      priceId: config.stripe.plans[0]?.priceId,
      popular: true,
      cta: "Start Pro Trial"
    },
    {
      name: "Glow Elite",
      price: "$39",
      period: "month",
      features: [
        "Everything in Glow Pro",
        "Personalized skincare routines",
        "Expert dermatologist consultations",
        "Custom product recommendations",
        "Advanced skin health reports",
        "1-on-1 coaching sessions",
        "Early access to new features"
      ],
      priceId: config.stripe.plans[1]?.priceId,
      popular: false,
      cta: "Go Elite"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50">
      <PeachieGlowHeader />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#FF6B9D] to-[#00D4AA] bg-clip-text text-transparent mb-6">
            Choose Your Glow ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Unlock the full power of AI-driven skincare with personalized routines, 
            expert insights, and gamified habit tracking that makes glowing skin fun and achievable.
          </p>
          
          {session && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 max-w-md mx-auto mb-8">
              <p className="text-green-800">
                👋 Welcome back, {session.user?.name?.split(' ')[0]}! 
                Choose a plan to unlock premium features.
              </p>
            </div>
          )}
        </section>

        {/* Pricing Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular 
                  ? 'ring-2 ring-[#00D4AA] scale-105 z-10' 
                  : 'hover:shadow-xl transition-shadow'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#FF6B9D] to-[#00D4AA] text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period !== "forever" && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                {plan.priceId ? (
                  <ButtonCheckout
                    priceId={plan.priceId}
                    mode="subscription"
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#FF6B9D] to-[#00D4AA] text-white hover:shadow-lg'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </ButtonCheckout>
                ) : (
                  <button
                    className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-100 text-gray-800 cursor-default"
                    disabled
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time from your dashboard. 
                You'll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">
                All paid plans come with a 7-day free trial. No credit card required 
                to start - just sign up and begin your skincare journey!
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">What makes GlowBot special?</h3>
              <p className="text-gray-600">
                GlowBot uses advanced AI trained on dermatological research to provide 
                personalized skincare advice based on your unique skin type and concerns.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">How accurate is the skin analysis?</h3>
              <p className="text-gray-600">
                Our AI skin analysis uses computer vision trained on thousands of skin images 
                to identify concerns with 90%+ accuracy, comparable to dermatologist assessments.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
