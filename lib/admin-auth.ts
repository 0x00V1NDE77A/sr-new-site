import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function adminAuth(): Promise<{ session: any } | NextResponse> {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }
    
    return { session } // Return session for successful auth
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json({ error: "Authentication error" }, { status: 401 })
  }
}
