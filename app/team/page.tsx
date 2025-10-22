import React from 'react';
import { Header, TeamSection, JoinTeamButton } from '@/components/team';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { generateSEOMetadata } from '@/lib/seo'
import { Metadata } from 'next'
import { TeamSchema } from '@/components/structured-data/team-schema'

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await generateSEOMetadata({
    defaultTitle: 'Our Team - SR Holding | Sofia, Bulgaria',
    defaultDescription: 'Meet the talented team of software developers, AI experts, and technology professionals at SR Holding in Sofia, Bulgaria. Discover the people behind our innovative solutions.',
    defaultKeywords: 'SR Holding team Sofia, software developers Bulgaria, AI experts Sofia, technology professionals Bulgaria, development team Sofia, software engineers Bulgaria'
  }, '/team')
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: {
      ...seoData.openGraph,
      title: 'Our Team - SR Holding | Sofia, Bulgaria',
      description: 'Meet the talented team of software developers, AI experts, and technology professionals at SR Holding in Sofia, Bulgaria.',
    },
    twitter: {
      ...seoData.twitter,
      title: 'Our Team - SR Holding | Sofia, Bulgaria',
      description: 'Meet the talented team of software developers, AI experts, and technology professionals at SR Holding in Sofia, Bulgaria.',
    },
  }
}

export default function TeamPage() {
  // Team members data for structured data
  const teamMembers = [
    {
      name: "Rusi Russev",
      jobTitle: "CEO - Chief Executive Officer",
      description: "Rusi is the Chief Executive Officer of SR Holdings, where he leads all technical operations and oversees the full development team. He turns complex ideas into working, scalable systems — fast. Based in Sofia, Bulgaria.",
      email: "rusi.russev@srholding.org",
      knowsAbout: ["Leadership", "Technical Operations", "Strategic Planning", "Team Management", "Software Development", "Business Strategy"],
      address: {
        streetAddress: "Sofia",
        addressLocality: "Sofia",
        addressRegion: "Sofia",
        postalCode: "1000",
        addressCountry: "BG"
      }
    },
    {
      name: "Slavi Kolev",
      jobTitle: "COO - Chief Operating Officer",
      description: "Slavi Kolev is the Chief Operating Officer of SR Holding, a fast-scaling tech group delivering high-impact software across automotive, hospitality, fintech. He leads strategy, product vision, and key partnerships. Located in Sofia, Bulgaria.",
      email: "slavi.kolev@srholding.org",
      knowsAbout: ["Operations Management", "Strategic Planning", "Product Vision", "Partnership Development", "Automotive Technology", "Fintech Solutions"],
      address: {
        streetAddress: "Sofia",
        addressLocality: "Sofia",
        addressRegion: "Sofia",
        postalCode: "1000",
        addressCountry: "BG"
      }
    },
    {
      name: "Marin Nikolov",
      jobTitle: "CSO - Chief Sales Officer",
      description: "Marin Nikolov is the Chief Sales Officer at SR Software Holding, bringing a creative edge and strategic mindset shaped by his experience as founder of Nikolov Arts. Working from Sofia, Bulgaria.",
      email: "marin.nikolov@srholding.org",
      knowsAbout: ["Sales Strategy", "Business Development", "Creative Solutions", "Client Relations", "Market Expansion", "Strategic Partnerships"],
      address: {
        streetAddress: "Sofia",
        addressLocality: "Sofia",
        addressRegion: "Sofia",
        postalCode: "1000",
        addressCountry: "BG"
      }
    },
    {
      name: "Carlos Garza",
      jobTitle: "Head of US Market Expansion",
      description: "With a deep understanding of transatlantic business dynamics, he bridges the gap between Europe and the US, driving strategic partnerships and market expansion. Based in Sofia, Bulgaria.",
      email: "carlos.garza@srholding.org",
      knowsAbout: ["Market Expansion", "International Business", "Strategic Partnerships", "US Market", "Transatlantic Relations", "Business Development"],
      address: {
        streetAddress: "Sofia",
        addressLocality: "Sofia",
        addressRegion: "Sofia",
        postalCode: "1000",
        addressCountry: "BG"
      }
    },
    {
      name: "Anton Georgiev",
      jobTitle: "Senior Full-Stack Developer",
      description: "Anton Georgiev is a Senior Full-Stack Developer with deep expertise in building scalable, high-performance web applications from the ground up. Located in Sofia, Bulgaria.",
      email: "anton.georgiev@srholding.org",
      knowsAbout: ["Full-Stack Development", "Web Applications", "Scalable Systems", "High-Performance Computing", "Software Architecture", "Database Design"],
      address: {
        streetAddress: "Sofia",
        addressLocality: "Sofia",
        addressRegion: "Sofia",
        postalCode: "1000",
        addressCountry: "BG"
      }
    },
    {
      name: "Stoyan Tanev",
      jobTitle: "Sales Representative",
      description: "Stoyan Tanev is a Sales Representative at SR Software Holding, bringing a creative edge and strategic mindset shaped by his experience as founder of Nikolov Arts. Working from Sofia, Bulgaria.",
      email: "stoyan.tanev@srholding.org",
      knowsAbout: ["Sales", "Client Relations", "Business Development", "Creative Solutions", "Customer Service", "Market Research"],
      address: {
        streetAddress: "Sofia",
        addressLocality: "Sofia",
        addressRegion: "Sofia",
        postalCode: "1000",
        addressCountry: "BG"
      }
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Team structured data for SEO */}
      <TeamSchema
        organizationName="SR Holding"
        organizationUrl="https://sr-redesign-nextjs.vercel.app"
        teamMembers={teamMembers}
      />
      
      <Navbar />
      <Header />
      <TeamSection />
      <JoinTeamButton />
      <Footer />
    </div>
  );
}
