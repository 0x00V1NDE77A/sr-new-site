import Script from 'next/script'

interface BlogPostStructuredDataProps {
  title: string
  description: string
  author: string
  publishedAt: string
  updatedAt: string
  heroImage: string
  slug: string
  category: string
  tags: string[]
}

export function BlogPostStructuredData({
  title,
  description,
  author,
  publishedAt,
  updatedAt,
  heroImage,
  slug,
  category,
  tags
}: BlogPostStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": publishedAt,
    "dateModified": updatedAt,
    "image": {
      "@type": "ImageObject",
      "url": heroImage,
      "width": 1200,
      "height": 630
    },
    "publisher": {
      "@type": "Organization",
      "name": "SR Holding",
      "logo": {
        "@type": "ImageObject",
        "url": "/placeholder-logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `/post/${slug}`
    },
    "articleSection": category,
    "keywords": tags.join(", "),
    "url": `/post/${slug}`
  }

  return (
    <Script
      id="blog-post-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}

interface BlogListingStructuredDataProps {
  title: string
  description: string
  url: string
}

export function BlogListingStructuredData({
  title,
  description,
  url
}: BlogListingStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": title,
    "description": description,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "SR Holding",
      "logo": {
        "@type": "ImageObject",
        "url": "/placeholder-logo.png"
      }
    }
  }

  return (
    <Script
      id="blog-listing-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}
