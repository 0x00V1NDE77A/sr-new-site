"use client"

import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { CountingNumber } from "./ui/counting-number"
import { FollowerPointerCard } from  "./ui/following-pointer-demo"
import Image from "next/image"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const Company = () => {
  return (
    <main className="bg-white">
      {/* Header */}
      <motion.header
        className="flex justify-center py-4 sm:py-6 md:py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="text-center">
          <motion.div
            className="inline-block w-8 sm:w-10 md:w-12 h-0.5 bg-blue-600 mb-2"
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>
          <motion.div
            className="text-xs sm:text-sm font-medium tracking-wide text-blue-600 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            THE COMPANY
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-black mb-8 sm:mb-12 md:mb-16 px-2 sm:px-0">
            From Small Startup to Big Enterprise every client matters 
          </h1>
        </motion.div>

        {/* Two Column Layout */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-16 lg:mb-20"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Left Column - Unmatched Scale */}
          <motion.div className="space-y-4 sm:space-y-6" variants={cardVariants}>
            <h2 className="text-lg sm:text-xl font-medium text-blue-600">Unmatched scale</h2>

            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed">
              <p className="font-bold text-black">
              SR Holding’s technology companies are headquartered in Bulgaria, Germany, and Dubai, where engineering talent meets business strategy.
{/* SR Software develops enterprise platforms, machine learning systems, mobile applications, and automation tools. Whether for governments, Fortune 500 corporations, or ambitious startups, SR Software builds technology designed for scale. */}
              </p>
            </div>

            <div className="pt-3 sm:pt-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Button
                  className="inline-flex items-center bg-white text-black hover:bg-white hover:underline text-lg sm:text-xl px-4 sm:px-6 py-2 sm:py-3"
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Projects Delivered */}
          <motion.div className="text-center lg:text-right" variants={cardVariants}>
            <div className="space-y-3 sm:space-y-4">
              <motion.div
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-gray-900"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <CountingNumber
                  number={584}
                  inView={true}
                  inViewOnce={true}
                  transition={{ stiffness: 40, damping: 30 }}
                  className="inline-block"
                />
                +
              </motion.div>
              <div className="text-base sm:text-lg font-medium text-gray-600">
                Projects Delivered Successfully
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                All figures as of June 30, 2025, unless
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>otherwise indicated.
              </div>
              <div className="text-xs sm:text-sm text-gray-500">*As of March 31, 2025</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Three Column Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-12 sm:pb-16"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Build IT Infrastructure */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            variants={cardVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <FollowerPointerCard title="IT Infrastructure Solutions">
              <motion.div
                className="aspect-[4/3] rounded-sm overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2134&q=80"
                  alt="Modern server infrastructure with glowing lights representing secure IT systems"
                  className="w-full h-full object-cover"
                  width={400}
                  height={300}
                />
              </motion.div>
            </FollowerPointerCard>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-blue-600">Build software infrastructure</h3>
              <p className="text-sm sm:text-base text-black leading-relaxed">
                We seek to deliver outstanding software solutions for enterprises by building secure, scalable
                applications with integrity and innovation.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 bg-black text-white hover:bg-gray-800">
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Build Your Tech Career */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            variants={cardVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <FollowerPointerCard title="Tech Career Growth">
              <motion.div
                className="aspect-[4/3] rounded-sm overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                  alt="IT professionals collaborating and advancing their careers in modern tech environment"
                  className="w-full h-full object-cover"
                  width={400}
                  height={300}
                />
              </motion.div>
            </FollowerPointerCard>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-blue-600">Build your tech career</h3>
              <p className="text-sm sm:text-base text-black leading-relaxed">
                We offer an environment where exceptional tech talent can build lasting careers. To work at SR Holding
                means being at the forefront of emerging technologies and setting industry standards.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 bg-black text-white hover:bg-gray-800">
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Build Digital Solutions */}
          <motion.div
            className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1"
            variants={cardVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <FollowerPointerCard title="Digital Innovation">
              <motion.div
                className="aspect-[4/3] rounded-sm overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                  alt="Modern tech office representing innovative digital solutions and software development"
                  className="w-full h-full object-cover"
                  width={400}
                  height={300}
                />
              </motion.div>
            </FollowerPointerCard>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-blue-600">Build digital solutions</h3>
              <p className="text-sm sm:text-base text-black leading-relaxed">
                We build digital solutions with an extensive range of tools and technologies they need to transform and
                grow their businesses through custom software development.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 bg-black text-white hover:bg-gray-800">
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}

export default Company