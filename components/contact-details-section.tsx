import { getContactDetails } from '@/lib/contact-details'
import { ContactPageClient } from './contact-page-client'

// Server component that fetches contact details
export async function ContactDetailsSection() {
  try {
    const contactDetails = await getContactDetails()

    return (
      <ContactPageClient
        contactDetails={
          contactDetails
            ? {
                phone: contactDetails.phone,
                email: contactDetails.email,
                address: contactDetails.address || undefined,
              }
            : undefined
        }
      />
    )
  } catch (error) {
    console.error('Error fetching contact details:', error)
    return <ContactPageClient contactDetails={undefined} />
  }
}