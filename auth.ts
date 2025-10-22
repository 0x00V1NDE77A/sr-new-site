// auth.ts
import NextAuth from "next-auth"
import config from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...config,
  // Add secret for NextAuth v5
  secret: process.env.NEXTAUTH_SECRET,
})

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs")
  return bcrypt.hash(password, 12)
}

export async function requireAuth(requiredRole?: "admin" | "user") {
  const session = await auth()

  if (!session) {
    throw new Error("Authentication required")
  }

  if (requiredRole === "admin" && session.user.role !== "admin") {
    throw new Error("Admin access required")
  }

  return session
}

export async function canWrite(session?: any) {
  if (!session) {
    const currentSession = await auth()
    if (!currentSession) return false
    session = currentSession
  }

  // Only admins can perform write operations
  return session?.user?.role === "admin"
}

export async function canAccessAdmin(session?: any) {
  if (!session) {
    const currentSession = await auth()
    if (!currentSession) return false
    session = currentSession
  }

  // Both admins and users can access admin area (you can restrict this if needed)
  return session?.user?.role === "admin" || session?.user?.role === "user"
}
