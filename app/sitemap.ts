import { MetadataRoute } from 'next'
import { SUPPORTED_LOCALES } from '@/lib/i18n/config'
import clientPromise from '@/lib/mongodb'
import type { BlogPost } from '@/lib/models/blog'

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

type BlogSlugDocument = Pick<BlogPost, 'slug' | 'publishedAt' | 'updatedAt'> & {
  translations?: BlogPost['translations']
}

async function fetchPublishedBlogSlugs() {
  const client = await clientPromise
  const db = client.db()
  const blogs = await db
    .collection<BlogPost>('blogs')
    .find<BlogSlugDocument>({ status: 'published' })
    .project({ slug: 1, translations: 1, publishedAt: 1, updatedAt: 1 })
    .toArray()

  return blogs
}

function buildBlogAlternates(blog: BlogSlugDocument) {
  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => {
      const localizedSlug = blog.translations?.[locale]?.slug ?? blog.slug
      return [locale, buildLocaleUrl(locale, `/post/${localizedSlug}`)]
    })
  )
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const blogs = await fetchPublishedBlogSlugs()

    const blogEntries: MetadataRoute.Sitemap = blogs.flatMap((blog) => {
      const languages = buildBlogAlternates(blog)
      const lastModified = blog.updatedAt || blog.publishedAt || new Date()

      return SUPPORTED_LOCALES.flatMap((locale) => {
        const localizedSlug = blog.translations?.[locale]?.slug ?? blog.slug
        if (!localizedSlug) {
          return []
        }

        const path = `/post/${localizedSlug}`
        return {
          url: buildLocaleUrl(locale, path),
          lastModified,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
          alternates: {
            languages,
          },
        }
      })
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
