"use client"

import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { CountingNumber } from "./ui/counting-number"
import { FollowerPointerCard } from  "./ui/following-pointer-demo"
import Image from "next/image"
import { useTranslations } from "next-intl"

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

const cardImageData = {
  infrastructure: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2134&q=80",
  career: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
  digital: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
}

const Company = () => {
  const t = useTranslations("Company")

  const cards = [
    { key: "infrastructure", href: "/services/web-development" },
    { key: "career", href: "/join-our-team" },
    { key: "digital", href: "/services" },
  ] as const

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
            {t("sectionLabel")}
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
            {t("title")}
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
            <h2 className="text-lg sm:text-xl font-medium text-blue-600">{t("scaleHeading")}</h2>

            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed">
              <p className="font-bold text-black">
                {t("scaleBody")}
              </p>
            </div>

            <div className="pt-3 sm:pt-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Button
                  className="inline-flex items-center bg-white text-black hover:bg-white hover:underline text-lg sm:text-xl px-4 sm:px-6 py-2 sm:py-3"
                >
                  {t("cta")}
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
                {t("statsHeading")}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {t("statsNote")}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">{t("statsNote2")}</div>
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
          {cards.map(({ key, href }) => (
            <motion.div
              key={key}
              className={`space-y-4 sm:space-y-6 ${key === "digital" ? "sm:col-span-2 lg:col-span-1" : ""}`}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <FollowerPointerCard title={t(`cards.${key}.title`)}>
                <motion.div
                  className="aspect-[4/3] rounded-sm overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={cardImageData[key]}
                    alt={t(`cards.${key}.imageAlt`)}
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                  />
                </motion.div>
              </FollowerPointerCard>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-medium text-blue-600">{t(`cards.${key}.heading`)}</h3>
                <p className="text-sm sm:text-base text-black leading-relaxed">
                  {t(`cards.${key}.body`)}
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 bg-black text-white hover:bg-gray-800">
                    {t("cta")}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}

export default Company