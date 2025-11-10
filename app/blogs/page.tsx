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
import { notFound } from "next/navigation"

// No caching for now - easier testing
export const dynamic = "force-dynamic"
export const revalidate = 0

// Fetch blogs from API with pagination
async function getBlogs(page: number = 1, limit: number = 12) {
  try {
    // For server-side fetch, we need to use the full URL
    const baseUrl = "https://www.srholding.org"
    const url = new URL('/api/blogs', baseUrl)
    url.searchParams.set('page', page.toString())
    url.searchParams.set('limit', limit.toString())
    url.searchParams.set('sort', 'publishedAt')
    url.searchParams.set('order', 'desc')
    
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

// Transform blog data to match component interface
function transformBlogData(blog: any): PostMetaFragment | null {
  // Ensure we have valid data
  if (!blog || !blog.title) {
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
    _title: blog.title || 'Untitled',
    author: {
      _title: blog.author?.name || 'Unknown Author',
      avatar: {
        url: blog.author?.avatar || "/placeholder-user.jpg",
        alt: blog.author?.name || 'Unknown Author'
      }
    },
    coverImage: {
      url: blog.heroImage || "/placeholder.jpg",
      alt: blog.title || 'Blog post',
      aspectRatio: 1.5
    },
    date: blog.publishedAt || blog.createdAt || new Date().toISOString(),
    excerpt: excerpt || 'No excerpt available'
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await generateSEOMetadata({
    defaultTitle: 'Blog - SR Holding',
    defaultDescription: 'Latest insights, tutorials, and updates from SR Holding on software development, AI solutions, blockchain technology, and modern web development.',
    defaultKeywords: 'SR Holding blog, software development blog, AI technology blog, blockchain blog, web development insights, technology tutorials'
  }, '/blogs')
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: {
      ...seoData.openGraph,
      title: 'Blog - SR Holding',
      description: 'Latest insights, tutorials, and updates from SR Holding on software development, AI solutions, and blockchain technology.',
    },
    twitter: {
      ...seoData.twitter,
      title: 'Blog - SR Holding',
      description: 'Latest insights, tutorials, and updates from SR Holding on software development, AI solutions, and blockchain technology.',
    },
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const currentPage = Number(searchParams.page) || 1
  const { blogs, pagination } = await getBlogs(currentPage, 12)
  
  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
        <section className="container px-6 mx-auto">
          <Intro />
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
            <h2 className="mb-4 text-3xl font-bold text-foreground">No blogs available yet</h2>
            <p className="max-w-md text-lg text-muted-foreground">
              Check back soon for our latest insights, tutorials, and updates on technology and innovation.
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
  const transformedHeroPost = heroPost ? transformBlogData(heroPost) : null
  const transformedMorePosts = morePosts
    .map(transformBlogData)
    .filter((post: PostMetaFragment | null): post is PostMetaFragment => post !== null)

  return (
    <div className="min-h-screen bg-background">
      {/* SEO: Structured Data */}
      <BlogListingStructuredData
        title="SR Holding Blog"
        description="Latest insights and updates from SR Holding on software development and technology."
        url="/blogs"
      />
      
      <Navbar />
      <main>
        <section className="container px-6 mx-auto max-w-7xl">
          <Intro />

          {transformedHeroPost && (
            <div className="mb-16">
              <HeroPost {...transformedHeroPost} />
            </div>
          )}

          <div className="p-8 mb-16 border bg-card/30 backdrop-blur-sm rounded-2xl border-border/50">
            <MoreStories morePosts={transformedMorePosts} title="More Stories" />
          </div>
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-16 mb-8">
              <div className="p-4 border bg-card/30 backdrop-blur-sm rounded-xl border-border/50">
                <Pagination>
                  <PaginationContent className="gap-2">
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={`/blogs?page=${currentPage - 1}`} />
                    </PaginationItem>
                  )}
                  
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink href="/blogs?page=1">1</PaginationLink>
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
                          href={`/blogs?page=${pageNum}`}
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
                        <PaginationLink href={`/blogs?page=${pagination.pages}`}>
                          {pagination.pages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  
                  {currentPage < pagination.pages && (
                    <PaginationItem>
                      <PaginationNext href={`/blogs?page=${currentPage + 1}`} />
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
