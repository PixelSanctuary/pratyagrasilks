import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { type UserRole, ADMIN_LEVEL_ROLES } from '@/lib/constants/roles';

export async function middleware(request: NextRequest) {
    // Bootstrap a mutable response so cookie writes propagate
    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    // Refresh session — must happen before any redirect
    const { data: { user } } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // ── 1. No session → login ────────────────────────────────────────────────
    if (!user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/auth/login';
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ── 2. Fetch role from profiles ──────────────────────────────────────────
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const role = profile?.role as UserRole | undefined;

    // ── 3. CUSTOMER / VENDOR / unknown → no admin access ────────────────────
    if (!role || !ADMIN_LEVEL_ROLES.includes(role)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // ── 4. CASHIER guard ────────────────────────────────────────────────────
    if (role === 'CASHIER') {
        const CASHIER_ALLOWED =
            pathname === '/admin/pos'          ||
            pathname.startsWith('/admin/pos/') ||
            pathname === '/admin/products'     ||
            pathname.startsWith('/admin/products/') ||
            pathname === '/admin/vendors'      ||
            pathname.startsWith('/admin/vendors/');

        // Explicitly blocked paths (even if pattern-matched above, belt-and-suspenders)
        const CASHIER_BLOCKED =
            pathname.startsWith('/admin/settings')  ||
            pathname.startsWith('/admin/analytics') ||
            pathname.startsWith('/admin/users');

        if (!CASHIER_ALLOWED || CASHIER_BLOCKED) {
            return NextResponse.redirect(new URL('/admin/pos', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: ['/admin/:path*'],
};
