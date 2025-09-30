import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const response = new NextResponse(
        JSON.stringify({ success: true }),
        {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
        }
    );

    response.cookies.set('AuthToken', '', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
    });

    return response;
}
