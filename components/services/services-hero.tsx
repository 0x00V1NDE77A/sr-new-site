"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface ServicesHeroProps {
  titleLine1: string
  titleLine2: string
  description: string
  ctaLabel: string
}

const ServicesHero = ({ titleLine1, titleLine2, description, ctaLabel }: ServicesHeroProps) => {
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

  const secondLineVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
      },
    },
  }

  return (
    <motion.section
      className="relative flex items-center min-h-screen py-12 overflow-hidden text-white bg-black sm:py-16 md:py-20 lg:py-24 xl:py-32"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black via-black to-gray-900/50" />

      <div className="relative z-10 w-full px-4 mx-auto max-w-7xl sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:gap-16 lg:gap-20">
          <motion.div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2 md:gap-12" variants={itemVariants}>
            <div className="font-serif text-4xl font-bold leading-none tracking-tight text-center sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl lg:text-left">
              <motion.span className="block" variants={headingLineVariants}>
                {titleLine1}
              </motion.span>
              <motion.span className="block mt-2 text-white/95 lg:ml-16" variants={secondLineVariants}>
                {titleLine2}
              </motion.span>
            </div>
            <motion.p
              className="max-w-md mx-auto text-lg leading-relaxed text-center text-gray-300 md:text-xl lg:text-2xl lg:mx-0 lg:text-left"
              variants={itemVariants}
            >
              {description}
            </motion.p>
          </motion.div>

          <motion.div className="text-center" variants={itemVariants}>
            <motion.a
              href="#services"
              className="relative inline-flex items-center gap-3 px-10 py-5 overflow-hidden text-lg font-semibold text-black transition-all duration-300 ease-in-out bg-white rounded-full group hover:bg-gray-100"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-gray-100 to-white group-hover:opacity-100" />
              <span className="relative z-10">{ctaLabel}</span>
              <ArrowRight className="relative z-10 w-5 h-5 transition-transform transform group-hover:translate-x-1" />
              <div className="absolute w-3 h-3 transition-opacity duration-300 bg-gray-200 rounded-full opacity-0 -top-1 -right-1 group-hover:opacity-100" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export { ServicesHero }
