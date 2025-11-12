import Script from 'next/script'

interface BlogPostStructuredDataProps {
  title: string
  description: string
  author: string
  publishedAt: string
  updatedAt: string
  heroImage: string
  path: string
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
  path,
  category,
  tags
}: BlogPostStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  const absoluteUrl = baseUrl ? `${baseUrl}${path}` : path

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
      "@id": absoluteUrl
    },
    "articleSection": category,
    "keywords": tags.join(", "),
    "url": absoluteUrl
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  const absoluteUrl = baseUrl ? `${baseUrl}${url}` : url

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": title,
    "description": description,
    "url": absoluteUrl,
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
