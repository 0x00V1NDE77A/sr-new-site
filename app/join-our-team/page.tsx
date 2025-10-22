import { JoinTeamJobSchema } from './job-schema'
import JoinTeamPageClient from './page-client'
import { generateSEOMetadata } from '@/lib/seo'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await generateSEOMetadata({
    defaultTitle: 'Join Our Team - SR Holding',
    defaultDescription: 'Join our talented team of software developers, AI experts, and technology professionals. Explore exciting career opportunities at SR Holding.',
    defaultKeywords: 'careers, jobs, software development careers, AI jobs, blockchain jobs, technology careers, join our team, SR Holding careers'
  }, '/join-our-team')
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: {
      ...seoData.openGraph,
      title: 'Join Our Team - SR Holding',
      description: 'Join our talented team of software developers, AI experts, and technology professionals.',
    },
    twitter: {
      ...seoData.twitter,
      title: 'Join Our Team - SR Holding',
      description: 'Join our talented team of software developers, AI experts, and technology professionals.',
    },
  }
}

export default function JoinTeamPage() {
  return (
    <>
      {/* Job Posting structured data for SEO */}
      <JoinTeamJobSchema />
      
      {/* Client component with all the animations and interactions */}
      <JoinTeamPageClient />
    </>
  )
}
