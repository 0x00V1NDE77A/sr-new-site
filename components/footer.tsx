"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from "lucide-react"
import { FlipButton } from "@/components/animate-ui/buttons/flip"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const t = useTranslations("Footer")
  const locale = useLocale()

  const quickLinks = [
    t("quickLinks.item1"),
    t("quickLinks.item2"),
    t("quickLinks.item3"),
    t("quickLinks.item4"),
    t("quickLinks.item5"),
  ]

  const serviceDefs: Array<{ key: string; href: string }> = [
    { key: "webDev", href: "/services/web-development" },
    { key: "ai", href: "/services/ai-integration" },
    { key: "blockchain", href: "/services/cybersecurity" },
    { key: "webApps", href: "/services/web-development" },
    { key: "mobile", href: "/services/mobile-apps" },
  ]

  const withLocale = (path: string) => {
    if (!path || path.startsWith("http") || path.startsWith("#")) {
      return path
    }
    return `/${locale}${path.startsWith("/") ? path : `/${path}`}`
  }

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={footerVariants}
      className="text-white bg-black border-t border-gray-800"
    >
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Company Info */}
             {/* Company Info */}
             <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="flex items-center justify-center w-12 h-12 mb-6 transition-colors duration-200 rounded-lg hover:bg-white/10">
              <Image
                src="/logo.png"
                alt="SR Holding Logo"
                width={40}
                height={40}
                className="object-contain w-10 h-10"
              />
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-300">
              {t("description")}
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Linkedin, href: "https://www.linkedin.com/company/sr-software-holding", label: t("socialAlt.linkedin") },
                { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61582549137239", label: t("socialAlt.facebook") },
                { icon: Instagram, href: "https://www.instagram.com/sr.holding.ltd/", label: t("socialAlt.instagram") },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-6 text-lg font-semibold">{t("quickLinks.title")}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#">
                    <FlipButton
                      frontText={link}
                      backText={t("quickLinks.cta")}
                      className="h-auto p-2 text-sm"
                      frontClassName="bg-transparent text-gray-300 hover:text-white"
                      backClassName="bg-white text-black hover:bg-gray-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <a href={withLocale("/services")} className="block mb-6 text-lg font-semibold transition-colors cursor-pointer hover:text-gray-300">
              {t("services.title")}
            </a>
            <ul className="space-y-3">
              {serviceDefs.map((service, index) => (
                <li key={index}>
                  <a href={withLocale(service.href)}>
                    <FlipButton
                      frontText={t(`services.labels.${service.key}`)}
                      backText={t("services.cta")}
                      className="h-auto p-2 text-sm"
                      frontClassName="bg-transparent text-gray-300 hover:text-white"
                      backClassName="bg-white text-black hover:bg-gray-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-6 text-lg font-semibold">{t("contact.title")}</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  {t("contact.address")}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="flex-shrink-0 w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-300">{t("contact.phone")}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="flex-shrink-0 w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-300">{t("contact.email")}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-between pt-8 mt-12 space-y-4 border-t border-gray-800 md:flex-row md:space-y-0"
        >
          <p className="text-sm text-gray-400">{t("bottomBar.copy", { year: currentYear })}</p>
          <div className="flex space-x-6">
            {[t("bottomBar.privacy"), t("bottomBar.terms"), t("bottomBar.cookies")].map((link, index) => (
              <a key={index} href={withLocale("/legal")}>
                <FlipButton
                  frontText={link}
                  backText={t("bottomBar.cta")}
                  className="h-auto p-2 text-sm"
                  frontClassName="bg-transparent text-gray-400 hover:text-white"
                  backClassName="bg-white text-black hover:bg-gray-100"
                />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Legal Disclaimer */}
        <motion.div
          variants={itemVariants}
          className="pt-8 mt-8 border-t border-gray-800"
        >
            <div className="ml-4 leading-relaxed text-gray-400">
            <p style={{ fontSize: '10px', fontWeight: '300', lineHeight: '1.5' }}>
              {t("legal")}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}
