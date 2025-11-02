"use client"

import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Code, Globe, Smartphone, Database } from "lucide-react"
import Image from "next/image"

interface PortfolioProject {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  category: string
  link?: string
  featured?: boolean
}

const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    title: "Vitamin Aqua x Novatrade - Голямата Томбола",
    description: "Интерактивен дизайн и награди! Уникален сайт за промо кампания - вземи участие, спечели MINI и нови витамини!",
    image: "/projects/vitaminaqua.png",
    tags: ["Промо Кампания", "Интерактивен", "UX/UI Design", "Gamification"],
    category: "Промо Кампания",
    featured: true,
    link: "https://www.vitaminaqua.bg/"
  },
  {
    id: 2,
    title: "Корона Кредит",
    description: "Професионална платформа за финансови услуги с модерен дизайн и интуитивна навигация. Уебсайтът включва система за онлайн кандидатстване, калкулатор за кредити и пълна информация за услугите.",
    image: "/projects/kora.png",
    tags: ["Финанси", "UX/UI Design", "Responsive", "SEO"],
    category: "Финансови Услуги",
    link: "#"
  },
  {
    id: 3,
    title: "РАМ Консулт",
    description: "Корпоративен уебсайт за счетоводна къща с 25+ години опит. Професионална платформа представяща експертни счетоводни услуги, данъчни и правни консултации.",
    image: "/projects/ram-consult-BfAGzGwD.png",
    tags: ["Счетоводство", "Корпоративен", "Professional", "SEO"],
    category: "Корпоративни Услуги",
    link: "#"
  },
  {
    id: 4,
    title: "Maxi Fashion - Вдъхновение в големи размери",
    description: "Лидерът в модата за plus size дами ни се довери за цялостно дигитално решение. Създадохме уникален онлайн магазин, който отразява идентичността, стила и експертизата на Maxi Fashion - най-големият бранд за дамски дрехи с индивидуален подход и богата колекция за всяка визия.",
    image: "/projects/maxi-fashion.png",
    tags: ["E-Commerce", "Fashion", "Plus Size", "Онлайн Магазин"],
    category: "E-Commerce",
    link: "#"
  },
  {
    id: 5,
    title: "KCLEAN - Луксозно почистване без компромис",
    description: "Премиум сайт за услуга с акцент върху качество, стил и доволни клиенти. 100% позитивни отзиви, партньор на водещи корпоративни имена.",
    image: "/projects/kclean.png",
    tags: ["Почистване", "Premium", "Corporate", "Услуги"],
    category: "Услуги",
    link: "https://www.kcleanlux.eu/"
  },
  {
    id: 6,
    title: "BubbleChic.de - Plus Size Fashion",
    description: "Онлайн магазин за мода в големи размери. Фамилно предприятие от 1995, специализирано в мода за дами в размери 44-60. E-commerce платформа с акцент върху стил, комфорт и разнообразие.",
    image: "/projects/bubblechic.png",
    tags: ["E-Commerce", "Fashion", "Plus Size", "Shopify"],
    category: "E-Commerce",
    link: "https://www.bubblechic.de/"
  }
]

const categoryIcons = {
  "Промо Кампания": Code,
  "Финансови Услуги": Database,
  "Корпоративни Услуги": Globe,
  "E-Commerce": Globe,
  "Услуги": Database
}

const PortfolioSection = () => {
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
            Portfolio
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Realized projects that bring real results. Explore our portfolio of successful software solutions and digital transformations.
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
          {portfolioProjects.map((project, index) => {
            const IconComponent = categoryIcons[project.category as keyof typeof categoryIcons] || Code
            
            return (
              <motion.div
                key={project.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                )}

                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Project Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500 font-medium">
                      {project.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* View Project Button */}
                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-2 text-gray-900 font-medium group-hover:text-gray-700 transition-colors">
                      <span>Виж Проекта</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    {project.link && (
                      <a
                        href={project.link}
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
              Ready to Start Your Project?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our portfolio of successful clients. Let's discuss how we can bring your vision to life with cutting-edge technology solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact"
                className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Start a Project</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <button className="border border-gray-300 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                View All Projects
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PortfolioSection
