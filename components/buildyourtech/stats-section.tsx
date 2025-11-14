"use client"

import { useEffect, useRef, useState } from "react"

interface StatItem {
  label: string
  value: number
  suffix?: string
}

function AnimatedCounter({ value, suffix = "", duration = 3500 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const endValue = value

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(easeOutQuart * endValue)

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }

    animate()
  }, [isVisible, value, duration])

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-black mb-1">
      {count}{suffix}
    </div>
  )
}

export function StatsSection() {
  const stats: StatItem[] = [
    { label: "Employees", value: 50, suffix: "+" },
    { label: "Countries", value: 25, suffix: "+" },
    { label: "Projects Delivered", value: 584, suffix: "+" },
    { label: "Year Founded", value: 2020 },
  ]

  return (
    <section className="relative w-full py-12 px-6 bg-white -mt-16 md:-mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white border border-black/10 backdrop-blur hover:border-accent/40 transition-all shadow-sm"
          >
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            <div className="text-xs md:text-sm text-black">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
