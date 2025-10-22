import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { adminAuth } from "@/lib/admin-auth"
import type { Category } from "@/lib/models/blog"

export async function GET(request: NextRequest) {
  const authResult = await adminAuth()
  if (authResult instanceof NextResponse) return authResult

  try {
    const client = await clientPromise
    const db = client.db()
    const categoriesCollection = db.collection<Category>("categories")

    const categories = await categoriesCollection.find({}).sort({ postCount: -1, name: 1 }).toArray()

    // Convert ObjectId to string for frontend compatibility
    const categoriesWithStringIds = categories.map(category => ({
      ...category,
      _id: category._id?.toString()
    }))

    return NextResponse.json(categoriesWithStringIds)
  } catch (error) {
    console.error("[v0] GET categories error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authResult = await adminAuth()
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db()
    const categoriesCollection = db.collection<Category>("categories")

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const existingCategory = await categoriesCollection.findOne({ slug })
    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 })
    }

    const newCategory: Omit<Category, "_id"> = {
      name: body.name,
      slug,
      description: body.description || "",
      color: body.color || "#3b82f6",
      postCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await categoriesCollection.insertOne(newCategory)

    // Fetch the created category to return the complete object
    const createdCategory = await categoriesCollection.findOne({ _id: result.insertedId })

    if (!createdCategory) {
      return NextResponse.json({ error: "Failed to retrieve created category" }, { status: 500 })
    }

    // Convert ObjectId to string for frontend compatibility
    const categoryWithStringId = {
      ...createdCategory,
      _id: createdCategory._id?.toString()
    }

    return NextResponse.json(categoryWithStringId, { status: 201 })
  } catch (error) {
    console.error("[v0] POST category error:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
