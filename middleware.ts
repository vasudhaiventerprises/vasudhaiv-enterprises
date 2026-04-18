import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // This will refresh the session if it's expired
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const protectedRoutes = ['/dashboard', '/admin', '/staff', '/co-admin']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Robust path normalization for Production (handles trailing slashes)
  const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  const isAuthPage = normalizedPath.endsWith('/login') || normalizedPath === '/auth/callback' || normalizedPath === '/login'

  if (isProtectedRoute && !isAuthPage && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if logged in and trying to access login page
  if (pathname === '/login' && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/staff/:path*', 
    '/co-admin/:path*',
    '/login'
  ],
}
