interface ProductSchemaProps {
  name: string
  description: string
  image?: string
  brand: {
    name: string
    url: string
  }
  offers?: {
    price?: string
    priceCurrency?: string
    availability?: string
    url?: string
  }
  category?: string
  sku?: string
  gtin?: string
  mpn?: string
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
    bestRating?: number
    worstRating?: number
  }
  review?: Array<{
    author: string
    reviewRating: {
      ratingValue: number
      bestRating?: number
      worstRating?: number
    }
    reviewBody: string
    datePublished: string
  }>
}

export function ProductSchema({
  name,
  description,
  image,
  brand,
  offers,
  category,
  sku,
  gtin,
  mpn,
  aggregateRating,
  review
}: ProductSchemaProps) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    ...(image && { image }),
    brand: {
      "@type": "Brand",
      name: brand.name,
      url: brand.url
    },
    ...(offers && {
      offers: {
        "@type": "Offer",
        ...offers
      }
    }),
    ...(category && { category }),
    ...(sku && { sku }),
    ...(gtin && { gtin }),
    ...(mpn && { mpn }),
    ...(aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ...aggregateRating
      }
    }),
    ...(review && {
      review: review.map(r => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: r.author
        },
        reviewRating: {
          "@type": "Rating",
          ...r.reviewRating
        },
        reviewBody: r.reviewBody,
        datePublished: r.datePublished
      }))
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
  )
}
