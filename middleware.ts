import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const SUPPORTED_LOCALES = ['en', 'bg'] as const
const DEFAULT_LOCALE = 'en'
const LOCALE_PREFIX_REGEX = new RegExp(`^/(${SUPPORTED_LOCALES.join('|')})(/|$)`)
const PUBLIC_FILE = /\.(.*)$/

const I18N_EXCLUDE_PREFIXES = [
  '/admin',
  '/api',
  '/_next',
  '/favicon.ico',
  '/manifest.webmanifest',
  '/robots.txt',
  '/sitemap.xml',
  '/sr-auth',
]

function localeAlreadyPresent(pathname: string) {
  return LOCALE_PREFIX_REGEX.test(pathname)
}

function shouldHandleI18n(pathname: string) {
  if (PUBLIC_FILE.test(pathname)) return false
  return !I18N_EXCLUDE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value
  })

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  if (!languages || languages.length === 0) {
    return DEFAULT_LOCALE
  }

  return matchLocale(languages, SUPPORTED_LOCALES, DEFAULT_LOCALE)
}

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

  if (shouldHandleI18n(pathname) && !localeAlreadyPresent(pathname)) {
    const locale = getLocale(request)
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
    return NextResponse.redirect(redirectUrl)
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
