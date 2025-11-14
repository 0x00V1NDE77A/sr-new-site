"use client"

import { TrendingUp, Briefcase, RefreshCw, HelpCircle } from "lucide-react"

const featureCards = [
  {
    icon: TrendingUp,
    title: "Real-Time Insights",
    description: "Make smarter decision with live data and actionable insights, delivered in real-time to stay ahead of the curve.",
  },
  {
    icon: Briefcase,
    title: "Flexible Plans",
    description: "Choose plans that adapt to your business needs, offering unparalleled scalability and cost-effectiveness",
  },
  {
    icon: RefreshCw,
    title: "Secure Transactions",
    description: "Prioritize safety with Cutting-edge encryption and robust security features for every interaction",
  },
  {
    icon: HelpCircle,
    title: "Dedicated Support",
    description: "Access expert assistance 24/7 to ensure you're never alone on your growth journey",
  },
]

export function CultureSection() {
  return (
    <section id="culture" className="w-full py-16 px-6 bg-white relative overflow-hidden">
      {/* Decorative building outline */}
      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M20 180 L20 100 L40 100 L40 80 L60 80 L60 60 L80 60 L80 40 L100 40 L100 20 L120 20 L120 40 L140 40 L140 60 L160 60 L160 80 L180 80 L180 100 L200 100 L200 180"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-black"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-start relative z-10">
        {/* Left Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Why choose us?
            </h2>
            <p className="text-base text-black/80 leading-relaxed">
              Built specifically for real estate professionals and save time, stay organized, and close more deals with less effort.
            </p>
          </div>

          {/* Image */}
          <div className="relative rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
              alt="Team collaboration at SR Holding"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Right Section - Feature Cards */}
        <div className="space-y-4">
          {featureCards.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-5 border border-black/10 hover:border-black/20 transition-all shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-black leading-tight">{feature.title}</h3>
                    <p className="text-black/70 leading-relaxed text-sm">{feature.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
