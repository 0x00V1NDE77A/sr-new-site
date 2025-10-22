"use client"

import { motion } from "framer-motion"
// Icons removed

const ServicesProcess = () => {
  const processSteps = [
    {
      step: "01",
      title: "Discovery & Consultation",
      description: "We start by understanding your business goals, challenges, and requirements through detailed consultation and discovery sessions.",
      duration: "1-2 weeks"
    },
    {
      step: "02", 
      title: "Strategy & Planning",
      description: "Our team develops a comprehensive strategy and project plan tailored to your specific needs and objectives.",
      duration: "1-3 weeks"
    },
    {
      step: "03",
      title: "Development & Implementation",
      description: "We build your solution using cutting-edge technologies and best practices, with regular updates and collaboration.",
      duration: "4-16 weeks"
    },
    {
      step: "04",
      title: "Launch & Support",
      description: "We ensure smooth deployment and provide ongoing support, maintenance, and optimization for your solution.",
      duration: "Ongoing"
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-light leading-tight text-gray-900 lg:text-5xl">
              Our <span className="font-semibold">Process</span>
            </h2>
            <p className="text-xl leading-relaxed text-gray-600">
              A proven methodology that ensures successful project delivery 
              and exceptional results for every client.
            </p>
            <div className="w-20 h-1 mt-6 bg-gray-900" />
          </motion.div>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute hidden w-px bg-gray-200 lg:block left-16 top-16 bottom-16" />
          
          <div className="space-y-16 lg:space-y-24">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="grid lg:grid-cols-[auto,1fr] gap-8 lg:gap-16 items-start">
                  {/* Step Number */}
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-6">
                    {/* Step indicator */}
                    <div className="relative">
                      <div className="relative z-10 flex items-center justify-center w-12 h-12 text-lg font-semibold text-white bg-gray-900 rounded-full">
                        {step.step}
                      </div>
                      <div className="absolute hidden w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 rounded-full lg:block top-1/2 left-1/2 -z-10" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-light text-gray-900 lg:text-3xl">
                          {step.title}
                        </h3>
                        <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
                          {step.duration}
                        </span>
                      </div>
                      <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                        {step.description}
                      </p>
                    </div>

                    {/* Process details */}
                    <div className="grid gap-4 pt-6 border-t border-gray-100 md:grid-cols-3">
                      {getProcessDetails(index).map((detail, detailIndex) => (
                        <div key={detailIndex} className="space-y-2">
                          <div className="text-sm font-medium text-gray-900">
                            {detail.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {detail.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          className="grid gap-8 p-8 mt-24 md:grid-cols-3 bg-gray-50 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="mb-2 text-3xl font-light text-gray-900">98%</div>
            <div className="text-gray-600">Project Success Rate</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-light text-gray-900">6-20</div>
            <div className="text-gray-600">Weeks Avg. Timeline</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-light text-gray-900">24/7</div>
            <div className="text-gray-600">Support & Maintenance</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function getProcessDetails(stepIndex: number) {
  const details = [
    [
      { title: "Requirements Gathering", description: "Detailed analysis of your needs" },
      { title: "Stakeholder Interviews", description: "Key decision maker alignment" },
      { title: "Technical Assessment", description: "Current system evaluation" }
    ],
    [
      { title: "Architecture Design", description: "Scalable system blueprint" },
      { title: "Technology Selection", description: "Best-fit tech stack" },
      { title: "Project Roadmap", description: "Detailed timeline & milestones" }
    ],
    [
      { title: "Agile Development", description: "Iterative build process" },
      { title: "Quality Assurance", description: "Continuous testing & review" },
      { title: "Regular Updates", description: "Weekly progress reports" }
    ],
    [
      { title: "Deployment", description: "Smooth production launch" },
      { title: "Training", description: "User onboarding & support" },
      { title: "Optimization", description: "Performance monitoring & tuning" }
    ]
  ]
  
  return details[stepIndex] || []
}

export { ServicesProcess }
