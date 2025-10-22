import { generateSEOMetadata } from '@/lib/seo'
import { Metadata } from 'next'
import { ContactPageClient } from '@/components/contact-page-client'
import { getContactDetails, initializeContactDetails } from '@/lib/models/contact-details'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await generateSEOMetadata({
    defaultTitle: 'Contact Us - SR Holding | Sofia, Bulgaria',
    defaultDescription: 'Get in touch with SR Holding in Sofia, Bulgaria for custom software development, AI solutions, and technology consulting. Available 24/7. Contact our expert team for your next project.',
    defaultKeywords: 'contact SR Holding Bulgaria, software development Sofia, technology consulting Bulgaria, custom software solutions Sofia, AI development contact Bulgaria, SR Holding Sofia'
  }, '/contact')
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: {
      ...seoData.openGraph,
      title: 'Contact Us - SR Holding | Sofia, Bulgaria',
      description: 'Get in touch with SR Holding in Sofia, Bulgaria for custom software development, AI solutions, and technology consulting. Available 24/7.',
    },
    twitter: {
      ...seoData.twitter,
      title: 'Contact Us - SR Holding | Sofia, Bulgaria',
      description: 'Get in touch with SR Holding in Sofia, Bulgaria for custom software development, AI solutions, and technology consulting. Available 24/7.',
    },
  }
}

export default async function ContactPage() {
  // Fetch contact details from database
  let contactDetails = await getContactDetails()
  
  // Initialize with default values if none exist
  if (!contactDetails) {
    contactDetails = await initializeContactDetails()
  }
  
  return <ContactPageClient contactDetails={contactDetails} />
}
