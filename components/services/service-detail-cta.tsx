"use client"

import { motion } from "framer-motion"
import { ArrowRight, Phone, Mail } from "lucide-react"
import type { ComponentType } from "react"

interface CTAOption {
  id: string
  title: string
  description: string
  href: string
}

interface ServiceDetailCTAProps {
  heading: string
  description: string
  primary: {
    label: string
    href: string
  }
  options: CTAOption[]
  optionsActionLabel: string
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  call: Phone,
  email: Mail,
}

const ServiceDetailCTA = ({ heading, description, primary, options, optionsActionLabel }: ServiceDetailCTAProps) => {
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

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="mb-16">
            <motion.div
              className="inline-block w-12 h-0.5 bg-black mb-4"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-black mb-6">
              {heading}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto"
            variants={containerVariants}
          >
            {options.map((option) => {
              const Icon = iconMap[option.id] ?? ArrowRight
              return (
                <motion.a
                  key={option.id}
                  href={option.href}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 p-6 sm:p-8"
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

                  <div className="relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gray-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-lg sm:text-xl font-bold text-black">
                        {option.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {option.description}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-6 flex items-center text-black font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm sm:text-base">{optionsActionLabel}</span>
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.a>
              )
            })}
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.a
              href={primary.href}
              className="group inline-flex items-center gap-3 px-12 py-6 bg-black text-white rounded-full font-semibold text-xl hover:bg-gray-800 transition-all duration-300 ease-in-out"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{primary.label}</span>
              <ArrowRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export { ServiceDetailCTA }
