"use client"

import { motion } from "framer-motion"
import { Code, Smartphone, Brain, Database, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const iconMap = {
  Code,
  Smartphone,
  Brain,
  Database,
  Shield
}

interface Service {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  features: string[];
}

const ServiceDetailHero = ({ service }: { service: Service }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  const IconComponent = iconMap[service.icon as keyof typeof iconMap]

  return (
    <motion.section
      className="bg-black text-white pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-24 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900/70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 gap-12 md:gap-16 lg:gap-20">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center"
            variants={itemVariants}
          >
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight tracking-tight">
                  {service.title}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed">
                  {service.subtitle}
                </p>
              </div>

              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                {service.description}
              </p>

              <div className="space-y-3">
                {service.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0 mt-2" />
                    <span className="text-sm sm:text-base text-gray-300 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/699459/pexels-photo-699459.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt="Laptop on desk representing software infrastructure"
                  width={1120}
                  height={700}
                  className="w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[380px] object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export { ServiceDetailHero }