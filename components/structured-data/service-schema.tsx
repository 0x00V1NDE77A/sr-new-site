interface ServiceSchemaProps {
  name: string
  description: string
  provider: {
    name: string
    url: string
  }
  serviceType: string
  areaServed?: string | string[]
  availableChannel?: {
    serviceUrl: string
    serviceName: string
  }
  offers?: {
    price?: string
    priceCurrency?: string
    availability?: string
  }
  category?: string
  audience?: {
    audienceType: string
  }
  hasOfferCatalog?: {
    name: string
    itemListElement: Array<{
      item: {
        name: string
        description: string
      }
    }>
  }
}

export function ServiceSchema({
  name,
  description,
  provider,
  serviceType,
  areaServed,
  availableChannel,
  offers,
  category,
  audience,
  hasOfferCatalog
}: ServiceSchemaProps) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider.name,
      url: provider.url
    },
    serviceType,
    ...(areaServed && { areaServed }),
    ...(availableChannel && {
      availableChannel: {
        "@type": "ServiceChannel",
        ...availableChannel
      }
    }),
    ...(offers && {
      offers: {
        "@type": "Offer",
        ...offers
      }
    }),
    ...(category && { category }),
    ...(audience && {
      audience: {
        "@type": "Audience",
        ...audience
      }
    }),
    ...(hasOfferCatalog && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        ...hasOfferCatalog
      }
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  )
}
