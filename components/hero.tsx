"use client"

import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

const Hero = () => {
  const t = useTranslations("Hero")
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

  const scrollingText = t("marquee")
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
      className="relative pt-24 pb-12 overflow-hidden text-white bg-black md:pt-24 md:pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black via-black to-gray-900/50" />

      <div className="relative z-10 px-4 mx-auto space-y-12 max-w-7xl md:px-6 md:space-y-16">
        {/* Top Row: Header */}
        <motion.div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2 md:gap-12" variants={itemVariants}>
          <div className="text-[clamp(2.5rem,6vw,3.5rem)] sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif leading-[0.95] sm:leading-[0.85] tracking-tight text-balance">
            <motion.span className="block break-words" variants={headingLineVariants}>
              {t("headingLine1")}
            </motion.span>
            <motion.span
              className="block mt-2 ml-4 break-words text-white/95 sm:ml-12 md:ml-16 lg:ml-20 md:mt-3"
              variants={secondLineVariants}
            >
              {t("headingLine2")}
            </motion.span>
          </div>
          <motion.p
            className="max-w-md text-base font-light leading-relaxed text-gray-300 md:text-lg lg:text-xl lg:max-w-none"
            variants={itemVariants}
          >
            {t("tagline")}
          </motion.p>
        </motion.div>

        {/* Middle Row: Executive Photo */}
        <motion.div className="relative grid grid-cols-1 gap-4 md:gap-6" variants={itemVariants}>
          <motion.div
            className="relative overflow-hidden shadow-2xl rounded-xl"
            variants={imageVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.4, ease: baseEase }}
          >
            <div className="absolute inset-0 z-10 pointer-events-none ring-1 ring-white/10 rounded-xl" />
            <div className="relative w-full">
              <Image
                src="/rusev.jpg"
                alt={t("imageAlt")}
                width={832}
                height={572}
                className="w-full h-auto"
                priority
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Row: Content & Navigation */}
        <motion.div className="grid items-end grid-cols-1 gap-8 lg:grid-cols-2 md:gap-12" variants={itemVariants}>
          <motion.div variants={itemVariants}>
            <motion.h2
              className="mb-6 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
              variants={itemVariants}
            >
              {t("subheading")}
            </motion.h2>
            <motion.div className="flex items-center mt-6 space-x-6" variants={itemVariants}>
              <motion.div
                className="p-2 transition-colors duration-200 rounded-full hover:bg-white/5"
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="w-5 h-5 transition-colors cursor-pointer md:h-6 md:w-6 text-white/80 hover:text-white" />
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
                className="p-2 transition-colors duration-200 rounded-full hover:bg-white/5"
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-5 h-5 transition-colors cursor-pointer md:h-6 md:w-6 text-white/80 hover:text-white" />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="overflow-hidden">
              <motion.div
                className="text-sm font-light leading-relaxed text-gray-300 md:text-base lg:text-lg whitespace-nowrap"
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
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Hero