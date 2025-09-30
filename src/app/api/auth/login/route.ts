import { getAuthEdgeOptions } from '@/lib/firebase/edge-options';
import { adminAuth } from '@/lib/firebase/server-admin';
import { refreshNextResponseCookiesWithToken } from 'next-firebase-auth-edge/lib/next/cookies';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const authorization = request.headers.get('authorization') ?? request.headers.get('Authorization');
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : null;

    if (!token) {
        return NextResponse.json({ error: 'ID token missing' }, { status: 401 });
    }

    try {
        const auth = adminAuth();
        const decoded = await auth.verifyIdToken(token, true);

        const response = new NextResponse(
            JSON.stringify({
                success: true,
                uid: decoded.uid,
                email: decoded.email ?? null,
                displayName: decoded.name ?? null,
            }),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                },
            }
        );

        return refreshNextResponseCookiesWithToken(token, request, response, getAuthEdgeOptions());
    } catch (error) {
        console.error('[auth/login] token verification failed', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
}
