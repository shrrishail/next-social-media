import { NextRequest, NextResponse } from "next/server";

export async function middleware(request:  NextRequest) {
    const pathName = request.nextUrl.pathname;
    const isPublicPath = pathName === '/login' || pathName === '/signup';
    const token = request.cookies.get('token')?.value;

    if(isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    } else if(!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
}

export const config = {
    matcher: [
        '/login',
        '/signup',
        '/profile'
    ]
}