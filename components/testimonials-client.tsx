"use client"

import dynamic from 'next/dynamic'

const AnimatedTestimonialsDemo = dynamic(() => import("@/components/AnimatedTestimonialsDemo").then(m => ({ default: m.AnimatedTestimonialsDemo })), { loading: () => <div className="h-64 bg-gray-900 animate-pulse rounded-lg" /> })

export function TestimonialsClient() {
  return <AnimatedTestimonialsDemo />
}


