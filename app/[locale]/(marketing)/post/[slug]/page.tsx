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
import clientPromise from "@/lib/mongodb"
import type { BlogPost } from "@/lib/models/blog"

export const dynamic = "force-dynamic"
export const revalidate = 0

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sr-redesign-nextjs.vercel.app"

type LocalizedBlogFields = Pick<
  BlogPost,
  | "_id"
  | "title"
  | "slug"
  | "content"
  | "excerpt"
  | "heroImage"
  | "author"
  | "category"
  | "tags"
  | "publishedAt"
  | "readingTime"
  | "views"
  | "featured"
  | "seo"
> & { translations?: BlogPost["translations"] }

async function getBlogsCollection() {
  const client = await clientPromise
  const db = client.db()
  return db.collection<BlogPost>("blogs")
}

function localizeBlog(blog: LocalizedBlogFields, locale: AppLocale) {
  const { translations, ...rest } = blog
  const translation = translations?.[locale] ?? {}
  const localizedSeo = {
    ...rest.seo,
    metaTitle: translation.seo?.metaTitle ?? rest.seo?.metaTitle,
    metaDescription: translation.seo?.metaDescription ?? rest.seo?.metaDescription,
    keywords: translation.seo?.keywords ?? rest.seo?.keywords,
    socialTitle: translation.seo?.socialTitle ?? rest.seo?.socialTitle,
    socialDescription: translation.seo?.socialDescription ?? rest.seo?.socialDescription,
    socialImage: translation.seo?.socialImage ?? rest.seo?.socialImage,
  }

  return {
    ...rest,
    title: translation.title ?? rest.title,
    slug: translation.slug ?? rest.slug,
    excerpt: translation.excerpt ?? rest.excerpt,
    heroImage: translation.heroImage ?? rest.heroImage,
    content: translation.content ?? rest.content,
    seo: localizedSeo,
  }
}

async function getBlogBySlug(slug: string, locale: AppLocale, options: { incrementView?: boolean } = {}) {
  try {
    const blogsCollection = await getBlogsCollection()
    const slugConditions = [
      { slug },
      ...SUPPORTED_LOCALES.map((loc) => ({ [`translations.${loc}.slug`]: slug })),
    ]

    const blog = await blogsCollection.findOne<LocalizedBlogFields>(
      { status: "published", $or: slugConditions },
      {
        projection: {
          _id: 1,
          title: 1,
          slug: 1,
          content: 1,
          excerpt: 1,
          heroImage: 1,
          author: 1,
          category: 1,
          tags: 1,
          publishedAt: 1,
          readingTime: 1,
          views: 1,
          featured: 1,
          seo: 1,
          translations: 1,
        },
      }
    )

    if (!blog) {
      return null
    }

    if (options.incrementView && blog._id) {
      await blogsCollection.updateOne({ _id: blog._id }, { $inc: { views: 1 } })
    }

    return localizeBlog(blog, locale)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return null
  }
}

async function getRelatedBlogs(locale: AppLocale, currentSlug: string, limit: number = 8) {
  try {
    const blogsCollection = await getBlogsCollection()
    const blogs = await blogsCollection
      .find<LocalizedBlogFields>({ status: "published" })
      .project({
        _id: 1,
        title: 1,
        slug: 1,
        excerpt: 1,
        heroImage: 1,
        author: 1,
        category: 1,
        tags: 1,
        publishedAt: 1,
        readingTime: 1,
        views: 1,
        featured: 1,
        seo: 1,
        translations: 1,
      })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit * 3)
      .toArray()

    return blogs
      .map((blog) => localizeBlog(blog, locale))
      .filter((blog) => blog.slug !== currentSlug)
      .slice(0, limit)
  } catch (error) {
    console.error("Error fetching related blogs:", error)
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
    const blogsCollection = await getBlogsCollection()
    const blogs = await blogsCollection
      .find<Pick<BlogPost, "slug" | "translations">>({ status: "published" })
      .project({ slug: 1, translations: 1 })
      .toArray()

    return SUPPORTED_LOCALES.flatMap((locale) =>
      blogs
        .map((blog) => blog.translations?.[locale]?.slug ?? blog.slug)
        .filter((slug): slug is string => Boolean(slug))
        .map((slug) => ({ locale, slug }))
    )
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

type PageParams = { locale: string; slug: string }

type PageProps = { params: PageParams }

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const locale: AppLocale = isAppLocale(params.locale) ? params.locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale, namespace: "BlogPost" })
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
    getBlogBySlug(params.slug, locale, { incrementView: true }),
    getTranslations({ locale, namespace: "BlogPost" }),
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
