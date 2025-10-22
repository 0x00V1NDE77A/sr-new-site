"use client"

import { HoverEffect } from "../ui/card-hover-effect";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

// Custom hook for number counting animation
const useCountUp = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (end - start) + start);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start]);

  return count;
};

// Component for animated number display
const AnimatedNumber = ({ value, suffix = "", prefix = "" }: { value: string; suffix?: string; prefix?: string }) => {
  // Extract numeric part and any suffix (like +, %, etc.)
  const numericMatch = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  
  if (!numericMatch) {
    return <span>{value}</span>;
  }

  const numericValue = parseFloat(numericMatch[1]);
  const originalSuffix = numericMatch[2] || suffix;

  const animatedNumber = useCountUp(numericValue, 2000);

  return (
    <span>
      {prefix}{animatedNumber}{originalSuffix}
    </span>
  );
};

export function CardHoverEffectDemo() {
  return (
    <div className="w-full px-4 py-20 bg-white sm:py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
            Numbers That
            <span className="block text-transparent bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text">
              Tell Our Story
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg leading-relaxed sm:text-xl text-black/70">
            Behind every great team are the achievements that define our journey. Here's what we've accomplished together.
          </p>
        </div>
        <HoverEffect 
          items={teamStats} 
          titleRenderer={(title) => <AnimatedNumber value={title} />}
        />

        <motion.div
          className="mt-16 text-center sm:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/join-our-team">
            <motion.button
              className="inline-flex items-center gap-3 px-8 py-4 text-lg font-medium tracking-wide text-white transition-colors bg-black rounded-full group hover:bg-black/90"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Our Team
              <motion.div
                className="flex items-center justify-center w-5 h-5 transition-colors rounded-full bg-white/20 group-hover:bg-white/30"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Users className="w-3 h-3" />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export const teamStats = [
  {
    title: "50+",
    description: "Team Members - Talented professionals across all disciplines",
    link: "#team-members",
  },
  {
    title: "200+",
    description: "Projects Delivered - Successfully completed client projects",
    link: "#projects",
  },
  {
    title: "10K+",
    description: "Cups of Coffee - Fuel for our creative minds",
    link: "#coffee",
  },
  {
    title: "1M+",
    description: "Lines of Code - Written with precision and care",
    link: "#code",
  },
  {
    title: "25+",
    description: "Countries Served - Global reach, local expertise",
    link: "#countries",
  },
  {
    title: "99.9%",
    description: "Uptime - Reliable solutions you can trust",
    link: "#uptime",
  },
];
