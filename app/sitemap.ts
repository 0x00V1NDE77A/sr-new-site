import { MetadataRoute } from 'next'
import { SUPPORTED_LOCALES } from '@/lib/i18n/config'

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://sr-redesign-nextjs.vercel.app'

type StaticRouteConfig = {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

const STATIC_ROUTES: StaticRouteConfig[] = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  { path: '/blogs', changeFrequency: 'daily', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/team', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/join-our-team', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/legal', changeFrequency: 'yearly', priority: 0.4 },
]

function buildLocaleUrl(locale: string, path: string) {
  const normalizedPath = path === '/' ? '' : path
  return `${APP_BASE_URL}/${locale}${normalizedPath}`
}

function buildAlternates(path: string) {
  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, buildLocaleUrl(locale, path)])
  )
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all published blog slugs
    const response = await fetch(new URL('/api/blogs/slugs', APP_BASE_URL), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch blog slugs')
    }

    const data = await response.json()
    const blogSlugs: string[] = data.slugs || []

    const blogEntries: MetadataRoute.Sitemap = blogSlugs.flatMap((slug) => {
      const path = `/post/${slug}`
      const languages = buildAlternates(path)
      return SUPPORTED_LOCALES.map((locale) => ({
        url: buildLocaleUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages,
        },
      }))
    })

    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(({ path, changeFrequency, priority }) => {
      const languages = buildAlternates(path)
      return SUPPORTED_LOCALES.map((locale) => ({
        url: buildLocaleUrl(locale, path),
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages,
        },
      }))
    })

    return [...staticEntries, ...blogEntries]
  } catch (error) {
    console.error('Error generating sitemap:', error)

    const fallbackPath = '/'
    const languages = buildAlternates(fallbackPath)

    return SUPPORTED_LOCALES.map((locale) => ({
      url: buildLocaleUrl(locale, fallbackPath),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages,
      },
    }))
  }
}
