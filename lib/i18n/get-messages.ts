import type { AppLocale } from './config'

export async function getMessages(locale: AppLocale) {
  switch (locale) {
    case 'en':
      return (await import('@/messages/en/common.json')).default
    case 'bg':
      return (await import('@/messages/bg/common.json')).default
    default:
      throw new Error(`Unsupported locale: ${locale}`)
  }
}

