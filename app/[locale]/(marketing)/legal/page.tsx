import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { LegalDownloadButton } from '@/components/legal-download-button'
import { getTranslations } from 'next-intl/server'
import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from '@/lib/i18n/config'

const metadataLocalePath = '/legal'

function formatDate(locale: AppLocale, date: Date) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale: normalizedLocale, namespace: 'LegalPage.metadata' })

  const seoData = await generateSEOMetadata(
    {
      defaultTitle: t('title'),
      defaultDescription: t('description'),
      defaultKeywords: t('keywords'),
    },
    `/${normalizedLocale}${metadataLocalePath}`
  )

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: {
      ...seoData.openGraph,
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
    },
    twitter: {
      ...seoData.twitter,
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
    },
  }
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale: normalizedLocale, namespace: 'LegalPage' })

  const formattedDate = formatDate(normalizedLocale, new Date())

  const privacyUsageList = t.raw('sections.privacy.usageList') as string[]
  const privacyThirdPartyItems = t.raw('sections.privacy.thirdPartyItems') as Array<{
    name: string
    description: string
  }>

  const termsLicenseList = t.raw('sections.terms.licenseList') as string[]

  const cookiesHowList = t.raw('sections.cookies.howList') as Array<{
    name: string
    description: string
  }>
  const cookiesThirdPartyList = t.raw('sections.cookies.thirdPartyList') as Array<{
    name: string
    description: string
  }>

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="max-w-4xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-black">{t('hero.title')}</h1>
          <p className="mb-6 text-lg text-gray-600">{t('hero.subtitle')}</p>
          <LegalDownloadButton />
        </div>

        <div className="space-y-16">
          <section>
            <h2 className="mb-6 text-3xl font-bold text-black">{t('sections.privacy.title')}</h2>
            <div className="prose prose-lg max-w-none text-black [&>*]:text-black [&>h3]:text-black [&>p]:text-black [&>li]:text-black [&>strong]:text-black">
              <p className="mb-6">
                <strong>{t('sections.privacy.lastUpdated', { date: formattedDate })}</strong>
              </p>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.privacy.informationTitle')}</h3>
              <p className="mb-4">{t('sections.privacy.informationBody')}</p>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.privacy.usageTitle')}</h3>
              <ul className="pl-6 mb-4 list-disc">
                {privacyUsageList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.privacy.thirdPartyTitle')}</h3>
              <p className="mb-4">{t('sections.privacy.thirdPartyIntro')}</p>
              <ul className="pl-6 mb-4 list-disc">
                {privacyThirdPartyItems.map((item) => (
                  <li key={item.name}>
                    <strong>{item.name}:</strong> {item.description}
                  </li>
                ))}
              </ul>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.privacy.securityTitle')}</h3>
              <p className="mb-4">{t('sections.privacy.securityBody')}</p>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.privacy.rightsTitle')}</h3>
              <p className="mb-4">{t('sections.privacy.rightsBody')}</p>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-bold text-black">{t('sections.terms.title')}</h2>
            <div className="prose prose-lg max-w-none text-black [&>*]:text-black [&>h3]:text-black [&>p]:text-black [&>li]:text-black [&>strong]:text-black">
              <p className="mb-6">
                <strong>{t('sections.terms.lastUpdated', { date: formattedDate })}</strong>
              </p>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.terms.acceptanceTitle')}</h3>
              <p className="mb-4">{t('sections.terms.acceptanceBody')}</p>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.terms.licenseTitle')}</h3>
              <p className="mb-4">{t('sections.terms.licenseBody')}</p>
              <ul className="pl-6 mb-4 list-disc">
                {termsLicenseList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.terms.availabilityTitle')}</h3>
              <p className="mb-4">{t('sections.terms.availabilityBody')}</p>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.terms.liabilityTitle')}</h3>
              <p className="mb-4">{t('sections.terms.liabilityBody')}</p>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.terms.lawTitle')}</h3>
              <p className="mb-4">{t('sections.terms.lawBody')}</p>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-3xl font-bold text-black">{t('sections.cookies.title')}</h2>
            <div className="prose prose-lg max-w-none text-black [&>*]:text-black [&>h3]:text-black [&>p]:text-black [&>li]:text-black [&>strong]:text-black">
              <p className="mb-6">
                <strong>{t('sections.cookies.lastUpdated', { date: formattedDate })}</strong>
              </p>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.cookies.whatTitle')}</h3>
              <p className="mb-4">{t('sections.cookies.whatBody')}</p>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.cookies.howTitle')}</h3>
              <p className="mb-4">{t('sections.cookies.howIntro')}</p>
              <ul className="pl-6 mb-4 list-disc">
                {cookiesHowList.map((item) => (
                  <li key={item.name}>
                    <strong>{item.name}:</strong> {item.description}
                  </li>
                ))}
              </ul>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.cookies.thirdPartyTitle')}</h3>
              <p className="mb-4">{t('sections.cookies.thirdPartyIntro')}</p>
              <ul className="pl-6 mb-4 list-disc">
                {cookiesThirdPartyList.map((item) => (
                  <li key={item.name}>
                    <strong>{item.name}:</strong> {item.description}
                  </li>
                ))}
              </ul>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.cookies.manageTitle')}</h3>
              <p className="mb-4">{t('sections.cookies.manageBody')}</p>

              <h3 className="mb-4 text-xl font-semibold text-black">{t('sections.cookies.contactTitle')}</h3>
              <p className="mb-4">{t('sections.cookies.contactBody')}</p>
            </div>
          </section>

          <section className="p-8 rounded-lg bg-gray-50">
            <h2 className="mb-4 text-2xl font-bold text-black">{t('sections.contact.title')}</h2>
            <div className="text-black">
              <p className="mb-2 text-black">
                <strong className="text-black">{t('sections.contact.company')}</strong>
              </p>
              <p className="mb-2 text-black">{t('sections.contact.address')}</p>
              <p className="mb-2 text-black">{t('sections.contact.email')}</p>
              <p className="mb-2 text-black">{t('sections.contact.phone')}</p>
              <p className="mt-4 text-sm text-black">{t('sections.contact.note')}</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
