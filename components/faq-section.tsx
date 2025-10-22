import { FAQClient } from '@/components/faq-client'

// Server component: fetch FAQs and render SEO-visible HTML
export async function FAQSection() {
  let faqs: Array<{ question: string; answer: string }> = []

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/faqs`, {
      next: { revalidate: 3600 } // Cache for 1 hour (3600 seconds)
    })

    if (response.ok) {
      const data = await response.json()
      if (data?.success && Array.isArray(data?.data)) {
        faqs = data.data
          .map((faq: any) => ({
            question: faq?.question || '',
            answer: faq?.answer || ''
          }))
          .filter((f: any) => f.question && f.answer)
      }
    }
  } catch (error) {
    console.error('Error fetching FAQs (server):', error)
  }

  // Return null if no FAQs - Suspense will handle the loading state
  if (!faqs.length) {
    return null
  }

  // Render the original client UI with full design
  return <FAQClient faqs={faqs} />
}
