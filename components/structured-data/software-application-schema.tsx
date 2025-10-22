interface SoftwareApplicationSchemaProps {
  name: string
  description: string
  applicationCategory: string
  operatingSystem: string[]
  softwareVersion?: string
  datePublished?: string
  dateModified?: string
  author: {
    name: string
    url: string
  }
  publisher: {
    name: string
    url: string
  }
  offers?: {
    price?: string
    priceCurrency?: string
    availability?: string
  }
  screenshot?: string
  downloadUrl?: string
  installUrl?: string
  softwareRequirements?: string
  memoryRequirements?: string
  storageRequirements?: string
  processorRequirements?: string
}

export function SoftwareApplicationSchema({
  name,
  description,
  applicationCategory,
  operatingSystem,
  softwareVersion,
  datePublished,
  dateModified,
  author,
  publisher,
  offers,
  screenshot,
  downloadUrl,
  installUrl,
  softwareRequirements,
  memoryRequirements,
  storageRequirements,
  processorRequirements
}: SoftwareApplicationSchemaProps) {
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory,
    operatingSystem,
    ...(softwareVersion && { softwareVersion }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Organization",
      name: author.name,
      url: author.url
    },
    publisher: {
      "@type": "Organization",
      name: publisher.name,
      url: publisher.url
    },
    ...(offers && {
      offers: {
        "@type": "Offer",
        ...offers
      }
    }),
    ...(screenshot && { screenshot }),
    ...(downloadUrl && { downloadUrl }),
    ...(installUrl && { installUrl }),
    ...(softwareRequirements && { softwareRequirements }),
    ...(memoryRequirements && { memoryRequirements }),
    ...(storageRequirements && { storageRequirements }),
    ...(processorRequirements && { processorRequirements })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
    />
  )
}
