import { ContactDetailsSection } from '@/components/contact-details-section'
import { DynamicLocalBusinessSchema } from '@/components/structured-data/dynamic-local-business-schema'
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
  const t = await getTranslations({ locale: normalizedLocale, namespace: 'Contact.metadata' })

  const seoData = await generateSEOMetadata(
    {
      defaultTitle: t('title'),
      defaultDescription: t('description'),
      defaultKeywords: t('keywords'),
    },
    `/${normalizedLocale}/contact`
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

export default async function ContactPage({ params }: RouteParams) {
  const { locale } = params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale: normalizedLocale, namespace: 'Contact.structuredData' })

  return (
    <>
      <DynamicLocalBusinessSchema siteDescription={t('description')} />
      <ContactDetailsSection />
    </>
  )
}