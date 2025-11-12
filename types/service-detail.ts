export interface ServiceDetailHeroTranslation {
  backLabel: string
  title: string
  subtitle: string
  description: string
  icon: string
  features: string[]
}

export interface DetailedFeatureTranslation {
  title: string
  description: string
  benefits: string[]
}

export interface ServiceDetailContentTranslation {
  heading: string
  subheading: string
  sections: DetailedFeatureTranslation[]
  technologiesHeading: string
  technologies: string[]
}

export interface ProcessStepTranslation {
  step: string
  title: string
  description: string
}

export interface ServiceDetailProcessTranslation {
  heading: string
  description: string
  steps: ProcessStepTranslation[]
  cta: string
  ctaHref: string
}

export interface CTAOptionTranslation {
  id: string
  title: string
  description: string
  href: string
}

export interface ServiceDetailCTATranslation {
  heading: string
  description: string
  primary: {
    label: string
    href: string
  }
  options: CTAOptionTranslation[]
  optionsActionLabel: string
}

export interface ServiceStructuredDataTranslation {
  serviceName: string
  serviceDescription: string
  serviceType: string
  areaServed: string
}

export interface ServiceDetailTranslation {
  hero: ServiceDetailHeroTranslation
  content: ServiceDetailContentTranslation
  process: ServiceDetailProcessTranslation
  cta: ServiceDetailCTATranslation
  structuredData: ServiceStructuredDataTranslation
}
