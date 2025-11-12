import { FAQClient } from '@/components/faq-client'
import { DEFAULT_LOCALE, type AppLocale, isAppLocale } from '@/lib/i18n/config'
import { getTranslations } from 'next-intl/server'

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }
  return 'http://127.0.0.1:3000'
}

async function fetchFAQs(locale: AppLocale) {
  try {
    const baseUrl = getBaseUrl()
    const apiUrl = new URL('/api/faqs', baseUrl)
    apiUrl.searchParams.set('locale', locale)

    const response = await fetch(apiUrl.toString(), {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch FAQs: ${response.statusText}`)
    }

    const data = await response.json()
    if (data?.success && Array.isArray(data?.data)) {
      return data.data
        .map((faq: any) => ({
          question: faq?.question || '',
          answer: faq?.answer || ''
        }))
        .filter((faq: { question: string; answer: string }) => faq.question && faq.answer)
    }
  } catch (error) {
    console.error('Error fetching FAQs (server):', error)
  }

  return null
}

function mapFallbackFAQs(raw: Record<string, { question: string; answer: string }>) {
  return Object.values(raw ?? {}).filter(
    (item) => item?.question && item?.answer
  )
}

// Server component: fetch FAQs and render SEO-visible HTML
export async function FAQSection({ locale = DEFAULT_LOCALE }: { locale?: string } = {}) {
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale: normalizedLocale, namespace: 'FAQ' })
  const fallbackFAQs = mapFallbackFAQs(t.raw('fallback') as Record<string, { question: string; answer: string }>)

  const faqs = await fetchFAQs(normalizedLocale) ?? fallbackFAQs
  return <FAQClient faqs={faqs} />
}
