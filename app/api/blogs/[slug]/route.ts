import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { BlogPost } from "@/lib/models/blog"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type AppLocale, isAppLocale } from "@/lib/i18n/config"

// No caching for now - easier testing
export const revalidate = 0

// GET - Fetch a single published blog by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const requestedLocale = searchParams.get("locale") || DEFAULT_LOCALE
    const locale: AppLocale = isAppLocale(requestedLocale) ? requestedLocale : DEFAULT_LOCALE
    
    const client = await clientPromise
    const db = client.db()
    const blogsCollection = db.collection<BlogPost>("blogs")

    // Find the blog by slug and ensure it's published
    const slugConditions = [
      { slug },
      ...SUPPORTED_LOCALES.map((loc) => ({ [`translations.${loc}.slug`]: slug })),
    ]

    const blog = await blogsCollection.findOne(
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
          translations: 1
        }
      }
    )

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Increment view count
    await blogsCollection.updateOne(
      { _id: blog._id },
      { $inc: { views: 1 } }
    )

    const { translations, ...rest } = blog
    const translation = translations?.[locale] ?? {}
    const localizedBlog = {
      ...rest,
      title: translation.title ?? rest.title,
      slug: translation.slug ?? rest.slug,
      excerpt: translation.excerpt ?? rest.excerpt,
      heroImage: translation.heroImage ?? rest.heroImage,
      content: translation.content ?? rest.content,
      seo: {
        ...rest.seo,
        metaTitle: translation.seo?.metaTitle ?? rest.seo?.metaTitle,
        metaDescription: translation.seo?.metaDescription ?? rest.seo?.metaDescription,
        keywords: translation.seo?.keywords ?? rest.seo?.keywords,
        socialTitle: translation.seo?.socialTitle ?? rest.seo?.socialTitle,
        socialDescription: translation.seo?.socialDescription ?? rest.seo?.socialDescription,
        socialImage: translation.seo?.socialImage ?? rest.seo?.socialImage,
      },
    }

    return NextResponse.json({ blog: localizedBlog })
  } catch (error) {
    console.error("[v0] GET blog by slug error:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}
