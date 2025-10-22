"use client"

import dynamic from 'next/dynamic'

// Dynamic imports for better performance
const ChatWidget = dynamic(() => import("@/components/chat-widget").then(mod => ({ default: mod.ChatWidget })))
const InfiniteMovingCardsDemo = dynamic(() => import("@/components/infinite-moving-cards-demo"), { loading: () => <div className="h-32 bg-gray-900 animate-pulse rounded-lg" /> })
const HeroSectionOne = dynamic(() => import("@/components/build-website").then(mod => ({ default: mod.HeroSectionOne })), { loading: () => <div className="h-96 bg-gray-900 animate-pulse rounded-lg" /> })
const FeaturesSectionDemo = dynamic(() => import("@/components/featuresection").then(mod => ({ default: mod.FeaturesSectionDemo })), { loading: () => <div className="h-64 bg-gray-900 animate-pulse rounded-lg" /> })
const GlobeDemo = dynamic(() => import("@/components/globe").then(mod => ({ default: mod.GlobeDemo })), { loading: () => <div className="h-96 bg-gray-900 animate-pulse rounded-lg" /> })
const AppleCardsCarouselDemo = dynamic(() => import("@/components/AppleCardsCarouselDemo").then(mod => ({ default: mod.AppleCardsCarouselDemo })), { loading: () => <div className="h-64 bg-gray-900 animate-pulse rounded-lg" /> })
const AnimatedTestimonialsDemo = dynamic(() => import("@/components/AnimatedTestimonialsDemo").then(mod => ({ default: mod.AnimatedTestimonialsDemo })), { loading: () => <div className="h-64 bg-gray-900 animate-pulse rounded-lg" /> })
const HeroParallaxDemo = dynamic(() => import("@/components/HeroParallaxDemo").then(mod => ({ default: mod.HeroParallaxDemo })), { loading: () => <div className="h-96 bg-gray-900 animate-pulse rounded-lg" /> })

export function HomePageClient() {
  return (
    <>
      <HeroParallaxDemo />
      <HeroSectionOne />
      <InfiniteMovingCardsDemo />
      <FeaturesSectionDemo />
      <GlobeDemo/>
      <AppleCardsCarouselDemo />
      <AnimatedTestimonialsDemo />
      <ChatWidget />
    </>
  )
}
