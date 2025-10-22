import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ServicesHero } from "@/components/services/services-hero"
import ServicesGrid from "@/components/services/services-grid"
import { ServicesProcess } from "@/components/services/services-process"
import { ServicesCTA } from "@/components/services/services-cta"
import { Suspense } from "react"
import { SEOSection } from "@/components/seo-section"

export const metadata = {
  title: "Services - SR Holding",
  description: "Comprehensive software development services including Web Development, Mobile Apps, AI Integration, Data Infrastructure, and Cybersecurity solutions.",
  keywords: [
    "web development",
    "mobile app development", 
    "AI integration",
    "data infrastructure",
    "cybersecurity",
    "software development services",
    "enterprise solutions"
  ],
}

export default function Services() {
  return (
    <div className="bg-black">
      {/* Enhanced Structured Data - streamed, non-blocking */}
      <Suspense>
        <SEOSection />
      </Suspense>
      
      <Navbar />
      <ServicesHero />
      <ServicesGrid />
      <ServicesProcess />
      <ServicesCTA />
      <Footer />
    </div>
  )
}
