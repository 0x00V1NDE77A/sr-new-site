"use client"

import dynamic from 'next/dynamic'

// Only the parallax section (old order: after Hero, before Company)
const HeroParallaxDemo = dynamic(() => import("@/components/HeroParallaxDemo").then(m => ({ default: m.HeroParallaxDemo })), { loading: () => <div className="bg-gray-900 rounded-lg h-96 animate-pulse" /> })

export function HomeTopClient() {
  return (
    <>
      <HeroParallaxDemo />
    </>
  )
}


