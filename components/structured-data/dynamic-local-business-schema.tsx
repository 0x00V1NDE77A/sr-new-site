import { LocalBusinessSchema } from './local-business-schema'

interface DynamicLocalBusinessSchemaProps {
  siteName?: string
  siteDescription?: string
  siteUrl?: string
  fallbackData?: {
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
    email: string
    openingHours?: string[]
    priceRange?: string
    image?: string
    sameAs?: string[]
  }
}

export async function DynamicLocalBusinessSchema({
  siteName = "SR Holding",
  siteDescription = "Leading software development company specializing in custom applications, AI solutions, blockchain technology, and modern web platforms.",
  siteUrl = "https://sr-redesign-nextjs.vercel.app",
  fallbackData
}: DynamicLocalBusinessSchemaProps) {
  try {
    // Fetch contact details from your admin panel API
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/contact-details`, {
      cache: 'no-store' // Always get fresh data for SEO
    })

    if (!response.ok) {
      throw new Error('Failed to fetch contact details')
    }

    const data = await response.json()
    
    if (!data.success || !data.data) {
      throw new Error('Invalid contact details response')
    }

    const contactDetails = data.data

    // Parse address from the stored address string
    // Expected format: "Sofia, Bulgaria"
    const addressParts = contactDetails.address.split(', ')
    const streetAddress = addressParts[0] || "Sofia" // Use city as street address
    const addressLocality = addressParts[0] || "Sofia"
    const addressRegion = addressLocality // Use city as region for Bulgaria
    const postalCode = "1000" // Sofia postal code
    const addressCountry = "BG" // Bulgaria country code

    const businessData = {
      name: siteName,
      description: siteDescription,
      url: siteUrl,
      address: {
        streetAddress,
        addressLocality,
        addressRegion,
        postalCode,
        addressCountry
      },
      telephone: contactDetails.phone,
      email: contactDetails.email,
      openingHours: contactDetails.businessHours ? [contactDetails.businessHours] : ["Mo-Fr 09:00-17:00"],
      priceRange: contactDetails.priceRange || "$$",
      image: `${siteUrl}/logo.png`,
      sameAs: contactDetails.socialLinks ? [
        contactDetails.socialLinks.linkedin,
        contactDetails.socialLinks.twitter,
        contactDetails.socialLinks.facebook
      ].filter(Boolean) : [
        "https://www.linkedin.com/company/sr-holding",
        "https://twitter.com/srholding",
        "https://www.facebook.com/srholding"
      ]
    }

    return <LocalBusinessSchema {...businessData} />

  } catch (error) {
    console.error('Error fetching contact details for LocalBusiness schema:', error)
    
    // Fallback to provided fallback data or default values
    const defaultData = fallbackData || {
      name: siteName,
      description: siteDescription,
      url: siteUrl,
      address: {
        streetAddress: "123 Business Street",
        addressLocality: "New York",
        addressRegion: "NY",
        postalCode: "10001",
        addressCountry: "US"
      },
      telephone: "+1-555-123-4567",
      email: "info@srholding.com",
      openingHours: ["Mo-Fr 09:00-17:00"],
      priceRange: "$$",
      image: `${siteUrl}/logo.png`,
      sameAs: [
        "https://www.linkedin.com/company/sr-holding",
        "https://twitter.com/srholding",
        "https://www.facebook.com/srholding"
      ]
    }

    return <LocalBusinessSchema {...defaultData} />
  }
}
