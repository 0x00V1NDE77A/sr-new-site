interface PersonSchemaProps {
  name: string
  jobTitle: string
  description: string
  image?: string
  url?: string
  worksFor: {
    name: string
    url: string
  }
  sameAs?: string[]
  email?: string
  telephone?: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  knowsAbout?: string[]
  hasOccupation?: {
    name: string
    description: string
  }
}

export function PersonSchema({
  name,
  jobTitle,
  description,
  image,
  url,
  worksFor,
  sameAs,
  email,
  telephone,
  address,
  knowsAbout,
  hasOccupation
}: PersonSchemaProps) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description,
    ...(image && { image }),
    ...(url && { url }),
    worksFor: {
      "@type": "Organization",
      name: worksFor.name,
      url: worksFor.url
    },
    ...(sameAs && { sameAs }),
    ...(email && { email }),
    ...(telephone && { telephone }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        ...address
      }
    }),
    ...(knowsAbout && { knowsAbout }),
    ...(hasOccupation && {
      hasOccupation: {
        "@type": "Occupation",
        ...hasOccupation
      }
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  )
}
