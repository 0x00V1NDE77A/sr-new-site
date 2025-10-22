import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { adminAuth } from "@/lib/admin-auth"

// POST - Log admin login activity
export async function POST(request: NextRequest) {
  try {
    const authResult = await adminAuth()
    if (authResult instanceof NextResponse) return authResult
    
    const { session } = authResult

    const body = await request.json()
    const { action, details } = body

    const client = await clientPromise
    const db = client.db()
    const authLogsCollection = db.collection("admin_auth_logs")

    // Get client IP and user agent
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ip = forwarded ? forwarded.split(",")[0] : realIp || "unknown"
    
    const userAgent = request.headers.get("user-agent") || "unknown"
    const referer = request.headers.get("referer") || "unknown"

    const logEntry = {
      userId: session.user.id,
      userEmail: session.user.email,
      action: action || "login",
      details: details || {},
      ip: ip,
      userAgent: userAgent,
      referer: referer,
      timestamp: new Date(),
      createdAt: new Date()
    }

    const result = await authLogsCollection.insertOne(logEntry)

    return NextResponse.json({ 
      success: true, 
      logId: result.insertedId,
      message: "Auth activity logged successfully" 
    })

  } catch (error) {
    console.error("[v0] POST admin auth logs error:", error)
    return NextResponse.json({ error: "Failed to log auth activity" }, { status: 500 })
  }
}

// GET - Fetch admin auth logs (admin only)
export async function GET(request: NextRequest) {
  try {
    const authResult = await adminAuth()
    if (authResult instanceof NextResponse) return authResult
    
    const { session } = authResult

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const userId = searchParams.get("userId")
    const action = searchParams.get("action")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const client = await clientPromise
    const db = client.db()
    const authLogsCollection = db.collection("admin_auth_logs")

    // Build filter query
    const filter: any = {}
    
    if (userId) filter.userId = userId
    if (action) filter.action = action
    if (startDate || endDate) {
      filter.timestamp = {}
      if (startDate) filter.timestamp.$gte = new Date(startDate)
      if (endDate) filter.timestamp.$lte = new Date(endDate)
    }

    // Get total count for pagination
    const total = await authLogsCollection.countDocuments(filter)

    // Fetch logs with pagination
    const logs = await authLogsCollection
      .find(filter)
      .sort({ timestamp: -1 }) // Most recent first
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error("[v0] GET admin auth logs error:", error)
    return NextResponse.json({ error: "Failed to fetch auth logs" }, { status: 500 })
  }
}
