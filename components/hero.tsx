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
      className="bg-black text-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 relative overflow-hidden flex items-center min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 gap-12 md:gap-16 lg:gap-20">
          {/* Top Section: Header */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center" 
            variants={itemVariants}
          >
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-serif leading-none tracking-tight text-center lg:text-left">
              <motion.span className="block" variants={headingLineVariants}>
                Build with
              </motion.span>
              <motion.span
                className="block text-white/95 lg:ml-16 mt-2"
                variants={secondLineVariants}
              >
                SR Holding
              </motion.span>
            </div>
            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-md mx-auto lg:mx-0 text-center lg:text-left"
              variants={itemVariants}
            >
              At SR Holding, we believe that the strength of a group lies in its ability to adapt. 
                {/* <motion.p 
                 className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-md mx-auto lg:mx-0 text-center lg:text-left"
                 variants={itemVariants}
                >
                  SR Holding has grown from a single software venture into a global enterprise with hubs in Bulgaria, Germany, Dubai, Turkey, and Hong Kong.
                 </motion.p> */}
            </motion.p>
           
          </motion.div>

          {/* Middle Section: Replaced Images with CTA Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" 
            variants={itemVariants}
          >
            {/* CTA Card 1: Explore Services */}
            <motion.a
              href="/services"
              className="group relative flex flex-col justify-between p-6 sm:p-8 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-2xl shadow-lg transition-all duration-300 ease-in-out overflow-hidden"
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div>
                <Layers className="h-8 w-8 text-gray-300 group-hover:text-white transition-colors" />
                <h3 className="mt-4 text-2xl lg:text-3xl font-semibold">
                  Explore Our Services
                </h3>
                <p className="mt-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                  Discover our comprehensive suite of technology solutions, from custom software to AI integration.
                </p>
              </div>
              <div className="mt-6 flex items-center text-white font-medium">
                <span>Learn More</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
            
            {/* CTA Card 2: Start a Project */}
            <motion.a
              href="/contact"
              className="group relative flex flex-col justify-between p-6 sm:p-8 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-2xl shadow-lg transition-all duration-300 ease-in-out overflow-hidden"
              variants={cardVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div>
                <Code className="h-8 w-8 text-gray-300 group-hover:text-white transition-colors" />
                <h3 className="mt-4 text-2xl lg:text-3xl font-semibold">
                  Start Your Project
                </h3>
                <p className="mt-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                  Have an idea? Let's collaborate to build the next big thing. Contact us for a consultation.
                </p>
              </div>
              <div className="mt-6 flex items-center text-white font-medium">
                <span>Get in Touch</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default Hero