"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Layers, Code } from "lucide-react"

const Hero = () => {
  // Animation variants remain largely the same, focusing on staggered entry
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
      transition: {
        duration: 0.8,
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
  
  // Re-using the image variant for the new CTA cards for a consistent feel
  const cardVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.0,
      },
    },
  }

  return (
    <motion.section
      className="relative flex items-center w-full min-h-screen pt-24 pb-12 overflow-hidden text-white bg-black sm:pt-16 sm:pb-16 md:py-20 lg:py-24 xl:py-32"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black via-black to-gray-900/50" />

      <div className="relative z-10 w-full px-4 mx-auto max-w-7xl sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:gap-16 lg:gap-20">
          {/* Top Section: Header */}
          <motion.div 
            className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2 md:gap-12" 
            variants={itemVariants}
          >
            <div className="font-serif text-4xl font-bold leading-none tracking-tight text-center sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl lg:text-left">
              <motion.span className="block" variants={headingLineVariants}>
                Build with
              </motion.span>
              <motion.span
                className="block mt-2 text-white/95 lg:ml-16"
                variants={secondLineVariants}
              >
                SR Holding
              </motion.span>
            </div>
            <motion.p
              className="max-w-md mx-auto text-lg leading-relaxed text-center text-gray-300 md:text-xl lg:text-2xl lg:mx-0 lg:text-left"
              variants={itemVariants}
            >
              At SR Holding, we believe that the strength of a group lies in its ability to adapt. 
                {/* <motion.p 
                 className="max-w-md mx-auto text-lg leading-relaxed text-center text-gray-300 md:text-xl lg:text-2xl lg:mx-0 lg:text-left"
                 variants={itemVariants}
                >
                  SR Holding has grown from a single software venture into a global enterprise with hubs in Bulgaria, Germany, Dubai, Turkey, and Hong Kong.
                 </motion.p> */}
            </motion.p>
           
          </motion.div>

          {/* Middle Section: Replaced Images with CTA Cards */}
          <motion.div 
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8" 
            variants={itemVariants}
          >
            {/* CTA Card 1: Explore Services */}
            <motion.a
              href="/services"
              className="relative flex flex-col justify-between p-6 overflow-hidden transition-all duration-300 ease-in-out shadow-lg group sm:p-8 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-2xl"
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div>
                <Layers className="w-8 h-8 text-gray-300 transition-colors group-hover:text-white" />
                <h3 className="mt-4 text-2xl font-semibold lg:text-3xl">
                  Explore Our Services
                </h3>
                <p className="mt-2 text-gray-400 transition-colors group-hover:text-gray-300">
                  Discover our comprehensive suite of technology solutions, from custom software to AI integration.
                </p>
              </div>
              <div className="flex items-center mt-6 font-medium text-white">
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform transform group-hover:translate-x-1" />
              </div>
            </motion.a>
            
            {/* CTA Card 2: Start a Project */}
            <motion.a
              href="/contact"
              className="relative flex flex-col justify-between p-6 overflow-hidden transition-all duration-300 ease-in-out shadow-lg group sm:p-8 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-2xl"
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div>
                <Code className="w-8 h-8 text-gray-300 transition-colors group-hover:text-white" />
                <h3 className="mt-4 text-2xl font-semibold lg:text-3xl">
                  Start Your Project
                </h3>
                <p className="mt-2 text-gray-400 transition-colors group-hover:text-gray-300">
                  Have an idea? Let's collaborate to build the next big thing. Contact us for a consultation.
                </p>
              </div>
              <div className="flex items-center mt-6 font-medium text-white">
                <span>Get in Touch</span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform transform group-hover:translate-x-1" />
              </div>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default Hero