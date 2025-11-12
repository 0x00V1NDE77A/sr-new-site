import React from 'react'
import { Header, TeamSection, JoinTeamButton } from '@/components/team'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { TeamSchema } from '@/components/structured-data/team-schema'
import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from '@/lib/i18n/config'
import { getTranslations } from 'next-intl/server'
import type { TeamMember } from '@/components/team/types'

type RouteParams = {
  params: Promise<{ locale: string }>
}

type TeamMemberTranslation = {
  id: number
  name: string
  role: string
  bio: string
  image: string
  linkedin?: string
  email?: string
  schema: {
    jobTitle: string
    description: string
    knowsAbout?: string[]
    address?: {
      streetAddress: string
      addressLocality: string
      addressRegion: string
      postalCode: string
      addressCountry: string
    }
  }
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { locale } = await params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale: normalizedLocale, namespace: 'Team.metadata' })

  const seoData = await generateSEOMetadata(
    {
      defaultTitle: t('title'),
      defaultDescription: t('description'),
      defaultKeywords: t('keywords'),
    },
    `/${normalizedLocale}/team`
  )

  const openGraphTitle = t('openGraphTitle')
  const openGraphDescription = t('openGraphDescription')

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: {
      ...seoData.openGraph,
      title: openGraphTitle,
      description: openGraphDescription,
    },
    twitter: {
      ...seoData.twitter,
      title: openGraphTitle,
      description: openGraphDescription,
    },
  }
}

export default async function TeamPage({ params }: RouteParams) {
  const { locale } = await params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale: normalizedLocale, namespace: 'Team' })

  const headerTitle = t('header.title')
  const headerDescription = t('header.description')
  const overlayLabel = t('overlayLabel')

  const joinTitle = t('join.title')
  const joinDescription = t('join.description')
  const joinCta = t('join.cta')
  const joinHref = `/${normalizedLocale}/join-our-team`

  const membersTranslation = t.raw('members') as TeamMemberTranslation[]

  const teamMembers: TeamMember[] = membersTranslation.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    bio: member.bio,
    image: member.image,
    linkedin: member.linkedin,
  }))

  const schemaMembers = membersTranslation.map((member) => ({
    name: member.name,
    jobTitle: member.schema.jobTitle,
    description: member.schema.description,
    image: member.image,
    email: member.email,
    knowsAbout: member.schema.knowsAbout,
    address: member.schema.address,
  }))

  return (
    <div className="min-h-screen bg-white">
      <TeamSchema
        organizationName="SR Holding"
        organizationUrl="https://sr-redesign-nextjs.vercel.app"
        teamMembers={schemaMembers}
      />

      <Navbar />
      <Header title={headerTitle} description={headerDescription} />
      <TeamSection members={teamMembers} overlayLabel={overlayLabel} />
      <JoinTeamButton
        title={joinTitle}
        description={joinDescription}
        ctaLabel={joinCta}
        href={joinHref}
      />
      <Footer />
    </div>
  )
}
