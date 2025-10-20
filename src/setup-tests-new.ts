import "next";
import { afterEach, expect, vi } from "vitest";
import { loadEnvConfig } from "@next/env";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { createElement } from "react";

loadEnvConfig(".");

/**
 * Vitest test setup logic
 */

expect.extend(matchers);

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

// Mock environment variables for tests
process.env.NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_mock";
process.env.STRIPE_CURRENCY = process.env.STRIPE_CURRENCY || "aed";
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_mock";

// Mock Next.js router
vi.mock("next/navigation", async () => {
	const actual = await vi.importActual("next/navigation");
	return {
		...actual,
		useRouter: vi.fn(() => ({
			push: vi.fn(),
			replace: vi.fn(),
			prefetch: vi.fn(),
			back: vi.fn(),
			pathname: "/",
			query: {},
		})),
		usePathname: vi.fn(() => "/"),
		useSearchParams: vi.fn(() => new URLSearchParams()),
		redirect: vi.fn((url: string) => {
			throw new Error(`REDIRECT:${url}`);
		}),
	};
});

// Mock Next.js Image component
vi.mock("next/image", () => ({
	default: (props: any) => createElement("img", props),
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
	default: ({ children, href, ...props }: any) => createElement("a", { href, ...props }, children),
}));

// Global test utilities
global.structuredClone =
	global.structuredClone ||
	((obj: any) => {
		return JSON.parse(JSON.stringify(obj));
	});
