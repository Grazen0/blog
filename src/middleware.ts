import withAuth, { NextRequestWithAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	if (pathname === '/admin/login' || pathname === '/admin/logout') {
		return NextResponse.next();
	}

	return withAuth(request as NextRequestWithAuth);
}

export const config = {
	matcher: ['/admin/:path*'],
};
