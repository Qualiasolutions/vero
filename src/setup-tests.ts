import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import type { ComponentProps } from "react";
import { createElement } from "react";
import { afterEach, expect, vi } from "vitest";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
	cleanup();
	vi.clearAllMocks();
	vi.resetAllMocks();
});

// Mock Next.js Image component
type ImgProps = ComponentProps<"img">;
type AnchorProps = ComponentProps<"a">;

vi.mock("next/image", () => ({
	default: (props: ImgProps) => createElement("img", props),
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
	default: ({ href, children, ...props }: AnchorProps) => createElement("a", { href, ...props }, children),
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
