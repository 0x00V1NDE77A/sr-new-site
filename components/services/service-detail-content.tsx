"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

type DetailedFeature = {
  title: string
  description: string
  benefits: string[]
}

type ServiceDetailContentProps = {
  heading: string
  subheading: string
  detailedFeatures: DetailedFeature[]
  technologiesHeading: string
  technologies: string[]
}

const ServiceDetailContent = ({ heading, subheading, detailedFeatures, technologiesHeading, technologies }: ServiceDetailContentProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-8 h-0.5 bg-black" />
            <div className="w-2 h-2 bg-black rounded-full" />
            <div className="w-8 h-0.5 bg-black" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-black mb-8 leading-tight">
            {heading}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {subheading}
          </p>
        </motion.div>

        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {detailedFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`group relative overflow-hidden ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex flex-col md:flex items-center gap-8 md:gap-12 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-gray-200 transition-all duration-500`}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-black">
                    {feature.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {feature.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors duration-200">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl opacity-50" />

                  <div className="relative p-12 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gray-100 mb-6 group-hover:scale-110 transition-transform duration-500">
                      <div className="w-12 h-12 bg-gray-300 rounded-2xl" />
                    </div>

                    <div className="space-y-2">
                      <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto" />
                      <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
                      <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-black mb-8">
            {technologiesHeading}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech) => (
              <motion.span
                key={tech}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export { ServiceDetailContent }
