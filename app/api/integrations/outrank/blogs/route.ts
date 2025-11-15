import { type NextRequest, NextResponse } from "next/server"
import { createBlogFromPayload } from "@/lib/services/blog-admin"

const OUTRANK_API_KEY = process.env.OUTRANK_API_KEY
const API_KEY_HEADER = "x-outrank-api-key"

function verifyApiKey(request: NextRequest) {
  if (!OUTRANK_API_KEY) {
    console.error("Outrank integration attempted but OUTRANK_API_KEY is not configured")
    return NextResponse.json({ error: "Integration not configured" }, { status: 503 })
  }

  const providedKey = request.headers.get(API_KEY_HEADER)
  if (!providedKey || providedKey !== OUTRANK_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null
}

export async function POST(request: NextRequest) {
  const authError = verifyApiKey(request)
  if (authError) return authError

  try {
    const body = await request.json()
    try {
      const result = await createBlogFromPayload(body)

      return NextResponse.json(
        {
          message: "Blog created successfully",
          blogId: result.insertedId,
          slug: result.slug,
        },
        { status: 201 },
      )
    } catch (error: any) {
      if (error instanceof Error && error.message === "A blog with this title already exists") {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      throw error
    }
  } catch (error) {
    console.error("[outrank] POST blog error:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}

