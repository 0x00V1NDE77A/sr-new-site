import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ServiceDetailHero } from "@/components/services/service-detail-hero"
import { ServiceDetailContent } from "@/components/services/service-detail-content"
import { ServiceDetailProcess } from "@/components/services/service-detail-process"
import { ServiceDetailCTA } from "@/components/services/service-detail-cta"
import { Suspense } from "react"
import { SEOSection } from "@/components/seo-section"

export const metadata = {
  title: "Web Development Services - SR Holding",
  description: "Professional web development services including custom web applications, e-commerce platforms, Progressive Web Apps (PWA), API development, and performance optimization.",
  keywords: [
    "web development",
    "custom web applications",
    "e-commerce development",
    "PWA development",
    "API development",
    "web performance optimization",
    "responsive web design"
  ],
}

const serviceData = {
  title: "Web Development",
  subtitle: "Responsive and scalable web applications",
  description: "We build modern, responsive web applications that deliver exceptional user experiences across all devices. Our solutions are scalable, secure, and optimized for performance.",
  icon: "Code",
  features: [
    "Custom web applications",
    "E-commerce platforms", 
    "Progressive Web Apps (PWA)",
    "API development & integration",
    "Performance optimization"
  ],
  detailedFeatures: [
    {
      title: "Custom Web Applications",
      description: "Tailored web solutions built from scratch to meet your specific business requirements and user needs.",
      benefits: ["Scalable architecture", "Custom functionality", "Brand-aligned design", "Cross-browser compatibility"]
    },
    {
      title: "E-commerce Platforms",
      description: "Complete online store solutions with payment integration, inventory management, and customer analytics.",
      benefits: ["Payment gateway integration", "Inventory management", "Order tracking", "Customer analytics"]
    },
    {
      title: "Progressive Web Apps",
      description: "Modern web applications that provide native app-like experiences with offline functionality and push notifications.",
      benefits: ["Offline functionality", "Push notifications", "App-like experience", "Fast loading"]
    },
    {
      title: "API Development",
      description: "RESTful and GraphQL APIs that enable seamless integration between your web application and third-party services.",
      benefits: ["RESTful APIs", "GraphQL endpoints", "Third-party integration", "Documentation"]
    },
    {
      title: "Performance Optimization",
      description: "Speed optimization and SEO enhancement to ensure your web application loads quickly and ranks well in search engines.",
      benefits: ["Page speed optimization", "SEO optimization", "Core Web Vitals", "Analytics integration"]
    }
  ],
  technologies: [
    "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express.js", 
    "MongoDB", "PostgreSQL", "AWS", "Vercel", "Docker", "TypeScript"
  ],
  process: [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We analyze your requirements, define project scope, and create a detailed development roadmap."
    },
    {
      step: "02", 
      title: "Design & Prototyping",
      description: "Our team creates wireframes, mockups, and interactive prototypes to visualize your web application."
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "We build your web application using modern technologies with continuous testing and quality assurance."
    },
    {
      step: "04",
      title: "Deployment & Support",
      description: "We deploy your application and provide ongoing maintenance, updates, and technical support."
    }
  ]
}

export default function WebDevelopmentService() {
  return (
    <div className="bg-black">
      <Suspense>
        <SEOSection />
      </Suspense>
      
      <Navbar />
      <ServiceDetailHero service={serviceData} />
      <ServiceDetailContent service={serviceData} />
      <ServiceDetailProcess service={serviceData} />
      <ServiceDetailCTA service={serviceData} />
      <Footer />
    </div>
  )
}
