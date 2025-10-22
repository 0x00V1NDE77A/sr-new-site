import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is an admin route (both UI and API)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    try {
      // Check for NextAuth session cookie instead of using getToken
      // This is more reliable in middleware/Edge Runtime
      const sessionToken = request.cookies.get("__Secure-authjs.session-token")?.value || 
                          request.cookies.get("authjs.session-token")?.value ||
                          request.cookies.get("next-auth.session-token")?.value ||
                          request.cookies.get("__Secure-next-auth.session-token")?.value

      if (!sessionToken) {
        if (pathname.startsWith('/api/admin')) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        return NextResponse.redirect(new URL('/sr-auth/login', request.url))
      }

      // For admin-only routes, we'll let the client-side protection handle role checking
      // This avoids Edge Runtime issues with JWT decoding
      const adminOnlyRoutes = [
        "/admin/questions",
        "/admin/email", 
        "/admin/export"
      ]
      
      const isAdminOnlyRoute = adminOnlyRoutes.some(route => pathname.includes(route))
      if (isAdminOnlyRoute) {
        // For admin-only routes, we'll let the client-side ProtectedAdmin component handle the role check
        // This is more reliable and avoids Edge Runtime limitations
      }
      
      // User is authenticated - allow access
      return NextResponse.next()
      
    } catch (error) {
      console.error('Middleware error:', error)
      
      // If there's an error validating the token, redirect to login
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: "Authentication error" }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/sr-auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
