import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protection des routes admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session?.user || session.user.user_metadata.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  // Protection des routes authentifiées
  if (
    req.nextUrl.pathname.startsWith('/profile') ||
    req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/dashboard/:path*'],
}
