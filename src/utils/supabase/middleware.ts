
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const isAdmin = user?.user_metadata?.role === 'admin' || user?.email === 'admin@gmail.com'

    const isPublicRoute =
        request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup') ||
        request.nextUrl.pathname.startsWith('/auth') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.includes('.')

    // 1. Protect /admin routes (Only admins allowed)
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user || !isAdmin) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // 2. Protect sensitive user routes (Any logged-in user)
    const isProtectedRoute =
        request.nextUrl.pathname.startsWith('/add-course') ||
        request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname.startsWith('/settings') ||
        request.nextUrl.pathname.includes('/write-review') ||
        request.nextUrl.pathname.includes('/claim')

    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. Protect User Panel from Admins (Admins must stay in /admin)
    if (user && isAdmin && isPublicRoute && !request.nextUrl.pathname.startsWith('/admin')) {
        // Only redirect if they are not explicitly logging out or in auth flow
        if (!request.nextUrl.pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    return response
}
