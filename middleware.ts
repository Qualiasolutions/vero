import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
	// Skip middleware for static files, images, and API routes that don't need auth
	const skipPaths = ["/_next", "/api", "/favicon.ico", "/robots.txt", "/sitemap.xml", "/stats"];

	// Check if the request path starts with any skip path
	if (skipPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
		return;
	}

	// Skip auth for public store pages
	const publicPaths = [
		"/",
		"/login",
		"/signup",
		"/auth",
		"/products",
		"/category",
		"/search",
		"/contact",
		"/about",
		"/faq",
		"/privacy-policy",
		"/terms-of-service",
		"/shipping-returns",
		"/newsletter",
	];

	// Check if the request path matches any public path or its subpaths
	if (
		publicPaths.some(
			(path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/"),
		)
	) {
		// Update session but don't enforce auth
		return await updateSession(request);
	}

	// For protected routes (like /orders, /checkout, /favorites), update session and enforce auth
	return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (public directory)
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
