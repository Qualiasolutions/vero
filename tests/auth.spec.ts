import { expect, test } from "@playwright/test";

const TEST_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

test.describe("Authentication", () => {
	test("should show login page and allow login", async ({ page }) => {
		// Navigate to login page
		await page.goto(`${TEST_URL}/login`);

		// Check that login form is visible
		await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/password/i)).toBeVisible();

		// Fill in the form with test credentials
		await page.getByLabel(/email/i).fill(process.env.EMAIL || "test@test.com");
		await page.getByLabel(/password/i).fill(process.env.PASSWORD || "test1234");

		// Click sign in button
		await page.getByRole("button", { name: /sign in/i }).click();

		// Wait for navigation or success
		await page.waitForURL(/\/orders/, { timeout: 10000 });

		// Verify we're on the orders page
		expect(page.url()).toContain("/orders");
	});

	test("should show signup page and display form", async ({ page }) => {
		// Navigate to signup page
		await page.goto(`${TEST_URL}/signup`);

		// Check that signup form is visible
		await expect(page.getByRole("heading", { name: /create account|sign up/i })).toBeVisible();
		await expect(page.getByLabel(/name/i)).toBeVisible();
		await expect(page.getByLabel(/^email/i)).toBeVisible();
		await expect(page.getByLabel(/^password/i)).toBeVisible();
		await expect(page.getByLabel(/confirm password/i)).toBeVisible();
	});

	test("should logout successfully", async ({ page }) => {
		// First login
		await page.goto(`${TEST_URL}/login`);
		await page.getByLabel(/email/i).fill(process.env.EMAIL || "test@test.com");
		await page.getByLabel(/password/i).fill(process.env.PASSWORD || "test1234");
		await page.getByRole("button", { name: /sign in/i }).click();
		await page.waitForURL(/\/orders/, { timeout: 10000 });

		// Find and click logout button (usually in navigation)
		const logoutButton = page.getByRole("button", { name: /log out|logout|sign out/i });
		await expect(logoutButton).toBeVisible();
		await logoutButton.click();
		await page.waitForURL(/\/login/, { timeout: 10000 });
		expect(page.url()).toContain("/login");
	});
});
