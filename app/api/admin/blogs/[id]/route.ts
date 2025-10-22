import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { adminAuth } from "@/lib/admin-auth"
import type { BlogPost } from "@/lib/models/blog"
import { ObjectId } from "mongodb"

// GET - Fetch single blog
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth()
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db()
    const blogsCollection = db.collection<BlogPost>("blogs")

    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("[v0] GET blog error:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}

// PUT - Update blog
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth()
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const body = await request.json()
    const client = await clientPromise
    const db = client.db()
    const blogsCollection = db.collection<BlogPost>("blogs")

    // Get existing blog for comparison
    const existingBlog = await blogsCollection.findOne({ _id: new ObjectId(id) })
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Update slug if title changed
    let slug = existingBlog.slug
    if (body.title !== existingBlog.title) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    // Calculate reading time
    const wordCount = body.content
      .filter((block: any) => block.type === "paragraph")
      .reduce((count: number, block: any) => count + block.content.split(" ").length, 0)
    const readingTime = Math.ceil(wordCount / 200)

    const updateData = {
      ...body,
      slug,
      readingTime,
      updatedAt: new Date(),
      publishedAt:
        body.status === "published" && existingBlog.status !== "published" ? new Date() : existingBlog.publishedAt,
    }

    await blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    // Update category counts if changed
    if (body.category !== existingBlog.category) {
      await updateCategoryCount(db, existingBlog.category, -1)
      await updateCategoryCount(db, body.category, 1)
    }

    // Update tag counts if changed
    const oldTags = existingBlog.tags || []
    const newTags = body.tags || []
    const removedTags = oldTags.filter((tag: string) => !newTags.includes(tag))
    const addedTags = newTags.filter((tag: string) => !oldTags.includes(tag))

    if (removedTags.length > 0) await updateTagCounts(db, removedTags, -1)
    if (addedTags.length > 0) await updateTagCounts(db, addedTags, 1)

    return NextResponse.json({ message: "Blog updated successfully" })
  } catch (error) {
    console.error("[v0] PUT blog error:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

// DELETE - Delete blog
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await adminAuth()
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db()
    const blogsCollection = db.collection<BlogPost>("blogs")

    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) })
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    await blogsCollection.deleteOne({ _id: new ObjectId(id) })

    // Update category and tag counts
    await updateCategoryCount(db, blog.category, -1)
    await updateTagCounts(db, blog.tags, -1)

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("[v0] DELETE blog error:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}

// Helper functions (same as in main route)
async function updateCategoryCount(db: any, categoryName: string, increment: number) {
  await db.collection("categories").updateOne({ name: categoryName }, { $inc: { postCount: increment } })
}

async function updateTagCounts(db: any, tags: string[], increment: number) {
  for (const tagName of tags) {
    await db.collection("tags").updateOne({ name: tagName }, { $inc: { postCount: increment } })
  }
}
