import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { getAuthSecret } from '@/lib/server/authSecret'

const normalizeAdminBase = (value: string | undefined) => {
    const raw = (value || '/admin').trim()
    const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`
    return withLeadingSlash.replace(/\/+$/, '') || '/admin'
}

export async function middleware(request: NextRequest) {
    const url = request.nextUrl
    const adminBasePath = normalizeAdminBase(process.env.ADMIN_PANEL_PATH)
    const adminLoginPath = `${adminBasePath}/login`
    const isInternalAdminRoute = url.pathname.startsWith('/admin')
    const isHiddenAdminRoute = url.pathname === adminBasePath || url.pathname.startsWith(`${adminBasePath}/`)
    const isHiddenAdminLoginRoute = url.pathname === adminLoginPath
    const isAuthPage =
        url.pathname.startsWith('/signin') ||
        url.pathname.startsWith('/signup') ||
        url.pathname.startsWith('/forgot-password')

    if (isInternalAdminRoute) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!isHiddenAdminRoute && !isAuthPage) {
        return NextResponse.next()
    }

    const token = await getToken({ req: request, secret: getAuthSecret() })
    const isAdminAuthenticated = token?.role === 'admin'

    if (isHiddenAdminRoute) {
        if (!isAdminAuthenticated && !isHiddenAdminLoginRoute) {
            return NextResponse.redirect(new URL(adminLoginPath, request.url))
        }

        if (isAdminAuthenticated && isHiddenAdminLoginRoute) {
            return NextResponse.redirect(new URL(adminBasePath, request.url))
        }

        const rewriteTarget = new URL(isHiddenAdminLoginRoute ? '/admin/login' : '/admin', request.url)
        return NextResponse.rewrite(rewriteTarget)
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()  // Allow request to proceed
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)'],
};
