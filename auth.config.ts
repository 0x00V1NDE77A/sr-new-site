import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 NextAuth authorize called with:", { email: credentials?.email, hasPassword: !!credentials?.password })
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials")
          return null
        }

        try {
          // Dynamic import to avoid Edge Runtime issues
          const { default: User } = await import("./lib/models/User")
          console.log("🔍 Looking for user:", credentials.email)
          const user = await User.authenticate(credentials.email as string, credentials.password as string)

          if (!user) {
            console.log("❌ Authentication failed for:", credentials.email)
            return null
          }

          console.log("✅ Authentication successful for:", credentials.email)
          return {
            id: user._id?.toString() || "",
            email: user.email,
            name: user.email, // Using email as name since we don't have a name field
            role: user.role
          }
        } catch (error) {
          console.error("❌ Authentication error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    // Set session to last 15 days (15 * 24 * 60 * 60 = 1,296,000 seconds)
    maxAge: 15 * 24 * 60 * 60, // 15 days in seconds
  },
  jwt: {
    // JWT token will also last 15 days
    maxAge: 15 * 24 * 60 * 60, // 15 days in seconds
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as "admin" | "user"
        token.id = user.id as string
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as "admin" | "user"
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/sr-auth/login",
  },
} satisfies NextAuthConfig
