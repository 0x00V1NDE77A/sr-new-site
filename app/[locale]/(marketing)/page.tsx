import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Company from "@/components/company"
import { FAQSection } from "@/components/faq-section"
import Footer from "@/components/footer"
import { HomeTopClient } from "@/components/home-top-client"
import { HomeBottomClient } from "@/components/home-bottom-client"
import { TestimonialsClient } from "@/components/testimonials-client"
import PortfolioSection from "@/components/portfolio-section"

import { Suspense } from "react"
import { SEOSection } from "@/components/seo-section"
import { FAQLoadingSkeleton } from "@/components/faq-loading-skeleton"


type HomeProps = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params

  return (
    <div className="bg-black">
      {/* Enhanced Structured Data - streamed, non-blocking */}
      <Suspense>
        <SEOSection />
      </Suspense>
      
      <Navbar />
      <Hero />
      <HomeTopClient />
      <Company />
      <PortfolioSection />
      {/* <HomeBottomClient /> */}
      {/* FAQ server component - wrapped in Suspense to prevent blocking */}
      <Suspense fallback={<FAQLoadingSkeleton />}>
        <FAQSection locale={locale} />
      </Suspense>
      {/* <TestimonialsClient /> */}
      <Footer />
    </div>
  )
}
