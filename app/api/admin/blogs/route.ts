import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { adminAuth } from "@/lib/admin-auth"
import type { BlogPost } from "@/lib/models/blog"
import { createBlogFromPayload } from "@/lib/services/blog-admin"

// GET - Fetch all blogs with pagination and filters
export async function GET(request: NextRequest) {
  const authResult = await adminAuth()
  if (authResult instanceof NextResponse) return authResult

  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") === "asc" ? 1 : -1

    const client = await clientPromise
    const db = client.db()
    const blogsCollection = db.collection<BlogPost>("blogs")

    // Build filter query
    const filter: any = {}
    if (status) filter.status = status
    if (category) filter.category = category
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { "author.name": { $regex: search, $options: "i" } },
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
    console.error("[v0] GET blogs error:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

// POST - Create new blog
export async function POST(request: NextRequest) {
  const authResult = await adminAuth()
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json()
    try {
      const result = await createBlogFromPayload(body)

      return NextResponse.json(
        {
          message: "Blog created successfully",
          blogId: result.insertedId,
        },
        { status: 201 },
      )
    } catch (error: any) {
      if (error instanceof Error && error.message === "A blog with this title already exists") {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      throw error
    }
  } catch (error) {
    console.error("[v0] POST blog error:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}
