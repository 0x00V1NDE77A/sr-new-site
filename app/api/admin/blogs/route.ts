import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { adminAuth } from "@/lib/admin-auth"
import type { BlogPost } from "@/lib/models/blog"

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
    
    // Debug logging to see what's received
    console.log('📥 Backend API - Received blog data:', {
      title: body.title,
      contentBlocks: body.content?.length || 0,
      contentTypes: body.content?.map((b: any) => b.type) || [],
      hasContent: !!body.content,
      contentStructure: body.content?.map((b: any) => ({
        id: b.id,
        type: b.type,
        contentLength: b.content?.length || 0,
        hasMetadata: !!b.metadata,
        metadataKeys: Object.keys(b.metadata || {})
      })) || []
    });

    const client = await clientPromise
    const db = client.db()
    const blogsCollection = db.collection<BlogPost>("blogs")

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug exists
    const existingBlog = await blogsCollection.findOne({ slug })
    if (existingBlog) {
      return NextResponse.json({ error: "A blog with this title already exists" }, { status: 400 })
    }

    // Calculate reading time (average 200 words per minute)
    const wordCount = body.content
      .filter((block: any) => block.type === "paragraph")
      .reduce((count: number, block: any) => count + block.content.split(" ").length, 0)
    const readingTime = Math.ceil(wordCount / 200)

    const newBlog: Omit<BlogPost, "_id"> = {
      ...body,
      slug,
      readingTime,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: body.status === "published" ? new Date() : undefined,
    }

    console.log('📝 Backend API - Creating blog with:', {
      slug,
      readingTime,
      contentBlocks: newBlog.content.length,
      contentTypes: newBlog.content.map(b => b.type)
    });

    const result = await blogsCollection.insertOne(newBlog)

    // Update category and tag counts
    await updateCategoryCount(db, body.category, 1)
    await updateTagCounts(db, body.tags, 1)

    console.log('✅ Backend API - Blog created successfully with ID:', result.insertedId);

    return NextResponse.json(
      {
        message: "Blog created successfully",
        blogId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] POST blog error:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}

// Helper functions
async function updateCategoryCount(db: any, categoryName: string, increment: number) {
  await db.collection("categories").updateOne(
    { name: categoryName },
    {
      $inc: { postCount: increment },
      $setOnInsert: {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        createdAt: new Date(),
      },
    },
    { upsert: true },
  )
}

async function updateTagCounts(db: any, tags: string[], increment: number) {
  for (const tagName of tags) {
    await db.collection("tags").updateOne(
      { name: tagName },
      {
        $inc: { postCount: increment },
        $setOnInsert: {
          name: tagName,
          slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          createdAt: new Date(),
        },
      },
      { upsert: true },
    )
  }
}
