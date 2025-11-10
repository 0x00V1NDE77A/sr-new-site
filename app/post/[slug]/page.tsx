import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Post, PostFragment } from "@/components/post"
import { MoreStories } from "@/components/more-stories"
import { PostMetaFragment } from "@/components/hero-post"
import { BlogPostStructuredData } from "@/components/structured-data"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// No caching for now - easier testing
export const dynamic = "force-dynamic"
export const revalidate = 0

const FALLBACK_BASE_URL = "https://srholding.org"

function resolveBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : FALLBACK_BASE_URL)
  )
}

// Fetch blog by slug from API
async function getBlogBySlug(slug: string) {
  try {
    // For server-side fetch, we need to use the full URL
    const baseUrl = resolveBaseUrl()
    const url = new URL(`/api/blogs/${slug}`, baseUrl)
    
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

// Fetch related blogs for "More Stories" section
async function getRelatedBlogs(currentSlug: string, limit: number = 8) {
  try {
    // For server-side fetch, we need to use the full URL
    const baseUrl = resolveBaseUrl()
    const url = new URL('/api/blogs', baseUrl)
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
      throw new Error('Failed to fetch related blogs')
    }
    
    const data = await response.json()
    return (data.blogs || []).filter((blog: any) => blog.slug !== currentSlug).slice(0, limit)
  } catch (error) {
    console.error('Error fetching related blogs:', error)
    return []
  }
}

// Transform blog data to match component interface
function transformBlogData(blog: any): PostFragment | null {
  // Ensure we have valid data
  if (!blog || !blog.title) {
    console.warn('Invalid blog data:', blog)
    return null
  }

  // Clean and validate content blocks
  const contentBlocks = Array.isArray(blog.content) ? blog.content : []
  const validContentBlocks = contentBlocks.filter((block: any) => 
    block && block.type && block.content && String(block.content).trim()
  )

  // Log content block information for debugging
  console.log('📝 Blog content analysis:', {
    title: blog.title,
    totalBlocks: contentBlocks.length,
    validBlocks: validContentBlocks.length,
    blockTypes: validContentBlocks.map((b: any) => b.type),
    hasMetadata: validContentBlocks.map((b: any) => !!b.metadata)
  })

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
    excerpt: blog.excerpt || 'No excerpt available',
    body: {
      json: {
        content: validContentBlocks
      }
    }
  }
}

// Transform blog data for MoreStories component
function transformBlogForMoreStories(blog: any): PostMetaFragment {
  return {
    _id: blog._id.toString(),
    _slug: blog.slug,
    _title: blog.title,
    author: {
      _title: blog.author.name,
      avatar: {
        url: blog.author.avatar || "/placeholder-user.jpg",
        alt: blog.author.name
      }
    },
    coverImage: {
      url: blog.heroImage || "/placeholder.jpg",
      alt: blog.title,
      aspectRatio: 1.5
    },
    date: blog.publishedAt || blog.createdAt,
    excerpt: blog.excerpt
  }
}

// Generate static params for all published blogs
export async function generateStaticParams() {
  try {
    const baseUrl = resolveBaseUrl()
    const url = new URL('/api/blogs/slugs', baseUrl)
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
    return data.slugs.map((slug: string) => ({ slug }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  
  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found."
    }
  }

  const postTitle = blog.title
  const postDescription = blog.seo?.metaDescription || blog.excerpt
  const postOgImage = blog.seo?.socialImage || blog.heroImage || "/placeholder.jpg"
  const siteTitle = "SR Holding Blog"
  const keywords = blog.seo?.keywords?.join(", ") || ""

  return {
    title: `${postTitle} | ${siteTitle}`,
    description: postDescription,
    keywords: keywords,
    openGraph: {
      title: blog.seo?.socialTitle || postTitle,
      description: blog.seo?.socialDescription || postDescription,
      type: "article",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author.name],
      images: [
        {
          url: postOgImage,
          width: 1200,
          height: 630,
          alt: postTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seo?.socialTitle || postTitle,
      description: blog.seo?.socialDescription || postDescription,
      images: [postOgImage],
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  
  if (!blog) {
    notFound()
  }

  const relatedBlogs = await getRelatedBlogs(slug, 8)
  const transformedBlog = transformBlogData(blog)

  if (!transformedBlog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* SEO: Structured Data */}
      <BlogPostStructuredData
        title={blog.title}
        description={blog.seo?.metaDescription || blog.excerpt}
        author={blog.author.name}
        publishedAt={blog.publishedAt}
        updatedAt={blog.updatedAt}
        heroImage={blog.seo?.socialImage || blog.heroImage}
        slug={blog.slug}
        category={blog.category}
        tags={blog.tags}
      />
      
      <Navbar />
      <main>
        <section className="container px-5 mx-auto max-w-3xl">
          <h2 className="mt-16 mb-16 text-2xl font-bold leading-tight tracking-tight md:mb-12 md:text-4xl md:tracking-tighter text-white">
            <Link href="/blogs" className="hover:underline text-white">
              Blog.
            </Link>
          </h2>
          <Post {...transformedBlog} />
          <hr className="mb-24 mt-28 border-border" />
          <MoreStories
            morePosts={relatedBlogs.map(transformBlogForMoreStories)}
            title="More Stories"
          />
        </section>
      </main>
      <Footer />
    </div>
  )
}
