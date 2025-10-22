export interface SEOSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  defaultTitle: string
  defaultDescription: string
  defaultKeywords: string
  ogImage: string
  twitterHandle: string
  updatedAt: string
}

// Static SEO settings - no database calls for instant loading
const staticSEOSettings: SEOSettings = {
  siteName: "SR Holding",
  siteDescription: "Leading software development company based in Sofia, Bulgaria",
  siteUrl: "https://sr-redesign-nextjs.vercel.app",
  defaultTitle: "SR Holding - Software Development Company | Sofia, Bulgaria",
  defaultDescription: "Leading software development company based in Sofia, Bulgaria, specializing in custom applications, AI solutions, blockchain technology, and modern web platforms. Available 24/7.",
  defaultKeywords: "software development Sofia, web development Bulgaria, AI solutions Sofia, blockchain Bulgaria, custom applications Sofia, technology consulting Bulgaria",
  ogImage: "",
  twitterHandle: "",
  updatedAt: new Date().toISOString()
}

// Get static SEO settings - no database calls
export async function getSEOSettings(): Promise<SEOSettings> {
  // Return static settings for instant loading
  return staticSEOSettings
}

// Generate metadata for pages
export async function generateSEOMetadata(overrides: Partial<SEOSettings> = {}, pageUrl?: string): Promise<{
  title: string
  description: string
  keywords: string
  alternates: {
    canonical: string
  }
  openGraph: {
    title: string
    description: string
    url: string
    siteName: string
    images: Array<{
      url: string
      width: number
      height: number
      alt: string
    }>
  }
  twitter: {
    card: string
    title: string
    description: string
    images: string[]
    creator?: string
  }
  robots: {
    index: boolean
    follow: boolean
  }
  other: {
    'theme-color': string
    'apple-mobile-web-app-capable': string
    'apple-mobile-web-app-status-bar-style': string
    'apple-mobile-web-app-title': string
  }
}> {
  const settings = await getSEOSettings()
  const mergedSettings = { ...settings, ...overrides }

  const canonicalUrl = pageUrl ? `${mergedSettings.siteUrl}${pageUrl}` : mergedSettings.siteUrl

  return {
    title: mergedSettings.defaultTitle,
    description: mergedSettings.defaultDescription,
    keywords: mergedSettings.defaultKeywords,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: mergedSettings.defaultTitle,
      description: mergedSettings.defaultDescription,
      url: canonicalUrl,
      siteName: mergedSettings.siteName,
      images: mergedSettings.ogImage ? [
        {
          url: mergedSettings.ogImage,
          width: 1200,
          height: 630,
          alt: mergedSettings.defaultTitle
        }
      ] : []
    },
    twitter: {
      card: "summary_large_image",
      title: mergedSettings.defaultTitle,
      description: mergedSettings.defaultDescription,
      images: mergedSettings.ogImage ? [mergedSettings.ogImage] : [],
      creator: mergedSettings.twitterHandle || undefined
    },
    robots: {
      index: true,
      follow: true
    },
    other: {
      'theme-color': '#000000',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': mergedSettings.siteName
    }
  }
}

// Get static robots.txt content
export async function getRobotsTxt(): Promise<string> {
  // Static robots.txt - no database calls for instant loading
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/
Disallow: /_next/
Disallow: /private/

Sitemap: https://sr-redesign-nextjs.vercel.app/sitemap.xml`
}

// Get hardcoded head code
export async function getCustomHeadCode(): Promise<string> {
  // Hardcoded head code - no longer dynamic from admin
  return `<!-- Hardcoded head code -->
<meta name="author" content="SR Holding Team">
<meta name="robots" content="index, follow">`
}

// Get hardcoded body code
export async function getCustomBodyCode(): Promise<string> {
  // Hardcoded body code - no longer dynamic from admin
  return `<!-- Hardcoded body code -->
<script>console.log("SR Holding website loaded");</script>`
}
