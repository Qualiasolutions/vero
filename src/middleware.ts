import { createServerClient } from "@supabase/ssr";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { type NextRequest, NextResponse } from "next/server";

// Protected paths that require authentication
const ProtectedPaths = ["/orders", "/profile", "/admin"];

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

	// Create Supabase client with middleware cookie handling
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					for (const { name, value } of cookiesToSet) {
						request.cookies.set(name, value);
					}
					supabaseResponse = NextResponse.next({
						request,
					});
					for (const { name, value, options } of cookiesToSet) {
						supabaseResponse.cookies.set(name, value, options);
					}
				},
			},
		},
	);

	// Refresh session if expired
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Add security headers
	supabaseResponse.headers.set("X-Frame-Options", "DENY");
	supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
	supabaseResponse.headers.set("X-XSS-Protection", "1; mode=block");
	supabaseResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	supabaseResponse.headers.set(
		"Permissions-Policy",
		"camera=(), microphone=(), geolocation=(), interest-cohort=()",
	);
	supabaseResponse.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
	supabaseResponse.headers.set(
		"Content-Security-Policy",
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			"font-src 'self' data: https://fonts.gstatic.com",
			"img-src 'self' blob: data: https: http:",
			"connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://zskfdlqyzhkzefafqkpx.supabase.co",
			"frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
			"object-src 'none'",
			"base-uri 'self'",
			"form-action 'self'",
			"frame-ancestors 'none'",
			"upgrade-insecure-requests",
		].join("; "),
	);

	// Rate limiting for API routes
	if (pathname.startsWith("/api/") && ratelimit) {
		const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
		const { success, limit, reset, remaining } = await ratelimit.limit(ip);

		supabaseResponse.headers.set("X-RateLimit-Limit", limit.toString());
		supabaseResponse.headers.set("X-RateLimit-Remaining", remaining.toString());
		supabaseResponse.headers.set("X-RateLimit-Reset", new Date(reset).toISOString());

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

	if (isProtectedPath && !user) {
		const url = new URL("/login", request.url);
		url.searchParams.set("from", pathname);
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
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
