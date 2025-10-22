import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { adminAuth } from "@/lib/admin-auth"
import type { Category } from "@/lib/models/blog"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await adminAuth()
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const body = await request.json()
    const client = await clientPromise
    const db = client.db()
    const categoriesCollection = db.collection<Category>("categories")

    const categoryId = new ObjectId(id)
    
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists for a different category
    const existingCategory = await categoriesCollection.findOne({ 
      slug, 
      _id: { $ne: categoryId } 
    })
    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
    }

    const updateData = {
      name: body.name,
      slug,
      description: body.description || "",
      color: body.color || "#3b82f6",
      updatedAt: new Date(),
    }

    const result = await categoriesCollection.updateOne(
      { _id: categoryId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const updatedCategory = await categoriesCollection.findOne({ _id: categoryId })

    if (!updatedCategory) {
      return NextResponse.json({ error: "Failed to retrieve updated category" }, { status: 500 })
    }

    // Convert ObjectId to string for frontend compatibility
    const categoryWithStringId = {
      ...updatedCategory,
      _id: updatedCategory._id?.toString()
    }

    return NextResponse.json(categoryWithStringId)
  } catch (error) {
    console.error("[v0] PUT category error:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await adminAuth()
  if (authResult instanceof NextResponse) return authResult

  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db()
    const categoriesCollection = db.collection<Category>("categories")
    const blogsCollection = db.collection("blogs")

    const categoryId = new ObjectId(id)

    // Check if category is being used by any blogs
    const blogsUsingCategory = await blogsCollection.countDocuments({ category: id })
    if (blogsUsingCategory > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category. It is being used by ${blogsUsingCategory} blog post(s).` 
      }, { status: 400 })
    }

    const result = await categoriesCollection.deleteOne({ _id: categoryId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Category deleted successfully",
    })
  } catch (error) {
    console.error("[v0] DELETE category error:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
