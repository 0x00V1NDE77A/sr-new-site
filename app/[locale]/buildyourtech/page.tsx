import { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { CareerFeaturesSection } from "@/components/buildyourtech/career-features-section"
import { RadialTimelineSection } from "@/components/buildyourtech/radial-timeline-section"
import { TestimonialsSection } from "@/components/buildyourtech/testimonials-section"
import { StatsSection } from "@/components/buildyourtech/stats-section"
import { CultureSection } from "@/components/buildyourtech/culture-section"
import { CTASection } from "@/components/buildyourtech/cta-section"

export const metadata: Metadata = {
 
}

export default function SoftwareInfrastructurePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <CareerFeaturesSection/>

      {/* Stats Section */}
      <StatsSection />

      {/* Career Features Section */}
    


      {/* Timeline Section */}
      <RadialTimelineSection />

      {/* Culture/Features Section */}
      <CultureSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  )
}

