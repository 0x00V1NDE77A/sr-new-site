"use client"

import { motion } from "framer-motion"
import { Users, Award, Coffee, Code2, Globe, Zap } from "lucide-react"
import Link from "next/link"

const stats = [
  {
    icon: Users,
    number: "50+",
    label: "Team Members",
    description: "Talented professionals across all disciplines",
  },
  {
    icon: Award,
    number: "200+",
    label: "Projects Delivered",
    description: "Successfully completed client projects",
  },
  {
    icon: Coffee,
    number: "10K+",
    label: "Cups of Coffee",
    description: "Fuel for our creative minds",
  },
  {
    icon: Code2,
    number: "1M+",
    label: "Lines of Code",
    description: "Written with precision and care",
  },
  {
    icon: Globe,
    number: "25+",
    label: "Countries Served",
    description: "Global reach, local expertise",
  },
  {
    icon: Zap,
    number: "99.9%",
    label: "Uptime",
    description: "Reliable solutions you can trust",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function TeamStats() {
  return (
    <section className="bg-white py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-black/5 rounded-full mb-6 border border-black/10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Users className="w-5 h-5 text-black/70" />
            <span className="text-sm font-medium text-black/80 tracking-wide">Our Impact</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight text-balance">
            Numbers That
            <span className="block bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent">
              Tell Our Story
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed text-pretty">
            Behind every great team are the achievements that define our journey. Here's what we've accomplished
            together.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div key={index} variants={itemVariants} className="group">
                <motion.div
                  className="bg-white border border-black/10 rounded-3xl p-8 sm:p-10 text-center hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 relative overflow-hidden"
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Background gradient on hover */}
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <motion.div
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-black/10 transition-colors duration-300"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-black/70 group-hover:text-black transition-colors duration-300" />
                    </motion.div>

                    <motion.div
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-3 tracking-tight"
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    >
                      {stat.number}
                    </motion.div>

                    <h3 className="text-xl sm:text-2xl font-semibold text-black mb-3 tracking-wide">{stat.label}</h3>

                    <p className="text-black/60 leading-relaxed text-sm sm:text-base">{stat.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          className="text-center mt-16 sm:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/join-our-team">
            <motion.button
              className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors text-lg tracking-wide"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Our Team
              <motion.div
                className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Users className="w-3 h-3" />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
