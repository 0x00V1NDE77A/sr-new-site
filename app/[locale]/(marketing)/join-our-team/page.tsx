import { JoinTeamJobSchema } from './job-schema'
import JoinTeamPageClient from './page-client'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isAppLocale, type AppLocale } from '@/lib/i18n/config'
import { generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type RouteParams = {
  params: { locale: string }
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { locale } = params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale: normalizedLocale, namespace: 'JoinTeam.metadata' })

  const seoData = await generateSEOMetadata(
    {
      defaultTitle: t('title'),
      defaultDescription: t('description'),
      defaultKeywords: t('keywords'),
    },
    `/${normalizedLocale}/join-our-team`
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

export default async function JoinTeamPage({ params }: RouteParams) {
  const { locale } = params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale: normalizedLocale, namespace: 'JoinTeam' })
  const jobs = t.raw('openPositions') as Array<{
    id: string
    title: string
    schema: {
      description: string
      datePosted: string
      validThrough: string
      employmentType: string
      jobLocation: {
        addressLocality: string
        addressRegion: string
        addressCountry: string
      }
      baseSalary: {
        currency: string
        minValue: number
        maxValue: number
      }
      workHours: string
      benefits: string[]
      qualifications: string[]
      responsibilities: string[]
      skills: string[]
      educationRequirements: string
      experienceRequirements: string
    }
  }>

  return (
    <>
      <JoinTeamJobSchema jobs={jobs} />
      <JoinTeamPageClient />
    </>
  )
}
