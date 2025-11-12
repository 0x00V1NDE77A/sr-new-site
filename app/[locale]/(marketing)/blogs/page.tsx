import { Intro } from "@/components/intro"
import { HeroPost, PostMetaFragment } from "@/components/hero-post"
import { MoreStories } from "@/components/more-stories"
// import { Newsletter } from "@/components/newsletter"
import { BlogListingStructuredData } from "@/components/structured-data"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from "next"
import { DEFAULT_LOCALE, type AppLocale, isAppLocale } from "@/lib/i18n/config"
import { getTranslations } from "next-intl/server"

// No caching for now - easier testing
export const dynamic = "force-dynamic"
export const revalidate = 0

// Fetch blogs from API with pagination
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sr-redesign-nextjs.vercel.app"

async function getBlogs(locale: AppLocale, page: number = 1, limit: number = 12) {
  try {
    // For server-side fetch, we need to use the full URL
    const url = new URL('/api/blogs', APP_BASE_URL)
    url.searchParams.set('page', page.toString())
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
      throw new Error('Failed to fetch blogs')
    }
    
    const data = await response.json()
    return {
      blogs: data.blogs || [],
      pagination: data.pagination || { page: 1, limit: 12, total: 0, pages: 1 }
    }
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return { blogs: [], pagination: { page: 1, limit: 12, total: 0, pages: 1 } }
  }
}

type BlogFallbacks = {
  untitled: string
  unknownAuthor: string
  noExcerpt: string
  coverAlt: string
}

// Transform blog data to match component interface
function transformBlogData(blog: any, locale: AppLocale, fallbacks: BlogFallbacks): PostMetaFragment | null {
  // Ensure we have valid data
  if (!blog) {
    console.warn('Invalid blog data:', blog)
    return null
  }

  // Clean and validate content
  const contentBlocks = Array.isArray(blog.content) ? blog.content : []
  const validContentBlocks = contentBlocks.filter((block: any) => 
    block && block.type && block.content && String(block.content).trim()
  )

  // Generate better excerpt if none exists
  let excerpt = blog.excerpt
  if (!excerpt && validContentBlocks.length > 0) {
    const firstParagraph = validContentBlocks.find((block: any) => block.type === 'paragraph')
    if (firstParagraph && firstParagraph.content) {
      excerpt = String(firstParagraph.content).substring(0, 150) + '...'
    }
  }

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
      alt: blog.title || fallbacks.coverAlt,
      aspectRatio: 1.5
    },
    date: blog.publishedAt || blog.createdAt || new Date().toISOString(),
    excerpt: excerpt || fallbacks.noExcerpt
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const normalizedLocale: AppLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE
  const t = await getTranslations({ locale: normalizedLocale, namespace: 'Blogs.metadata' })

  const seoData = await generateSEOMetadata({
    defaultTitle: t('title'),
    defaultDescription: t('description'),
    defaultKeywords: t('keywords'),
  }, `/${normalizedLocale}/blogs`)

  const openGraphTitle = t('openGraphTitle')
  const openGraphDescription = t('openGraphDescription')

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: {
      ...seoData.openGraph,
      title: openGraphTitle,
      description: openGraphDescription,
    },
    twitter: {
      ...seoData.twitter,
      title: openGraphTitle,
      description: openGraphDescription,
    },
  }
}

type PageProps = {
  params: Promise<{ locale: string }>
  searchParams: { page?: string }
}

export default async function Page({
  params,
  searchParams,
}: PageProps) {
  const { locale: localeParam } = await params
  const locale: AppLocale = isAppLocale(localeParam) ? localeParam : DEFAULT_LOCALE
  const t = await getTranslations({ locale, namespace: 'Blogs' })

  const introTitle = t('intro.title')
  const introDescription = t('intro.description')
  const emptyTitle = t('emptyState.title')
  const emptyDescription = t('emptyState.description')
  const moreStoriesTitle = t('moreStoriesTitle')
  const structuredTitle = t('metadata.structuredDataTitle')
  const structuredDescription = t('metadata.structuredDataDescription')
  const blogFallbacks: BlogFallbacks = {
    untitled: t('fallbacks.untitled'),
    unknownAuthor: t('fallbacks.unknownAuthor'),
    noExcerpt: t('fallbacks.noExcerpt'),
    coverAlt: t('fallbacks.coverAlt'),
  }

  const currentPage = Number(searchParams.page) || 1
  const { blogs, pagination } = await getBlogs(locale, currentPage, 12)
  
  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
        <section className="container px-6 mx-auto">
          <Intro title={introTitle} description={introDescription} />
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex items-center justify-center w-24 h-24 mb-8 border rounded-full bg-card/30 backdrop-blur-sm border-border/50">
              <svg className="w-12 h-12 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground">{emptyTitle}</h2>
            <p className="max-w-md text-lg text-muted-foreground">
              {emptyDescription}
            </p>
          </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  const heroPost = blogs[0]
  const morePosts = blogs.slice(1)

  // Transform and filter out invalid blogs
  const transformedHeroPost = heroPost ? transformBlogData(heroPost, locale, blogFallbacks) : null
  const transformedMorePosts = morePosts
    .map((blog) => transformBlogData(blog, locale, blogFallbacks))
    .filter((post: PostMetaFragment | null): post is PostMetaFragment => post !== null)

  return (
    <div className="min-h-screen bg-background">
      {/* SEO: Structured Data */}
      <BlogListingStructuredData
        title={structuredTitle}
        description={structuredDescription}
        url={`/${locale}/blogs`}
      />
      
      <Navbar />
      <main>
        <section className="container px-6 mx-auto max-w-7xl">
          <Intro title={introTitle} description={introDescription} />

          {transformedHeroPost && (
            <div className="mb-16">
              <HeroPost {...transformedHeroPost} />
            </div>
          )}

          <div className="p-8 mb-16 border bg-card/30 backdrop-blur-sm rounded-2xl border-border/50">
            <MoreStories morePosts={transformedMorePosts} title={moreStoriesTitle} />
          </div>
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-16 mb-8">
              <div className="p-4 border bg-card/30 backdrop-blur-sm rounded-xl border-border/50">
                <Pagination>
                  <PaginationContent className="gap-2">
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={`/${locale}/blogs?page=${currentPage - 1}`} />
                    </PaginationItem>
                  )}
                  
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink href={`/${locale}/blogs?page=1`}>1</PaginationLink>
                      </PaginationItem>
                      {currentPage > 4 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}
                  
                  {/* Page numbers around current page */}
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(pagination.pages, currentPage - 2 + i))
                    if (pageNum < 1 || pageNum > pagination.pages) return null
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          href={`/${locale}/blogs?page=${pageNum}`}
                          isActive={pageNum === currentPage}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  
                  {/* Last page */}
                  {currentPage < pagination.pages - 2 && (
                    <>
                      {currentPage < pagination.pages - 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink href={`/${locale}/blogs?page=${pagination.pages}`}>
                          {pagination.pages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  
                  {currentPage < pagination.pages && (
                    <PaginationItem>
                      <PaginationNext href={`/${locale}/blogs?page=${currentPage + 1}`} />
                    </PaginationItem>
                  )}
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </section>
        {/* <Newsletter /> */}
      </main>
      <Footer />
    </div>
  )
}
