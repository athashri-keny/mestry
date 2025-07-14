import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from 'next-auth/middleware'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = new URL(request.url)

  const isAuth = !!token

  // ✅ Only exact auth-related public pages
  const isAuthPage = ['/sign-in', '/sign-up', '/verify'].some(path =>
    url.pathname === path || url.pathname.startsWith(path + '/')
  )

  const isProtectedRoute = url.pathname.startsWith('/dashboard')

  console.log('🔥 middleware running')
  console.log('Pathname:', url.pathname)
  console.log('Token:', token)

  if (isAuth && isAuthPage) {
    console.log('✅ Authenticated user on auth page → redirecting to /dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isAuth && isProtectedRoute) {
    console.log('🚫 Unauthenticated user on dashboard → redirecting to /sign-in')
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/verify/:path*',
    '/dashboard/:path*',
  ],
}
