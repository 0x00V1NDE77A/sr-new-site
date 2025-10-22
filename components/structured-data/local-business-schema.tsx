interface LocalBusinessSchemaProps {
  name: string
  description: string
  url: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  telephone: string
  email?: string
  openingHours?: string[]
  priceRange?: string
  image?: string
  sameAs?: string[]
}

export function LocalBusinessSchema({
  name,
  description,
  url,
  address,
  telephone,
  email,
  openingHours,
  priceRange,
  image,
  sameAs = []
}: LocalBusinessSchemaProps) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url,
    address: {
      "@type": "PostalAddress",
      ...address
    },
    telephone,
    ...(email && { email }),
    ...(openingHours && { openingHours }),
    ...(priceRange && { priceRange }),
    ...(image && { image }),
    ...(sameAs.length > 0 && { sameAs })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  )
}
