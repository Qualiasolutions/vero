import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { isAuthenticated } from "@/lib/auth-new";

// Protected paths that require authentication
const ProtectedPaths = ["/orders", "/profile", "/admin"];

// Admin-only paths
const AdminPaths = ["/admin"];

// Rate limiting configuration (optional - only if Redis is configured)
const ratelimit = process.env.UPSTASH_REDIS_REST_URL
	? new Ratelimit({
			redis: Redis.fromEnv(),
			limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
			analytics: true,
	  })
	: null;

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const response = NextResponse.next();

	// Add security headers
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-XSS-Protection", "1; mode=block");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set(
		"Permissions-Policy",
		"camera=(), microphone=(), geolocation=(), interest-cohort=()"
	);
	response.headers.set(
		"Strict-Transport-Security",
		"max-age=31536000; includeSubDomains; preload"
	);
	response.headers.set(
		"Content-Security-Policy",
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' blob: data: https: http:",
			"font-src 'self' data:",
			"connect-src 'self' https://api.stripe.com https://checkout.stripe.com",
			"frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
			"object-src 'none'",
			"base-uri 'self'",
			"form-action 'self'",
			"frame-ancestors 'none'",
			"upgrade-insecure-requests",
		].join("; ")
	);

	// Rate limiting for API routes
	if (pathname.startsWith("/api/") && ratelimit) {
		const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
		const { success, limit, reset, remaining } = await ratelimit.limit(ip);

		response.headers.set("X-RateLimit-Limit", limit.toString());
		response.headers.set("X-RateLimit-Remaining", remaining.toString());
		response.headers.set("X-RateLimit-Reset", new Date(reset).toISOString());

		if (!success) {
			return new NextResponse("Too Many Requests", {
				status: 429,
				headers: {
					"Retry-After": Math.floor((reset - Date.now()) / 1000).toString(),
				},
			});
		}
	}

	// Check protected paths
	const isProtectedPath = ProtectedPaths.some((p) => pathname.startsWith(p));
	const isAdminPath = AdminPaths.some((p) => pathname.startsWith(p));

	if (isProtectedPath) {
		const authenticated = await isAuthenticated();

		if (!authenticated) {
			const url = new URL("/login", request.url);
			url.searchParams.set("from", pathname);
			return NextResponse.redirect(url);
		}

		// Additional admin check
		if (isAdminPath) {
			const { isAdmin } = await import("@/lib/auth-new");
			const admin = await isAdmin();

			if (!admin) {
				return new NextResponse("Forbidden", { status: 403 });
			}
		}
	}

	// Update session if needed (extends expiry)
	if (request.cookies.has("veromodels-session")) {
		const { getSession } = await import("@/lib/auth-new");
		const session = await getSession();
		if (session.isLoggedIn) {
			await session.save();
		}
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (public folder)
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)",
	],
};