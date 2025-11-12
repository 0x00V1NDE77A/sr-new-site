"use client"

import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Code, Globe, Database } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

const categoryIcons = {
  promo: Code,
  finance: Database,
  corporate: Globe,
  ecommerce: Globe,
  services: Database
} as const

const projectAssets = {
  vitaminAqua: { image: "/projects/vitaminaqua.png", link: "https://www.vitaminaqua.bg/", featured: true, categoryKey: "promo" },
  koronaCredit: { image: "/projects/kora.png", link: "#", featured: false, categoryKey: "finance" },
  ramConsult: { image: "/projects/ram-consult-BfAGzGwD.png", link: "#", featured: false, categoryKey: "corporate" },
  maxiFashion: { image: "/projects/maxi-fashion.png", link: "#", featured: false, categoryKey: "ecommerce" },
  kclean: { image: "/projects/kclean.png", link: "https://www.kcleanlux.eu/", featured: false, categoryKey: "services" },
  bubbleChic: { image: "/projects/bubblechic.png", link: "https://www.bubblechic.de/", featured: false, categoryKey: "ecommerce" }
} as const

type ProjectKey = keyof typeof projectAssets

const PortfolioSection = () => {
  const t = useTranslations("Portfolio")
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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0 
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  }

  return (
    <section className="bg-white py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-gray-900 mb-6"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t("description")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {(Object.keys(projectAssets) as ProjectKey[]).map((key) => {
            const asset = projectAssets[key]
            const title = t(`projects.${key}.title`)
            const description = t(`projects.${key}.description`)
            const tags = t(`projects.${key}.tags`).split("|").map((tag) => tag.trim()).filter(Boolean)
            const categoryLabel = t(`categories.${asset.categoryKey}`)
            const IconComponent = categoryIcons[asset.categoryKey]

            return (
              <motion.div
                key={key}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                onClick={() => asset.link && window.open(asset.link, '_blank', 'noopener,noreferrer')}
              >
                {asset.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {t("featured")}
                    </span>
                  </div>
                )}

                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={asset.image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500 font-medium">
                      {categoryLabel}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-2 text-gray-900 font-medium group-hover:text-gray-700 transition-colors">
                      <span>{t("viewProject")}</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>

                    {asset.link && (
                      <a
                        href={asset.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4 text-gray-600" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mt-16"
        >
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t("cta.title")}
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>{t("cta.start")}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <button className="border border-gray-300 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                {t("cta.viewAll")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PortfolioSection
