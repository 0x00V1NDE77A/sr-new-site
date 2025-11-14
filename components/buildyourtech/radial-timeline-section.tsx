"use client"

import { useEffect, useRef, useState } from "react"

interface TimelineItem {
  year: string
  title: string
  description: string
}

const timelineData: TimelineItem[] = [
  {
    year: "2020",
    title: "AI Integration",
    description: "Launched AI and machine learning solutions for enterprise clients.",
  },
  {
    year: "2021",
    title: "Global Expansion",
    description: "Expanded operations to multiple countries, building a global team.",
  },
  {
    year: "2022",
    title: "500+ Projects",
    description: "Reached a milestone of delivering 500+ successful projects.",
  },
  {
    year: "2023",
    title: "Fintech Innovation",
    description: "Introduced cutting-edge fintech solutions and blockchain technology.",
  },
  {
    year: "2024",
    title: "Market Leadership",
    description: "Established as a leading technology solutions provider globally.",
  },
  {
    year: "2025",
    title: "Future Vision",
    description: "Continuing to shape the future of technology and innovation.",
  },
]

export function RadialTimelineSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const radius = 200

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % timelineData.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full py-16 px-6 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
            Our Journey
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-white">
            Timeline of Excellence
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            A journey through our milestones and achievements over the years.
          </p>
        </div>

        <div ref={containerRef} className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center">
          {/* Central circle */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-black border-2 border-accent/50 flex items-center justify-center backdrop-blur overflow-hidden">
              <img
                src="/logo.png"
                alt="SR Logo"
                className="w-full h-full object-contain p-4"
              />
            </div>
          </div>

          {/* Orbital items */}
          {timelineData.map((item, index) => {
            const angle = (index * 360) / timelineData.length - 90
            const x = Math.cos((angle * Math.PI) / 180) * radius
            const y = Math.sin((angle * Math.PI) / 180) * radius
            const isActive = activeIndex === index
            const isHovered = hoveredIndex === index
            return (
                <div
                  key={index}
                  className="absolute transition-all duration-700 ease-in-out group"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                    zIndex: isActive || isHovered ? 20 : 10,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Connecting line */}
                  <div
                    className="absolute w-px bg-gradient-to-b from-accent/40 to-transparent transition-all duration-500"
                    style={{
                      left: "50%",
                      top: "50%",
                      height: `${radius}px`,
                      transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                      transformOrigin: "bottom center",
                      opacity: isActive || isHovered ? 0.7 : 0.2,
                    }}
                  />
  
                  {/* Timeline node */}
                  <div
                    className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full border-2 transition-all duration-500 ${
                      isActive || isHovered
                        ? "bg-accent border-accent scale-125 shadow-lg shadow-accent/50 ring-2 ring-accent/30"
                        : "bg-black border-accent/50 scale-100 hover:scale-110"
                    }`}
                    onClick={() => setActiveIndex(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-500 ${
                          isActive || isHovered ? "bg-white scale-110" : "bg-accent/60"
                        }`}
                      />
                    </div>
                    {/* Year badge on node */}
                    <div
                      className={`absolute -top-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[10px] font-medium transition-all duration-500 whitespace-nowrap ${
                        isActive || isHovered
                          ? "opacity-100 translate-y-0 bg-accent text-white"
                          : "opacity-0 translate-y-2 pointer-events-none"
                      }`}
                    >
                      {item.year}
                    </div>
                  </div>
  
                  {/* Content card */}
                  <div
                    className={`absolute mt-3 md:mt-4 w-56 md:w-64 transition-all duration-500 ${
                      isActive || isHovered
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-4 pointer-events-none"
                    }`}
                    style={{
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="bg-gray-900/95 border border-white/20 rounded-xl p-3 md:p-4 shadow-xl backdrop-blur-sm">
                      <div className="text-xs font-medium text-accent mb-1.5">{item.year}</div>
                      <h3 className="text-base md:text-lg font-bold text-white mb-1.5">{item.title}</h3>
                      <p className="text-xs text-white/80 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
  
            {/* Orbital ring */}
            <div
              className="absolute inset-0 border border-accent/20 rounded-full"
              style={{
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
          {/* Timeline indicators (mobile) */}
        <div className="flex justify-center gap-2 mt-8 md:hidden">
          {timelineData.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                activeIndex === index ? "bg-accent w-8" : "bg-accent/30"
              }`}
              aria-label={`Go to ${timelineData[index].year}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}