import { getTokens } from 'next-firebase-auth-edge';
import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = [
    '/dashboard',
    '/subscription',
    '/payment',
    '/admin',
];

const cookieSignatureKeys = (process.env.COOKIE_SECRET_KEYS ?? 'development-cookie-secret-key-please-change').split(',').filter(Boolean);

const commonOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
    cookieName: 'AuthToken',
    cookieSignatureKeys,
    cookieSerializeOptions: {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 12 * 24 * 60 * 60,
    },
    serviceAccount: {
        projectId: process.env.FIREBASE_PROJECT_ID ?? '',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
        privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    },
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware if Firebase envs are not configured yet
    if (!commonOptions.apiKey || !commonOptions.serviceAccount.projectId) {
        return NextResponse.next();
    }

    // Allow public routes
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
    if (!isProtected) {
        return NextResponse.next();
    }

    const tokens = await getTokens(request.cookies, commonOptions).catch(() => null);

    if (!tokens) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', tokens.decodedToken.uid);
    if (tokens.decodedToken.email) {
        requestHeaders.set('x-user-email', tokens.decodedToken.email);
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|sitemap.xml|robots.txt).*)',
    ],
};
