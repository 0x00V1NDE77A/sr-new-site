import { generateSEOMetadata } from '@/lib/seo'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await generateSEOMetadata({
    defaultTitle: 'Contact Us - SR Holding',
    defaultDescription: 'Get in touch with SR Holding for custom software development, AI solutions, and technology consulting. Contact our expert team for your next project.',
    defaultKeywords: 'contact SR Holding, software development contact, technology consulting, custom software solutions, AI development contact'
  }, '/contact')
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: {
      ...seoData.openGraph,
      title: 'Contact Us - SR Holding',
      description: 'Get in touch with SR Holding for custom software development, AI solutions, and technology consulting.',
    },
    twitter: {
      ...seoData.twitter,
      title: 'Contact Us - SR Holding',
      description: 'Get in touch with SR Holding for custom software development, AI solutions, and technology consulting.',
    },
  }
}
