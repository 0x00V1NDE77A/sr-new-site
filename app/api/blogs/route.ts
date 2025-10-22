import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { BlogPost } from "@/lib/models/blog"

// No caching for now - easier testing
export const revalidate = 0

// GET - Fetch all published blogs for public display
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured") === "true"
    const sort = searchParams.get("sort") || "publishedAt"
    const order = searchParams.get("order") === "asc" ? 1 : -1

    const client = await clientPromise
    const db = client.db()
    const blogsCollection = db.collection<BlogPost>("blogs")

    // Build filter query - only published blogs
    const filter: any = { status: "published" }
    
    if (category) filter.category = category
    if (tag) filter.tags = { $in: [tag] }
    if (featured) filter.featured = true
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { "author.name": { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ]
    }

    // Get total count for pagination
    const total = await blogsCollection.countDocuments(filter)

    // Fetch blogs with pagination
    const blogs = await blogsCollection
      .find(filter)
      .sort({ [sort]: order })
      .skip((page - 1) * limit)
      .limit(limit)
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
        featured: 1
      })
      .toArray()

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[v0] GET public blogs error:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}
