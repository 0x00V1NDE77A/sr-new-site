import {getRequestConfig} from 'next-intl/server'

const SUPPORTED_LOCALES = ['en', 'bg'] as const
type AppLocale = (typeof SUPPORTED_LOCALES)[number]
const DEFAULT_LOCALE: AppLocale = 'en'

export default getRequestConfig(async ({locale}) => {
  const current: AppLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale) ? (locale as AppLocale) : DEFAULT_LOCALE
  const messages = (await import(`../messages/${current}/common.json`)).default

  return {
    locale: current,
    messages,
  }
})

