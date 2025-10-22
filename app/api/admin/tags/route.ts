import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { adminAuth } from "@/lib/admin-auth"
import { ObjectId } from "mongodb"

// GET /api/admin/tags - Fetch all tags with pagination and search
export async function GET(request: NextRequest) {
  try {
    const authResult = await adminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "name"
    const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1

    const client = await clientPromise
    const db = client.db()

    // Build search query
    const searchQuery = search ? { name: { $regex: search, $options: "i" } } : {}

    // Get total count for pagination
    const total = await db.collection("tags").countDocuments(searchQuery)

    // Fetch tags with pagination and sorting
    const tags = await db
      .collection("tags")
      .find(searchQuery)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      tags,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}

// POST /api/admin/tags - Create new tag
export async function POST(request: NextRequest) {
  try {
    const authResult = await adminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { name, description, color } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if tag already exists
    const existingTag = await db.collection("tags").findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    })

    if (existingTag) {
      return NextResponse.json({ error: "Tag already exists" }, { status: 409 })
    }

    // Create new tag
    const newTag = {
      name: name.toLowerCase().trim(),
      description: description || "",
      color: color || "#3b82f6",
      postCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("tags").insertOne(newTag)

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...newTag,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  }
}

// DELETE /api/admin/tags - Bulk delete tags
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await adminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { tagIds } = await request.json()

    if (!tagIds || !Array.isArray(tagIds)) {
      return NextResponse.json({ error: "Tag IDs array is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get tag names before deletion to remove from blog posts
    const tagNames = await db
      .collection("tags")
      .find({ _id: { $in: tagIds.map((id) => new ObjectId(id)) } })
      .project({ name: 1 })
      .toArray()

    // Delete tags
    const result = await db.collection("tags").deleteMany({
      _id: { $in: tagIds.map((id) => new ObjectId(id)) },
    })

    // Remove tags from all blog posts
    if (tagNames.length > 0) {
      const names = tagNames.map((tag) => tag.name);
      for (const name of names) {
        await db
          .collection("blogs")
          .updateMany(
            { tags: name },
            { $pull: { tags: name } },
          )
      }
    }

    return NextResponse.json({
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} tags deleted successfully`,
    })
  } catch (error) {
    console.error("Error deleting tags:", error)
    return NextResponse.json({ error: "Failed to delete tags" }, { status: 500 })
  }
}
