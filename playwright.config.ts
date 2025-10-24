import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for E2E testing
 *
 * Run tests: bunx playwright test
 * Run with UI: bunx playwright test --ui
 * Generate tests: bunx playwright codegen http://localhost:3000
 */

export default defineConfig({
	// Test directory
	testDir: "./tests/e2e",

	// Maximum time one test can run
	timeout: 30 * 1000,

	// Fail fast - stop on first failure
	fullyParallel: false,

	// Retry on CI, but not locally
	retries: process.env.CI ? 2 : 0,

	// Number of workers (parallel tests)
	...(process.env.CI ? { workers: 1 } : {}),

	// Reporter configuration
	reporter: [["html"], ["list"], process.env.CI ? ["github"] : ["list"]],

	// Shared settings for all projects
	use: {
		// Base URL for all tests
		baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",

		// Collect trace when retrying failed tests
		trace: "on-first-retry",

		// Screenshot on failure
		screenshot: "only-on-failure",

		// Video on failure
		video: "retain-on-failure",

		// Navigation timeout
		navigationTimeout: 15 * 1000,

		// Action timeout
		actionTimeout: 10 * 1000,
	},

	// Test projects for different browsers
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},

		// Mobile browsers
		{
			name: "Mobile Chrome",
			use: { ...devices["Pixel 5"] },
		},
		{
			name: "Mobile Safari",
			use: { ...devices["iPhone 12"] },
		},
	],

	// Run local dev server before tests (optional)
	...(process.env.CI
		? {}
		: {
				webServer: {
					command: "bun dev",
					url: "http://localhost:3000",
					timeout: 120 * 1000,
					reuseExistingServer: true,
				},
			}),
});
