import { getTokens } from 'next-firebase-auth-edge';

type EdgeOptions = Parameters<typeof getTokens>[1];

const DEFAULT_COOKIE_SECRET = 'development-cookie-secret-key-please-change';

export const getAuthEdgeOptions = (): EdgeOptions => ({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
    cookieName: 'AuthToken',
    cookieSignatureKeys: (process.env.COOKIE_SECRET_KEYS ?? DEFAULT_COOKIE_SECRET).split(',').filter(Boolean),
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
});
