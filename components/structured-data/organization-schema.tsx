interface OrganizationSchemaProps {
  name: string
  description: string
  url: string
  logo?: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint?: {
    telephone: string
    contactType: string
    email?: string
  }
  sameAs?: string[]
}

export function OrganizationSchema({
  name,
  description,
  url,
  logo,
  address,
  contactPoint,
  sameAs = []
}: OrganizationSchemaProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description,
    url,
    ...(logo && { logo }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        ...address
      }
    }),
    ...(contactPoint && {
      contactPoint: {
        "@type": "ContactPoint",
        ...contactPoint
      }
    }),
    ...(sameAs.length > 0 && { sameAs })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  )
}
