"use client"

import { motion } from "framer-motion"
import { ArrowRight, Phone, Mail } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

interface ServiceDetailCTAProps {
  service: {
    title: string
  }
}

const ServiceDetailCTA = ({ service }: ServiceDetailCTAProps) => {
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

  const ctaOptions = [
    {
      title: "Schedule a Call",
      description: `Discuss your ${service.title.toLowerCase()} project with our experts`,
      icon: Phone,
      href: "/contact",
      color: "from-gray-100 to-gray-200"
    },
    {
      title: "Send an Email",
      description: "Get a detailed proposal for your project",
      icon: Mail,
      href: "mailto:info@srholding.com",
      color: "from-gray-100 to-gray-200"
    }
  ]

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
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-16">
            <motion.div
              className="inline-block w-12 h-0.5 bg-black mb-4"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            />
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-black mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Let's discuss your {service.title.toLowerCase()} project and explore how we can help 
              transform your business with our expertise.
            </p>
          </motion.div>

          {/* CTA Options */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto"
            variants={containerVariants}
          >
            {ctaOptions.map((option, index) => (
              <motion.a
                key={option.title}
                href={option.href}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 p-6 sm:p-8"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Shining Border Effect */}
                <GlowingEffect 
                  spread={60} 
                  proximity={40} 
                  variant="default" 
                  disabled={false}
                  blur={0}
                  borderWidth={1}
                />
                
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                
                <div className="relative">
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gray-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <option.icon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                  </div>
                  {/* Content */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-black">
                      {option.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      {option.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="mt-4 sm:mt-6 flex items-center text-black font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm sm:text-base">Get Started</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Main CTA */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.a
              href="/contact"
              className="group inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 py-3.5 sm:py-4 bg-gray-900 text-white rounded-full font-semibold text-sm sm:text-base text-center hover:bg-black transition-all duration-300 ease-in-out w-full max-w-[18rem] sm:max-w-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Your {service.title} Project Today</span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-5 sm:w-5 transform group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export { ServiceDetailCTA }
export default ServiceDetailCTA