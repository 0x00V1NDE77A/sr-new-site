import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ServicesHero } from "@/components/services/services-hero"
import ServicesGrid from "@/components/services/services-grid"
import { ServicesProcess } from "@/components/services/services-process"
import { ServicesCTA } from "@/components/services/services-cta"
import { Suspense } from "react"
import { SEOSection } from "@/components/seo-section"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from "@/lib/i18n/config"
import { generateSEOMetadata } from "@/lib/seo"

interface ServiceTranslation {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  features: string[]
  href?: string
}

interface ProcessDetailTranslation {
  title: string
  description: string
}

interface ProcessStepTranslation {
  step: string
  title: string
  description: string
  duration: string
  details: ProcessDetailTranslation[]
}

interface CTAOptionTranslation {
  id: string
  title: string
  description: string
  href: string
}

type PageParams = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale: normalizedLocale, namespace: "Services.metadata" })

  const seoData = await generateSEOMetadata(
    {
      defaultTitle: t("title"),
      defaultDescription: t("description"),
      defaultKeywords: t("keywords"),
    },
    `/${normalizedLocale}/services`
  )

  const openGraphTitle = t("openGraphTitle")
  const openGraphDescription = t("openGraphDescription")

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

export default async function Services({ params }: PageParams) {
  const { locale } = await params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale: normalizedLocale, namespace: "Services" })

  const hero = t.raw("hero") as {
    titleLine1: string
    titleLine2: string
    description: string
    cta: string
  }

  const grid = t.raw("grid") as {
    heading: string
    description: string
    cta: string
    closingHeading: string
    closingDescription: string
    closingLabel: string
    services: ServiceTranslation[]
  }

  const process = t.raw("process") as {
    heading: { lead: string; highlight: string }
    description: string
    steps: ProcessStepTranslation[]
    stats: Array<{ value: string; label: string }>
  }

  const cta = t.raw("cta") as {
    heading: string
    description: string
    primary: string
    optionsActionLabel: string
    secondary: CTAOptionTranslation[]
  }

  const localizedServices = grid.services.map((service: ServiceTranslation) => ({
    ...service,
    href: service.href ? `/${normalizedLocale}${service.href}` : undefined,
  }))

  const toLocalizedHref = (href: string) =>
    href.startsWith("mailto:") || href.startsWith("http")
      ? href
      : `/${normalizedLocale}${href}`

  const ctaOptions = cta.secondary.map((option) => ({
    ...option,
    href: toLocalizedHref(option.href),
  }))

  const primaryHref = `/${normalizedLocale}/contact`

  return (
    <div className="bg-black">
      <Suspense>
        <SEOSection />
      </Suspense>

      <Navbar />
      <ServicesHero
        titleLine1={hero.titleLine1}
        titleLine2={hero.titleLine2}
        description={hero.description}
        ctaLabel={hero.cta}
      />
      <div id="services" className="relative -top-24" aria-hidden="true" />
      <ServicesGrid
        heading={grid.heading}
        description={grid.description}
        ctaLabel={grid.cta}
        services={localizedServices}
        ctaHeading={grid.closingHeading}
        ctaDescription={grid.closingDescription}
        ctaPrimaryLabel={grid.closingLabel}
        ctaPrimaryHref={`/${normalizedLocale}/contact`}
      />
      <ServicesProcess
        headingLead={process.heading.lead}
        headingHighlight={process.heading.highlight}
        description={process.description}
        steps={process.steps}
        stats={process.stats}
      />
      <ServicesCTA
        heading={cta.heading}
        description={cta.description}
        primaryLabel={cta.primary}
        primaryHref={primaryHref}
        options={ctaOptions}
        optionsActionLabel={cta.optionsActionLabel}
      />
      <Footer />
    </div>
  )
}
