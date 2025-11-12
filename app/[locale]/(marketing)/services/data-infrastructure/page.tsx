import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ServiceDetailHero } from "@/components/services/service-detail-hero"
import { ServiceDetailContent } from "@/components/services/service-detail-content"
import { ServiceDetailProcess } from "@/components/services/service-detail-process"
import { ServiceDetailCTA } from "@/components/services/service-detail-cta"
import { Suspense } from "react"
import { SEOSection } from "@/components/seo-section"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from "@/lib/i18n/config"
import { generateSEOMetadata } from "@/lib/seo"
import { ServiceSchema } from "@/components/structured-data/service-schema"
import type {
  ServiceDetailCTATranslation,
  ServiceDetailProcessTranslation,
  ServiceDetailContentTranslation,
  ServiceDetailHeroTranslation,
  ServiceStructuredDataTranslation,
} from "@/types/service-detail"

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sr-redesign-nextjs.vercel.app"

function localizeHref(href: string, locale: AppLocale) {
  if (!href) return href
  if (href.startsWith('mailto:') || href.startsWith('http')) return href
  const normalized = href.startsWith('/') ? href : `/${href}`
  return `/${locale}${normalized}`
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale: normalizedLocale, namespace: 'ServiceDetail.dataInfrastructure.metadata' })

  const seoData = await generateSEOMetadata(
    {
      defaultTitle: t('title'),
      defaultDescription: t('description'),
      defaultKeywords: t('keywords'),
    },
    `/${normalizedLocale}/services/data-infrastructure`
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

export default async function DataInfrastructureService({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const translation = await getTranslations({ locale: normalizedLocale, namespace: 'ServiceDetail.dataInfrastructure' })

  const hero = translation.raw('hero') as ServiceDetailHeroTranslation
  const content = translation.raw('content') as ServiceDetailContentTranslation
  const process = translation.raw('process') as ServiceDetailProcessTranslation
  const cta = translation.raw('cta') as ServiceDetailCTATranslation
  const structuredData = translation.raw('structuredData') as ServiceStructuredDataTranslation

  const heroBackHref = `/${normalizedLocale}/services`
  const primaryCTA = {
    label: cta.primary.label,
    href: localizeHref(cta.primary.href, normalizedLocale),
  }
  const ctaOptions = cta.options.map((option) => ({
    ...option,
    href: localizeHref(option.href, normalizedLocale),
  }))
  const processCtaHref = localizeHref(process.ctaHref, normalizedLocale)

  return (
    <div className="bg-black">
      <Suspense>
        <SEOSection />
      </Suspense>
      <ServiceSchema
        name={structuredData.serviceName}
        description={structuredData.serviceDescription}
        provider={{ name: 'SR Holding', url: APP_BASE_URL }}
        serviceType={structuredData.serviceType}
        areaServed={structuredData.areaServed}
        availableChannel={{
          serviceUrl: `${APP_BASE_URL}/contact`,
          serviceName: 'Contact Form',
        }}
      />

      <Navbar />
      <ServiceDetailHero
        backHref={heroBackHref}
        backLabel={hero.backLabel}
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        icon={hero.icon}
        features={hero.features}
      />
      <ServiceDetailContent
        heading={content.heading}
        subheading={content.subheading}
        detailedFeatures={content.sections}
        technologiesHeading={content.technologiesHeading}
        technologies={content.technologies}
      />
      <ServiceDetailProcess
        heading={process.heading}
        description={process.description}
        steps={process.steps}
        ctaLabel={process.cta}
        ctaHref={processCtaHref}
      />
      <ServiceDetailCTA
        heading={cta.heading}
        description={cta.description}
        primary={primaryCTA}
        options={ctaOptions}
        optionsActionLabel={cta.optionsActionLabel}
      />
      <Footer />
    </div>
  )
}
