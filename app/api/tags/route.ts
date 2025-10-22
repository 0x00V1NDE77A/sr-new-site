import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Tag } from "@/lib/models/blog"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()
    const tagsCollection = db.collection<Tag>("tags")

    const tags = await tagsCollection.find({}).sort({ postCount: -1, name: 1 }).toArray()

    return NextResponse.json({ tags })
  } catch (error) {
    console.error("[v0] GET public tags error:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}
