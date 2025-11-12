// app/admin/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import "../globals.css"
import { RadixSidebarDemo } from "@/components/admin/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: "Admin Dashboard - SR Holding",
  description: "SR Holding Admin Dashboard",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    // Use NextAuth v5 auth() function
    const session = await auth()

    // Check if user is authenticated and has admin role
    if (!session?.user) {
      console.log('No session or user found, redirecting to login')
      redirect('/sr-auth/login')
    }

    if (session.user.role !== 'admin') {
      console.log('User is not admin, redirecting to home')
      redirect('/')
    }

    // User is authenticated and is admin - allow access
    console.log('Admin access granted for:', session.user.email)
    
  } catch (error) {
    console.error('Admin layout auth error:', error)
    redirect('/sr-auth/login')
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900`}>
      <RadixSidebarDemo>
        {children}
      </RadixSidebarDemo>
    </div>
  )
}
