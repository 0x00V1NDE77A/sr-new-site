import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { adminAuth } from "@/lib/admin-auth"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

// POST - Change admin password
export async function POST(request: NextRequest) {
  try {
    const authResult = await adminAuth()
    if (authResult instanceof NextResponse) return authResult
    
    const { session } = authResult

    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ 
        error: "All fields are required" 
      }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ 
        error: "New passwords do not match" 
      }, { status: 400 })
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: "Password must be at least 8 characters long" 
      }, { status: 400 })
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)) {
      return NextResponse.json({ 
        error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" 
      }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection("users")

    // Find the current user
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(session.user.id),
      email: session.user.email 
    })

    if (!user) {
      return NextResponse.json({ 
        error: "User not found" 
      }, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ 
        error: "Current password is incorrect" 
      }, { status: 400 })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update password in database
    const result = await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedNewPassword,
          updatedAt: new Date()
        } 
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ 
        error: "Failed to update password" 
      }, { status: 500 })
    }

    // Log the password change activity
    try {
      const authLogsCollection = db.collection("admin_auth_logs")
      const logEntry = {
        userId: session.user.id,
        userEmail: session.user.email,
        action: "password_change",
        details: {
          method: "admin_panel",
          success: true,
          location: "Admin Settings",
          auto_signout: true,
          timestamp: new Date().toISOString()
        },
        ip: request.headers.get("x-forwarded-for")?.split(",")[0] || 
            request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        referer: request.headers.get("referer") || "unknown",
        timestamp: new Date(),
        createdAt: new Date()
      }
      await authLogsCollection.insertOne(logEntry)
    } catch (logError) {
      console.error("Failed to log password change:", logError)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({ 
      success: true,
      message: "Password changed successfully" 
    })

  } catch (error) {
    console.error("[v0] POST admin change password error:", error)
    return NextResponse.json({ 
      error: "Failed to change password" 
    }, { status: 500 })
  }
}
