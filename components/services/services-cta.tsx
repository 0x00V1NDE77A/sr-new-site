"use client"

import { motion } from "framer-motion"
import { ArrowRight, Phone, Mail } from "lucide-react"

const ServicesCTA = () => {
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
      description: "Book a free consultation to discuss your project",
      icon: Phone,
      href: "/contact",
      color: "from-gray-100 to-gray-200"
    },
    {
      title: "Send an Email",
      description: "Get in touch with our team directly",
      icon: Mail,
      href: "mailto:info@srholding.com",
      color: "from-gray-100 to-gray-200"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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
          <h2 className="mb-6 font-serif text-4xl font-bold text-black sm:text-5xl md:text-6xl">
            Ready to Get Started?
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Let's discuss your project and explore how our services can help 
              transform your business and drive innovation.
            </p>
          </motion.div>

          {/* CTA Options */}
          <motion.div
            className="grid max-w-4xl grid-cols-1 gap-6 mx-auto mb-12 md:grid-cols-2"
            variants={containerVariants}
          >
            {ctaOptions.map((option, index) => (
              <motion.a
                key={option.title}
                href={option.href}
                className="relative p-6 overflow-hidden transition-all duration-300 bg-white border border-gray-200 group rounded-xl sm:rounded-2xl hover:border-gray-300 sm:p-8"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                
                <div className="relative">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 mb-4 transition-transform duration-300 bg-gray-100 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl sm:mb-6 group-hover:scale-110">
                    <option.icon className="w-6 h-6 text-gray-600 sm:h-8 sm:w-8" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-lg font-bold text-black sm:text-xl">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 sm:text-base">
                      {option.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center mt-4 font-semibold text-black transition-opacity duration-300 opacity-0 sm:mt-6 group-hover:opacity-100">
                    <span className="text-sm sm:text-base">Get Started</span>
                    <ArrowRight className="w-3 h-3 ml-2 transition-transform transform sm:h-4 sm:w-4 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Main CTA */}
          <motion.div variants={itemVariants}>
          <motion.a
            href="/contact"
            className="inline-flex items-center gap-3 px-12 py-6 text-xl font-semibold text-white transition-all duration-300 ease-in-out bg-black rounded-full group hover:bg-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Start Your Project Today</span>
            <ArrowRight className="w-6 h-6 transition-transform transform group-hover:translate-x-1" />
          </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export { ServicesCTA }
