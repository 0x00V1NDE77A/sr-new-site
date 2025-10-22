interface ReviewSchemaProps {
  reviews: Array<{
    author: {
      name: string
      url?: string
    }
    reviewRating: {
      ratingValue: number
      bestRating?: number
      worstRating?: number
    }
    reviewBody: string
    datePublished: string
    itemReviewed?: {
      name: string
      description?: string
    }
  }>
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
    bestRating?: number
    worstRating?: number
  }
}

export function ReviewSchema({ reviews, aggregateRating }: ReviewSchemaProps) {
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    ...(aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ...aggregateRating
      }
    }),
    review: reviews.map(review => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author.name,
        ...(review.author.url && { url: review.author.url })
      },
      reviewRating: {
        "@type": "Rating",
        ...review.reviewRating
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
      ...(review.itemReviewed && {
        itemReviewed: {
          "@type": "Thing",
          ...review.itemReviewed
        }
      })
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
    />
  )
}
