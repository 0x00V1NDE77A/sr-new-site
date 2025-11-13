import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { AppProviders } from '@/components/AppProviders'
import { getMessages } from '@/lib/i18n/get-messages'
import { SUPPORTED_LOCALES, type AppLocale } from '@/lib/i18n/config'
import { LocaleAttributes } from '@/components/locale-attributes'

type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
}

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://sr-redesign-nextjs.vercel.app'

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

function isSupportedLocale(locale: string): locale is AppLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale)
}

function buildLanguageAlternates(pathname: string = '') {
  return Object.fromEntries(
    SUPPORTED_LOCALES.map((loc) => {
      const path = pathname ? `/${loc}${pathname}` : `/${loc}`
      return [loc, `${APP_BASE_URL}${path}`]
    })
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isSupportedLocale(locale)) {
    notFound()
  }

  const messages = await getMessages(locale)
  const meta = (messages as any)?.Metadata ?? {}

  const defaultTitle: string = meta.defaultTitle ?? 'SR Holding'
  const titleTemplate: string = meta.titleTemplate ?? '%s | SR Holding'
  const description: string =
    meta.description ??
    'Leading software development company specialising in custom applications, AI solutions, and modern web platforms.'
  const keywords: string[] = Array.isArray(meta.keywords) ? meta.keywords : []
  const siteName: string = meta.siteName ?? 'SR Holding'
  const ogImage: string = meta.openGraph?.image ?? `${APP_BASE_URL}/logo.png`
  const ogType: 'website' | 'article' = meta.openGraph?.type ?? 'website'
  const twitterCreator: string | undefined = meta.twitter?.creator
  const twitterSite: string | undefined = meta.twitter?.site

  const canonical = `${APP_BASE_URL}/${locale}`

  return {
    metadataBase: new URL(APP_BASE_URL),
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description,
    keywords,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(),
    },
    openGraph: {
      title: defaultTitle,
      description,
      url: canonical,
      siteName,
      type: ogType,
      locale,
      alternateLocale: SUPPORTED_LOCALES.filter((loc) => loc !== locale),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: defaultTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description,
      images: [ogImage],
      creator: twitterCreator,
      site: twitterSite,
    },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!isSupportedLocale(locale)) {
    notFound()
  }

  const messages = await getMessages(locale)

  return (
    <>
      <LocaleAttributes locale={locale} />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AppProviders>
          {children}
        </AppProviders>
      </NextIntlClientProvider>
    </>
  )
}




