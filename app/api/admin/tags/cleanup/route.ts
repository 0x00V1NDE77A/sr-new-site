import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { adminAuth } from "@/lib/admin-auth"

// POST /api/admin/tags/cleanup - Clean up unused tags
export async function POST(request: NextRequest) {
  try {
    const authResult = await adminAuth()
    if (authResult instanceof NextResponse) return authResult

    const client = await clientPromise
    const db = client.db()

    // Get all tags
    const allTags = await db.collection("tags").find({}).toArray()
    
    // Get all blogs to see which tags are actually used
    const allBlogs = await db.collection("blogs").find({}).toArray()
    
    // Extract all used tags from blogs
    const usedTags = new Set()
    allBlogs.forEach(blog => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach(tag => usedTags.add(tag))
      }
    })
    
    // Find unused tags
    const unusedTags = allTags.filter(tag => !usedTags.has(tag.name))
    
    if (unusedTags.length === 0) {
      return NextResponse.json({ message: "No unused tags found" })
    }
    
    // Delete unused tags
    const tagIds = unusedTags.map(tag => tag._id)
    const result = await db.collection("tags").deleteMany({
      _id: { $in: tagIds }
    })
    
    return NextResponse.json({
      message: `${result.deletedCount} unused tags cleaned up`,
      deletedTags: unusedTags.map(tag => tag.name)
    })
  } catch (error) {
    console.error("Error cleaning up tags:", error)
    return NextResponse.json({ error: "Failed to clean up tags" }, { status: 500 })
  }
}
