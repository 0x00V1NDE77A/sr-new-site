import { FAQClient } from '@/components/faq-client'
import { DEFAULT_LOCALE, type AppLocale, isAppLocale } from '@/lib/i18n/config'
import { getTranslations } from 'next-intl/server'
import { getDatabase } from '@/lib/mongodb'

async function fetchFAQs(locale: AppLocale) {
  try {
    const db = await getDatabase()
    const faqs = await db.collection('faqs')
      .find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .toArray()

    return faqs
      .map((faq: any) => {
        const translation = faq?.translations?.[locale] ?? {}
        return {
          question: translation.question ?? faq?.question ?? '',
          answer: translation.answer ?? faq?.answer ?? ''
        }
      })
      .filter((faq: { question: string; answer: string }) => faq.question && faq.answer)
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
