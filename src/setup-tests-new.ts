import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { createElement } from "react";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
	cleanup();
	vi.clearAllMocks();
	vi.resetAllMocks();
});

// Mock Next.js Image component
vi.mock("next/image", () => ({
	default: (props: any) => createElement("img", props),
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
	default: ({ href, children, ...props }: any) =>
		createElement("a", { href, ...props }, children),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn(),
		pathname: "/",
		query: {},
	}),
	usePathname: () => "/",
	useSearchParams: () => new URLSearchParams(),
	redirect: vi.fn((url: string) => {
		throw new Error(`REDIRECT:${url}`);
	}),
}));
