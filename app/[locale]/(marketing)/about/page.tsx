import { TimelineDemo } from '@/components/about/TimelineDemo'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { generateSEOMetadata } from '@/lib/seo'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DEFAULT_LOCALE, type AppLocale, isAppLocale } from '@/lib/i18n/config'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
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
