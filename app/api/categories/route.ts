import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Category } from "@/lib/models/blog"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()
    const categoriesCollection = db.collection<Category>("categories")

    const categories = await categoriesCollection.find({}).sort({ postCount: -1, name: 1 }).toArray()

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("[v0] GET public categories error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
