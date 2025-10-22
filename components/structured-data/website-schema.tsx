interface WebsiteSchemaProps {
  name: string
  description: string
  url: string
  potentialAction?: {
    target: string
    queryInput: string
  }
  publisher?: {
    name: string
    logo?: string
  }
}

export function WebsiteSchema({
  name,
  description,
  url,
  potentialAction,
  publisher
}: WebsiteSchemaProps) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url,
    ...(potentialAction && {
      potentialAction: {
        "@type": "SearchAction",
        target: potentialAction.target,
        "query-input": potentialAction.queryInput
      }
    }),
    ...(publisher && {
      publisher: {
        "@type": "Organization",
        name: publisher.name,
        ...(publisher.logo && { logo: publisher.logo })
      }
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  )
}
