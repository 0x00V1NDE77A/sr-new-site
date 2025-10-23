import { FAQClient } from '@/components/faq-client'

// Server component: fetch FAQs and render SEO-visible HTML
export async function FAQSection() {
  let faqs: Array<{ question: string; answer: string }> = []

  // Fallback FAQs if database is not available
  const fallbackFAQs = [
    {
      question: "What software services does SR Holding offer?",
      answer: "SR Holding provides comprehensive software development services including web applications, mobile apps, custom software solutions, cloud integration, and digital transformation consulting. We specialize in modern technologies and scalable software architecture."
    },
    {
      question: "How can I contact SR Holding for software development projects?",
      answer: "You can contact us through our website contact form, call our direct line, or email us. Our software development team is available to discuss your project requirements and provide customized solutions for your business needs."
    },
    {
      question: "Does SR Holding work with startups and small businesses?",
      answer: "Yes, SR Holding works with businesses of all sizes, from startups and small businesses to large enterprises. We offer flexible development packages and scalable solutions that grow with your business, ensuring you get the right technology solution for your budget and requirements."
    },
    {
      question: "What makes SR Holding different from other software companies?",
      answer: "SR Holding combines cutting-edge technology expertise with deep business understanding. Our team of experienced developers uses modern frameworks and methodologies to deliver high-quality, scalable software solutions. We focus on long-term partnerships and provide ongoing support and maintenance."
    },
    {
      question: "Do you offer mobile app development?",
      answer: "Absolutely! SR Holding specializes in both iOS and Android mobile app development. We create native and cross-platform applications using the latest technologies, ensuring your mobile app delivers exceptional user experience and performance across all devices."
    }
  ]

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
    // Use fallback FAQs when database is not available
    faqs = fallbackFAQs
  }

  // Use fallback FAQs if no FAQs from database
  if (!faqs.length) {
    faqs = fallbackFAQs
  }

  // Render the original client UI with full design
  return <FAQClient faqs={faqs} />
}
