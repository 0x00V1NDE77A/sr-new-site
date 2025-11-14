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
      className="bg-black text-white py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 relative overflow-hidden flex items-center min-h-[60vh]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 gap-12 md:gap-16 lg:gap-20">

          {/* Main Content */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center" 
            variants={itemVariants}
          >
            {/* Left Side - Content */}
            <div className="space-y-8">
              {/* Service Icon removed per request */}

              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif leading-none tracking-tight">
                  {service.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                  {service.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                {service.description}
              </p>

              {/* Features List */}
              <div className="space-y-3">
                {service.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                <Image
                  src="https://images.pexels.com/photos/699459/pexels-photo-699459.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt="Laptop on desk representing software infrastructure"
                  width={1120}
                  height={700}
                  className="w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[360px] object-cover"
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

export default ServiceDetailHero
export { ServiceDetailHero }