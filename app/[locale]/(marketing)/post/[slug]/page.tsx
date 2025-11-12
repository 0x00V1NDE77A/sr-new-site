import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Post, PostFragment } from "@/components/post"
import { MoreStories } from "@/components/more-stories"
import { PostMetaFragment } from "@/components/hero-post"
import { BlogPostStructuredData } from "@/components/structured-data"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type AppLocale, isAppLocale } from "@/lib/i18n/config"
import { getTranslations } from "next-intl/server"
import { generateSEOMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"
export const revalidate = 0

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sr-redesign-nextjs.vercel.app"

async function getBlogBySlug(slug: string, locale: AppLocale) {
  try {
    const url = new URL(`/api/blogs/${slug}`, APP_BASE_URL)
    url.searchParams.set('locale', locale)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch blog')
    }

    const data = await response.json()
    return data.blog
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

async function getRelatedBlogs(locale: AppLocale, currentSlug: string, limit: number = 8) {
  try {
    const url = new URL('/api/blogs', APP_BASE_URL)
    url.searchParams.set('limit', limit.toString())
    url.searchParams.set('sort', 'publishedAt')
    url.searchParams.set('order', 'desc')
    url.searchParams.set('locale', locale)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch related blogs')
    }

    const data = await response.json()
    return (data.blogs || []).filter((blog: any) => blog.slug !== currentSlug).slice(0, limit)
  } catch (error) {
    console.error('Error fetching related blogs:', error)
    return []
  }
}

type PostFallbacks = {
  untitled: string
  unknownAuthor: string
  noExcerpt: string
}

function transformBlogData(blog: any, locale: AppLocale, fallbacks: PostFallbacks): PostFragment | null {
  if (!blog) {
    console.warn('Invalid blog data:', blog)
    return null
  }

  const contentBlocks = Array.isArray(blog.content) ? blog.content : []
  const validContentBlocks = contentBlocks.filter((block: any) =>
    block && block.type && block.content && String(block.content).trim()
  )

  return {
    _id: blog._id?.toString() || 'unknown',
    _slug: blog.slug || 'unknown',
    _title: blog.title || fallbacks.untitled,
    href: `/${locale}/post/${blog.slug || 'unknown'}`,
    author: {
      _title: blog.author?.name || fallbacks.unknownAuthor,
      avatar: {
        url: blog.author?.avatar || "/placeholder-user.jpg",
        alt: blog.author?.name || fallbacks.unknownAuthor
      }
    },
    coverImage: {
      url: blog.heroImage || "/placeholder.jpg",
      alt: blog.title || fallbacks.untitled,
      aspectRatio: 1.5
    },
    date: blog.publishedAt || blog.createdAt || new Date().toISOString(),
    excerpt: blog.excerpt || fallbacks.noExcerpt,
    body: {
      json: {
        content: validContentBlocks
      }
    }
  }
}

function transformBlogForMoreStories(blog: any, locale: AppLocale, fallbacks: PostFallbacks): PostMetaFragment {
  return {
    _id: blog._id?.toString() ?? 'unknown',
    _slug: blog.slug ?? 'unknown',
    _title: blog.title ?? fallbacks.untitled,
    href: `/${locale}/post/${blog.slug ?? 'unknown'}`,
    author: {
      _title: blog.author?.name ?? fallbacks.unknownAuthor,
      avatar: {
        url: blog.author?.avatar || "/placeholder-user.jpg",
        alt: blog.author?.name ?? fallbacks.unknownAuthor
      }
    },
    coverImage: {
      url: blog.heroImage || "/placeholder.jpg",
      alt: blog.title ?? fallbacks.untitled,
      aspectRatio: 1.5
    },
    date: blog.publishedAt || blog.createdAt || new Date().toISOString(),
    excerpt: blog.excerpt || fallbacks.noExcerpt
  }
}

export async function generateStaticParams() {
  try {
    const url = new URL('/api/blogs/slugs', APP_BASE_URL)
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return SUPPORTED_LOCALES.flatMap((locale) =>
      (data.slugs as string[] | undefined)?.map((slug) => ({ locale, slug })) ?? []
    )
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

type PageParams = { locale: string; slug: string }

type PageProps = { params: PageParams }

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const locale: AppLocale = isAppLocale(params.locale) ? params.locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale, namespace: 'BlogPost' })
  const blog = await getBlogBySlug(params.slug, locale)

  if (!blog) {
    return {
      title: t('metadata.notFoundTitle'),
      description: t('metadata.notFoundDescription')
    }
  }

  const seoData = await generateSEOMetadata(
    {
      defaultTitle: `${blog.title} | ${t('metadata.siteTitle')}`,
      defaultDescription: blog.seo?.metaDescription || blog.excerpt || '',
      defaultKeywords: Array.isArray(blog.seo?.keywords) ? blog.seo?.keywords.join(', ') : undefined
    },
    `/${locale}/post/${blog.slug}`
  )

  const postOgImage = blog.seo?.socialImage || blog.heroImage || "/placeholder.jpg"
  const languageAlternates = Object.fromEntries(
    SUPPORTED_LOCALES.map((loc) => [loc, `${APP_BASE_URL}/${loc}/post/${blog.slug}`])
  )

  return {
    ...seoData,
    alternates: {
      canonical: `${APP_BASE_URL}/${locale}/post/${blog.slug}`,
      languages: languageAlternates,
    },
    openGraph: {
      ...seoData.openGraph,
      type: "article",
      locale,
      alternateLocale: SUPPORTED_LOCALES.filter((loc) => loc !== locale),
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author?.name ?? 'SR Holding'],
      images: [
        {
          url: postOgImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      ...seoData.twitter,
      images: [postOgImage],
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const locale: AppLocale = isAppLocale(params.locale) ? params.locale : DEFAULT_LOCALE
  const [blog, t] = await Promise.all([
    getBlogBySlug(params.slug, locale),
    getTranslations({ locale, namespace: 'BlogPost' })
  ])

  if (!blog) {
    notFound()
  }

  const fallbacks = t.raw('fallbacks') as PostFallbacks
  const relatedBlogs = await getRelatedBlogs(locale, params.slug, 8)
  const transformedBlog = transformBlogData(blog, locale, fallbacks)

  if (!transformedBlog) {
    notFound()
  }

  const localizedBlogPath = `/${locale}/post/${blog.slug}`

  return (
    <div className="min-h-screen bg-background">
      <BlogPostStructuredData
        title={blog.title}
        description={blog.seo?.metaDescription || blog.excerpt}
        author={blog.author?.name}
        publishedAt={blog.publishedAt}
        updatedAt={blog.updatedAt}
        heroImage={blog.seo?.socialImage || blog.heroImage}
        path={localizedBlogPath}
        category={blog.category}
        tags={blog.tags}
      />

      <Navbar />
      <main>
        <section className="mx-auto w-full px-3 sm:px-5 lg:px-0 lg:max-w-[66%]">
          <h2 className="mt-16 mb-16 text-2xl font-bold leading-tight tracking-tight md:mb-12 md:text-4xl md:tracking-tighter text-white">
            <Link href={`/${locale}/blogs`} className="hover:underline text-white">
              {t('breadcrumbs.blog')}
            </Link>
          </h2>
          <Post {...transformedBlog} />
          <hr className="mb-24 mt-28 border-border" />
          <MoreStories
            morePosts={relatedBlogs.map((related) => transformBlogForMoreStories(related, locale, fallbacks))}
            title={t('moreStoriesTitle')}
          />
        </section>
      </main>
      <Footer />
    </div>
  )
}
