import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { BlogPost } from "@/lib/models/blog"

// No caching for now - easier testing
export const revalidate = 0

// GET - Fetch a single published blog by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const client = await clientPromise
    const db = client.db()
    const blogsCollection = db.collection<BlogPost>("blogs")

    // Find the blog by slug and ensure it's published
    const blog = await blogsCollection.findOne(
      { slug, status: "published" },
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
          seo: 1
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

    return NextResponse.json({ blog })
  } catch (error) {
    console.error("[v0] GET blog by slug error:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}
