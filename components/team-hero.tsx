"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { useRef, useState, useEffect } from "react"

// Smooth typing effect component
const TypewriterText = ({ text, speed = 50, delay = 0 }: { text: string; speed?: number; delay?: number }) => {
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const startTyping = () => {
      setIsTyping(true)
      let index = 0
      
      const typeNextChar = () => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1))
          index++
          setTimeout(typeNextChar, speed)
        } else {
          setIsTyping(false)
        }
      }
      
      typeNextChar()
    }

    const timer = setTimeout(startTyping, delay)
    return () => clearTimeout(timer)
  }, [text, speed, delay])

  return <span>{displayText}</span>
}

export default function TeamHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -300])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={heroRef}
      className="relative px-4 pt-24 pb-20 overflow-hidden bg-white sm:pt-32 lg:pt-40 sm:pb-32 lg:pb-40 sm:px-6"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white"
        style={{ y: heroY }}
      />

      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <motion.div className="relative z-10 mx-auto text-center max-w-7xl" style={{ opacity: heroOpacity }}>
        <motion.div
          className="inline-flex items-center gap-2 px-6 py-3 mb-12 border rounded-full sm:gap-3 sm:px-8 sm:py-4 bg-black/5 backdrop-blur-xl sm:mb-16 border-black/10"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-black/80" />
          </motion.div>
          <span className="text-sm font-medium tracking-wide sm:text-base text-black/90">Meet the Visionaries</span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[12rem] font-bold text-black mb-8 sm:mb-12 text-balance leading-none tracking-tighter"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-transparent bg-gradient-to-r from-black via-gray-600 to-black bg-clip-text">
            Our Team
          </span>
        </motion.h1>

        <motion.p
          className="max-w-4xl px-4 mx-auto text-lg font-light leading-relaxed tracking-wide sm:text-xl lg:text-2xl text-black/70 text-pretty"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        >
                     <TypewriterText 
             text="Exceptional minds crafting extraordinary solutions. We don't just build software—" 
             speed={60}
             delay={1500}
           />
           <motion.span
             className="font-medium text-black"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 3.5, duration: 0.8 }}
           >
             <TypewriterText 
               text="we architect the future" 
               speed={80}
               delay={3500}
             />
           </motion.span>
        </motion.p>

        <motion.div
          className="flex justify-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.button
            className="flex items-center gap-2 px-8 py-4 text-base font-medium tracking-wide text-white transition-colors bg-black rounded-full group sm:gap-3 sm:px-10 sm:py-5 hover:bg-black/90 sm:text-lg"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="hidden sm:inline">Explore Our Work</span>
            <span className="sm:hidden">Our Work</span>
            <motion.div whileHover={{ x: 5, y: -5 }} transition={{ duration: 0.2 }}>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}
