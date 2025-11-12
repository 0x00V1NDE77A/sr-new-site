"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Code, Smartphone, Brain, Database, Shield } from "lucide-react"
import Link from "next/link"

const iconMap = {
  Code,
  Smartphone,
  Brain,
  Database,
  Shield
}

interface ServiceDetailHeroProps {
  backHref: string
  backLabel: string
  title: string
  subtitle: string
  description: string
  icon: string
  features: string[]
}

const ServiceDetailHero = ({ backHref, backLabel, title, subtitle, description, icon, features }: ServiceDetailHeroProps) => {
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

  const headingLineVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  }

  const IconComponent = iconMap[icon as keyof typeof iconMap] || Code

  return (
    <motion.section
      className="bg-black text-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 relative overflow-hidden flex items-center min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 gap-12 md:gap-16 lg:gap-20">
          <motion.div variants={itemVariants}>
            <Link
              href={backHref}
              className="group inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
              <span>{backLabel}</span>
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
            variants={itemVariants}
          >
            <div className="space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10">
                <IconComponent className="h-10 w-10 text-white" />
              </div>

              <div className="space-y-4">
                <motion.h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif leading-none tracking-tight"
                  variants={headingLineVariants}
                >
                  {title}
                </motion.h1>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                  {subtitle}
                </p>
              </div>

              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                {description}
              </p>

              <div className="space-y-3">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative p-12 bg-white/5 rounded-3xl border border-white/10">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-white/10">
                    <IconComponent className="h-16 w-16 text-white" />
                  </div>

                  <div className="space-y-2">
                    <div className="w-20 h-1 bg-white/20 rounded-full mx-auto" />
                    <div className="w-16 h-1 bg-white/20 rounded-full mx-auto" />
                    <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export { ServiceDetailHero }
