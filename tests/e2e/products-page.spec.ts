import { expect, test } from "@playwright/test";

test.describe("Products Page", () => {
	test("should load products page without errors", async ({ page }) => {
		// Go to products page
		await page.goto("/products");

		// Should load successfully (not 404)
		await expect(page).toHaveURL(/\/products/);

		// Check for main elements
		await expect(page.locator("h1")).toBeVisible();

		// Check for "All Models" text in hero section
		await expect(page.locator("text=All Models")).toBeVisible();

		// Should have product filters
		await expect(page.locator('[data-testid="product-filters"], text=Search, text=Category')).toBeVisible();
	});

	test("should display product list", async ({ page }) => {
		await page.goto("/products");

		// Wait for products to load
		await page.waitForTimeout(2000);

		// Should have product cards or empty state
		const productCards = page.locator('[data-testid="product-card"], .product-card, article');
		const count = await productCards.count();

		if (count > 0) {
			// If products exist, verify they have required elements
			await expect(productCards.first()).toBeVisible();
		} else {
			// If no products, should show loading or empty state
			const loading = page.locator("text=Loading, text=No products, .skeleton");
			await expect(loading).toHaveCount({ min: 1 });
		}
	});

	test("should handle navigation from homepage", async ({ page }) => {
		// Start from homepage
		await page.goto("/");

		// Find and click products link
		const productsLink = page.locator('a[href="/products"]');
		await expect(productsLink).toBeVisible();
		await productsLink.click();

		// Should navigate to products page
		await expect(page).toHaveURL(/\/products/);
		await expect(page.locator("h1")).toBeVisible();
	});
});
