import { ContactPageClient } from './contact-page-client'

// Server component that fetches contact details
export async function ContactDetailsSection() {
  let contactDetails = null
  
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/contact-details`, {
      // Cache for 1 hour, revalidate in background
      next: { revalidate: 3600 }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        contactDetails = {
          phone: data.data.phone,
          email: data.data.email,
          address: data.data.address
        }
      }
    }
  } catch (error) {
    console.error('Error fetching contact details:', error)
  }
  
  // Fallback to default values if API fails
  // if (!contactDetails) {
  //   contactDetails = {
  //     phone: '+94 11 234 5678',
  //     email: 'info@srholding.lk',
  //     address: 'Sofia, Bulgaria'
  //   }
  // }
  
  return <ContactPageClient contactDetails={contactDetails || undefined} />
}