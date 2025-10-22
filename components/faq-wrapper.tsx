"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FAQLoadingSkeleton } from './faq-loading-skeleton'

// Dynamically import FAQClient with loading skeleton
const FAQClient = dynamic(() => import('./faq-client').then(mod => ({ default: mod.FAQClient })), {
  loading: () => <FAQLoadingSkeleton />
})

export function FAQWrapper() {
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/api/faqs')
        const data = await response.json()
        
        if (data.success && data.data && Array.isArray(data.data)) {
          const formattedFAQs = data.data.map((faq: any) => ({
            question: faq.question || '',
            answer: faq.answer || ''
          })).filter((faq: any) => faq.question && faq.answer)
          
          setFaqs(formattedFAQs)
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  if (loading) {
    return <FAQLoadingSkeleton />
  }

  return <FAQClient faqs={faqs} />
}
