import { TimelineDemo } from '@/components/about/TimelineDemo'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { generateSEOMetadata } from '@/lib/seo'
import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await generateSEOMetadata({
    defaultTitle: 'About Us - SR Holding | Sofia, Bulgaria',
    defaultDescription: 'Learn about SR Holding\'s journey, mission, and the talented team behind our innovative software solutions in Sofia, Bulgaria. Discover our commitment to excellence in technology.',
    defaultKeywords: 'about SR Holding Sofia, software development team Bulgaria, company history Sofia, technology experts Bulgaria, software solutions Sofia'
  }, '/about')
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: {
      ...seoData.openGraph,
      title: 'About Us - SR Holding | Sofia, Bulgaria',
      description: 'Learn about SR Holding\'s journey, mission, and the talented team behind our innovative software solutions in Sofia, Bulgaria.',
    },
    twitter: {
      ...seoData.twitter,
      title: 'About Us - SR Holding | Sofia, Bulgaria',
      description: 'Learn about SR Holding\'s journey, mission, and the talented team behind our innovative software solutions in Sofia, Bulgaria.',
    },
  }
}

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <TimelineDemo />
      <Footer />
    </>
  )
}

export default AboutPage
