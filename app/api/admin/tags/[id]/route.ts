import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { adminAuth } from "@/lib/admin-auth"
import { ObjectId } from "mongodb"

// GET /api/admin/tags/[id] - Fetch single tag
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await adminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { id } = await params
    const client = await clientPromise
    const db = client.db()

    const tag = await db.collection("tags").findOne({
      _id: new ObjectId(id),
    })

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error("Error fetching tag:", error)
    return NextResponse.json({ error: "Failed to fetch tag" }, { status: 500 })
  }
}

// PUT /api/admin/tags/[id] - Update tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await adminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { id } = await params
    const { name, description, color } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if tag already exists with different ID
    const existingTag = await db.collection("tags").findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      _id: { $ne: new ObjectId(id) },
    })

    if (existingTag) {
      return NextResponse.json({ error: "Tag already exists" }, { status: 409 })
    }

    // Update tag
    const result = await db.collection("tags").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name.toLowerCase().trim(),
          description: description || "",
          color: color || "#3b82f6",
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Fetch updated tag
    const updatedTag = await db.collection("tags").findOne({
      _id: new ObjectId(id),
    })

    return NextResponse.json(updatedTag)
  } catch (error) {
    console.error("Error updating tag:", error)
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 })
  }
}

// DELETE /api/admin/tags/[id] - Delete single tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await adminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { id } = await params
    const client = await clientPromise
    const db = client.db()

    // Get tag name before deletion to remove from blog posts
    const tag = await db.collection("tags").findOne(
      { _id: new ObjectId(id) },
      { projection: { name: 1 } }
    )

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Delete tag
    const result = await db.collection("tags").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Remove tag from all blog posts
    await db.collection("blogs").updateMany(
      { tags: tag.name },
      { $pull: { tags: tag.name } }
    )

    return NextResponse.json({
      message: "Tag deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting tag:", error)
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 })
  }
}
