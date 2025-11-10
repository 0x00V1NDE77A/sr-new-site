"use client"

import Image from "next/image"
import { PlayIcon, ArrowLeft, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const Hero = () => {
  const baseEase = [0.25, 0.46, 0.45, 0.94] as const

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: baseEase,
      },
    },
  }

  const headingLineVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: baseEase,
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
        ease: baseEase,
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: baseEase,
      },
    },
  }

  const scrollingText =
    "From custom software development to AI-powered solutions, SR Holding delivers innovative technology that transforms businesses and drives digital success."
  const words = scrollingText.split(" ")

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 3 + i * 0.1, // Start after 3 seconds, then 0.1s between each word
        duration: 0.3,
        ease: baseEase,
      },
    }),
  }

  const containerScrollVariants = {
    hidden: { x: "0%" },
    scroll: {
      x: "100%",
      transition: {
        delay: 3 + words.length * 0.1 + 1, // Wait for all words to appear + 1 second pause
        duration: 15,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear" as const,
      },
    },
  }

  return (
    <motion.section
      className="bg-black text-white py-12 md:py-20 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12 md:space-y-16 relative z-10">
        {/* Top Row: Header */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center" variants={itemVariants}>
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif leading-[0.85] tracking-tight">
            <motion.span className="block" variants={headingLineVariants}>
              Build with
            </motion.span>
            <motion.span
              className="block text-white/95 ml-8 sm:ml-12 md:ml-16 lg:ml-20 mt-2 md:mt-3"
              variants={secondLineVariants}
            >
              SR Holding
            </motion.span>
          </div>
          <motion.p
            className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-md lg:max-w-none font-light"
            variants={itemVariants}
          >
              At SR Holding, we believe that the strength of a group lies in its ability to adapt. 
          </motion.p>
        </motion.div>

        {/* Middle Row: Executive Photo */}
        <motion.div className="relative grid grid-cols-1 gap-4 md:gap-6" variants={itemVariants}>
          <motion.div
            className="relative overflow-hidden rounded-xl shadow-2xl"
            variants={imageVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.4, ease: baseEase }}
          >
            <div className="absolute inset-0 ring-1 ring-white/10 rounded-xl z-10 pointer-events-none" />
            <div className="relative w-full">
              <Image
                src="/rusev.jpg"
                alt="SR Holding Executive"
                width={832}
                height={572}
                className="w-full h-auto"
                priority
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Row: Content & Navigation */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-end" variants={itemVariants}>
          <motion.div variants={itemVariants}>
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mb-6"
              variants={itemVariants}
            >
              Building innovative software solutions for your Business
            </motion.h2>
            <motion.div className="flex items-center space-x-6 mt-6" variants={itemVariants}>
              <motion.div
                className="p-2 rounded-full hover:bg-white/5 transition-colors duration-200"
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="cursor-pointer h-5 w-5 md:h-6 md:w-6 text-white/80 hover:text-white transition-colors" />
              </motion.div>
              <div className="flex space-x-3">
                <motion.span
                  className="block w-2.5 h-2.5 bg-white rounded-full shadow-sm"
                  whileHover={{ scale: 1.3 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block w-2.5 h-2.5 bg-gray-500 rounded-full hover:bg-gray-400 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.3 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block w-2.5 h-2.5 bg-gray-500 rounded-full hover:bg-gray-400 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.3 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <motion.div
                className="p-2 rounded-full hover:bg-white/5 transition-colors duration-200"
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="cursor-pointer h-5 w-5 md:h-6 md:w-6 text-white/80 hover:text-white transition-colors" />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="overflow-hidden">
              <motion.div
                className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed font-light whitespace-nowrap"
                variants={containerScrollVariants}
                initial="hidden"
                animate="scroll"
              >
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    className="inline-block mr-1"
                    custom={index}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            </div>
            <motion.a
              href="#"
              className="inline-flex items-center space-x-3 text-white font-medium hover:text-gray-200 transition-all duration-300 group"
              variants={itemVariants}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              
              
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Hero