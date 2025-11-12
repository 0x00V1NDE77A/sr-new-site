import { TimelineDemo } from '@/components/about/TimelineDemo'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { generateSEOMetadata } from '@/lib/seo'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type AppLocale, isAppLocale } from '@/lib/i18n/config'

type RouteParams = {
  params: { locale: string }
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { locale } = params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const metadataTranslations = await getTranslations({
    locale: normalizedLocale,
    namespace: 'About.metadata',
  })

  const defaults = {
    defaultTitle: metadataTranslations('title'),
    defaultDescription: metadataTranslations('description'),
    defaultKeywords: metadataTranslations('keywords'),
  }

  const seoData = await generateSEOMetadata(defaults, `/${normalizedLocale}/about`)

  const openGraphTitle = metadataTranslations('openGraphTitle')
  const openGraphDescription = metadataTranslations('openGraphDescription')

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

export default async function AboutPage({ params }: RouteParams) {
  const { locale } = params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  // The TimelineDemo component handles its own translations client-side if needed.

  return (
    <>
      <Navbar />
      <TimelineDemo />
      <Footer />
    </>
  )
}
