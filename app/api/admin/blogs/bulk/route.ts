import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { adminAuth } from "@/lib/admin-auth"
import { ObjectId } from "mongodb"

// POST /api/admin/blogs/bulk - Bulk operations on blogs
export async function POST(request: NextRequest) {
  try {
    const authResult = await adminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { action, blogIds, data } = await request.json()

    if (!action || !blogIds || !Array.isArray(blogIds)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    let result
    const objectIds = blogIds.map((id: string) => new ObjectId(id))

    switch (action) {
      case "publish":
        result = await db.collection("blogs").updateMany(
          { _id: { $in: objectIds } },
          { $set: { status: "published", publishedAt: new Date() } }
        )
        break

      case "unpublish":
        result = await db.collection("blogs").updateMany(
          { _id: { $in: objectIds } },
          { $set: { status: "draft" }, $unset: { publishedAt: 1 } }
        )
        break

      case "delete":
        result = await db.collection("blogs").deleteMany({ _id: { $in: objectIds } })
        break

      case "update":
        if (!data) {
          return NextResponse.json({ error: "Update data is required" }, { status: 400 })
        }
        result = await db.collection("blogs").updateMany(
          { _id: { $in: objectIds } },
          { $set: { ...data, updatedAt: new Date() } }
        )
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      message: `Bulk ${action} completed successfully`,
      modifiedCount: result.modifiedCount || result.deletedCount || 0,
    })
  } catch (error) {
    console.error("Error in bulk blog operation:", error)
    return NextResponse.json({ error: "Failed to perform bulk operation" }, { status: 500 })
  }
}

// DELETE /api/admin/blogs/bulk - Bulk delete blogs
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await adminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { blogIds } = await request.json()

    if (!blogIds || !Array.isArray(blogIds)) {
      return NextResponse.json({ error: "Blog IDs array is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const objectIds = blogIds.map((id: string) => new ObjectId(id))
    const result = await db.collection("blogs").deleteMany({ _id: { $in: objectIds } })

    return NextResponse.json({
      message: `${result.deletedCount} blogs deleted successfully`,
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error("Error in bulk delete:", error)
    return NextResponse.json({ error: "Failed to delete blogs" }, { status: 500 })
  }
}
