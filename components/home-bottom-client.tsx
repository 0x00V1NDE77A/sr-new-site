"use client"

import dynamic from 'next/dynamic'

const ChatWidget = dynamic(() => import("@/components/chat-widget").then(mod => ({ default: mod.ChatWidget })))
const InfiniteMovingCardsDemo = dynamic(() => import("@/components/infinite-moving-cards-demo"), { loading: () => <div className="h-32 bg-gray-900 rounded-lg animate-pulse" /> })
const FeaturesSectionDemo = dynamic(() => import("@/components/featuresection").then(mod => ({ default: mod.FeaturesSectionDemo })), { loading: () => <div className="h-64 bg-gray-900 rounded-lg animate-pulse" /> })
const GlobeDemo = dynamic(() => import("@/components/globe").then(mod => ({ default: mod.GlobeDemo })), { loading: () => <div className="bg-gray-900 rounded-lg h-96 animate-pulse" /> })
const AppleCardsCarouselDemo = dynamic(() => import("@/components/AppleCardsCarouselDemo").then(mod => ({ default: mod.AppleCardsCarouselDemo })), { loading: () => <div className="h-64 bg-gray-900 rounded-lg animate-pulse" /> })

export function HomeBottomClient() {
  return (
    <>
      <InfiniteMovingCardsDemo />
      <FeaturesSectionDemo />
      <GlobeDemo/>
      <AppleCardsCarouselDemo />
      <ChatWidget />
    </>
  )
}


