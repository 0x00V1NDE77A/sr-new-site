import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// GET - Fetch all published blog slugs for static generation
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const blogsCollection = db.collection("blogs")

    // Get only slugs of published blogs
    const slugs = await blogsCollection
      .find(
        { status: "published" },
        { projection: { slug: 1 } }
      )
      .toArray()

    return NextResponse.json({ slugs: slugs.map(s => s.slug) })
  } catch (error) {
    console.error("[v0] GET blog slugs error:", error)
    return NextResponse.json({ error: "Failed to fetch blog slugs" }, { status: 500 })
  }
}
