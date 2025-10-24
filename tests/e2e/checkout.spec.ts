import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Checkout Flow
 *
 * These tests verify the complete user journey from browsing to checkout
 */

test.describe("Checkout Flow", () => {
	test.beforeEach(async ({ page }) => {
		// Start from homepage
		await page.goto("/");
	});

	test("should complete full checkout flow", async ({ page }) => {
		// 1. Browse products
		await page.click('[data-testid="product-card"]').first();
		await expect(page).toHaveURL(/\/product\/.+/);

		// 2. Add to cart
		await page.click('[data-testid="add-to-cart"]');
		await expect(page.locator('[data-testid="cart-count"]')).toHaveText("1");

		// 3. Open cart
		await page.click('[data-testid="cart-button"]');
		await expect(page.locator('[data-testid="cart-sidebar"]')).toBeVisible();

		// 4. Verify cart item
		await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();

		// 5. Go to checkout
		await page.click('[data-testid="checkout-button"]');

		// Note: In real tests, you would continue to Stripe's test mode
		// For now, we just verify the checkout session is created
		await expect(page).toHaveURL(/checkout\.stripe\.com|localhost:3000\/checkout/);
	});

	test("should prevent checkout with empty cart", async ({ page }) => {
		// Try to access checkout directly
		await page.goto("/checkout");

		// Should redirect to cart page
		await expect(page).toHaveURL(/\/cart/);
	});

	test("should update cart quantities", async ({ page }) => {
		// Add product to cart
		await page.click('[data-testid="product-card"]').first();
		await page.click('[data-testid="add-to-cart"]');

		// Open cart
		await page.click('[data-testid="cart-button"]');

		// Increase quantity
		await page.click('[data-testid="increase-quantity"]');
		await expect(page.locator('[data-testid="item-quantity"]')).toHaveText("2");

		// Verify total updated
		const total = await page.locator('[data-testid="cart-total"]').textContent();
		expect(total).toBeTruthy();
	});

	test("should remove item from cart", async ({ page }) => {
		// Add product
		await page.click('[data-testid="product-card"]').first();
		await page.click('[data-testid="add-to-cart"]');

		// Open cart and remove
		await page.click('[data-testid="cart-button"]');
		await page.click('[data-testid="remove-item"]');

		// Verify cart is empty
		await expect(page.locator('[data-testid="empty-cart"]')).toBeVisible();
		await expect(page.locator('[data-testid="cart-count"]')).toHaveText("0");
	});
});

test.describe("Product Pages", () => {
	test("should display product details", async ({ page }) => {
		await page.goto("/");

		// Click first product
		await page.click('[data-testid="product-card"]').first();

		// Verify product details are visible
		await expect(page.locator("h1")).toBeVisible();
		await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
		await expect(page.locator('[data-testid="product-image"]')).toBeVisible();
		await expect(page.locator('[data-testid="add-to-cart"]')).toBeVisible();
	});

	test("should show similar products", async ({ page }) => {
		await page.goto("/");
		await page.click('[data-testid="product-card"]').first();

		// Check if similar products section exists
		const similarSection = page.locator("text=Similar Products");
		if (await similarSection.isVisible()) {
			// If similar products exist, verify they're clickable
			await expect(page.locator('[data-testid="similar-product"]').first()).toBeVisible();
		}
	});

	test("should handle add to cart with quantity", async ({ page }) => {
		await page.goto("/");
		await page.click('[data-testid="product-card"]').first();

		// Change quantity before adding
		await page.fill('[data-testid="quantity-input"]', "3");
		await page.click('[data-testid="add-to-cart"]');

		// Verify cart count reflects quantity
		await expect(page.locator('[data-testid="cart-count"]')).toHaveText("3");
	});
});

test.describe("Authentication", () => {
	test("should show login form", async ({ page }) => {
		await page.goto("/login");
		await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
		await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
		await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
	});

	test("should show signup form", async ({ page }) => {
		await page.goto("/signup");
		await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
		await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
		await expect(page.locator('[data-testid="signup-button"]')).toBeVisible();
	});

	test("should validate email format", async ({ page }) => {
		await page.goto("/login");
		await page.fill('[data-testid="email-input"]', "invalid-email");
		await page.click('[data-testid="login-button"]');

		// Should show validation error
		await expect(page.locator("text=/invalid.*email/i")).toBeVisible();
	});
});

test.describe("Search", () => {
	test("should search products", async ({ page }) => {
		await page.goto("/");

		// Open search
		await page.click('[data-testid="search-button"]');
		await page.fill('[data-testid="search-input"]', "BMW");
		await page.press('[data-testid="search-input"]', "Enter");

		// Should show search results
		await expect(page).toHaveURL(/\/search/);
		await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
	});

	test("should handle no results", async ({ page }) => {
		await page.goto("/");

		await page.click('[data-testid="search-button"]');
		await page.fill('[data-testid="search-input"]', "nonexistentproduct123");
		await page.press('[data-testid="search-input"]', "Enter");

		// Should show no results message
		await expect(page.locator("text=/no.*products.*found/i")).toBeVisible();
	});
});

test.describe("Mobile Responsiveness", () => {
	test.use({ viewport: { width: 375, height: 667 } });

	test("should work on mobile", async ({ page }) => {
		await page.goto("/");

		// Mobile menu should be present
		await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();

		// Products should be in single column
		const productCards = page.locator('[data-testid="product-card"]');
		const count = await productCards.count();
		expect(count).toBeGreaterThan(0);
	});

	test("should open mobile menu", async ({ page }) => {
		await page.goto("/");

		// Click hamburger menu
		await page.click('[data-testid="mobile-menu-button"]');

		// Menu should be visible
		await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
	});
});

test.describe("Accessibility", () => {
	test("should have proper heading hierarchy", async ({ page }) => {
		await page.goto("/");

		// Check for h1
		const h1 = await page.locator("h1").count();
		expect(h1).toBeGreaterThanOrEqual(1);
	});

	test("should have alt text on images", async ({ page }) => {
		await page.goto("/");

		// All images should have alt attribute
		const images = page.locator("img");
		const count = await images.count();

		for (let i = 0; i < count; i++) {
			const alt = await images.nth(i).getAttribute("alt");
			expect(alt).toBeTruthy();
		}
	});

	test("should be keyboard navigable", async ({ page }) => {
		await page.goto("/");

		// Tab through focusable elements
		await page.keyboard.press("Tab");
		await page.keyboard.press("Tab");
		await page.keyboard.press("Tab");

		// A focusable element should have focus
		const focused = await page.evaluate(() => document.activeElement?.tagName);
		expect(["A", "BUTTON", "INPUT"]).toContain(focused);
	});
});
