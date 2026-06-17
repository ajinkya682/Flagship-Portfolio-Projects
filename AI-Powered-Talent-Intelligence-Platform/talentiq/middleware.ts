import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/jobs',
  '/candidates',
  '/pipeline',
  '/interviews',
  '/offers',
  '/analytics',
  '/insights',
  '/messages',
  '/settings',
  '/applications',
  '/onboarding',
]

const authRoutes = ['/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  
  // Check if current route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // 1. If trying to access a protected route without a token
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 2. If logged in and trying to access auth pages (login/register)
  if (isAuthRoute && accessToken) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
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
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
