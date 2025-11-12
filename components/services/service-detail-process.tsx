"use client"

import { motion } from "framer-motion"

interface ProcessStep {
  step: string
  title: string
  description: string
}

interface ServiceDetailProcessProps {
  heading: string
  description: string
  steps: ProcessStep[]
  ctaLabel: string
  ctaHref: string
}

const ServiceDetailProcess = ({ heading, description, steps, ctaLabel, ctaHref }: ServiceDetailProcessProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block w-12 h-0.5 bg-white mb-4"
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-white mb-6">
            {heading}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={`${step.step}-${step.title}`}
              className="relative group"
              variants={itemVariants}
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-700 z-0" />
              )}

              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r ${
                    index === 0 ? 'from-blue-500 to-cyan-500' :
                    index === 1 ? 'from-purple-500 to-pink-500' :
                    index === 2 ? 'from-green-500 to-emerald-500' :
                    'from-orange-500 to-red-500'
                  } flex items-center justify-center text-white font-bold text-sm sm:text-lg`}>
                    {step.step}
                  </div>
                  <div className="hidden sm:block w-6 sm:w-8 h-0.5 bg-gray-700" />
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg" />
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.a
            href={ctaHref}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 ease-in-out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{ctaLabel}</span>
            <motion.div
              className="w-5 h-5"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export { ServiceDetailProcess }
