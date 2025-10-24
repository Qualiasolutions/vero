#!/usr/bin/env tsx
/**
 * Verify Product Categories
 *
 * Shows the current distribution of products across categories
 */

import Stripe from "stripe";
import "dotenv/config";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

async function main() {
	console.log("🔍 Fetching all active products from Stripe...\n");

	// Fetch all products
	const allProducts: Stripe.Product[] = [];
	let hasMore = true;
	let startingAfter: string | undefined;

	while (hasMore) {
		const response = await stripe.products.list({
			limit: 100,
			active: true,
			...(startingAfter && { starting_after: startingAfter }),
		});

		allProducts.push(...response.data);
		hasMore = response.has_more;
		if (response.data.length > 0) {
			startingAfter = response.data[response.data.length - 1]?.id;
		}
	}

	console.log(`✅ Found ${allProducts.length} total active products\n`);

	// Count by category
	const categoryCounts: Record<string, number> = {
		"pre-order": 0,
		"new-arrivals": 0,
		"on-sale": 0,
		"limited-edition": 0,
		rare: 0,
		"coming-soon": 0,
		"no-category": 0,
	};

	const categoryProducts: Record<string, string[]> = {
		"pre-order": [],
		"new-arrivals": [],
		"on-sale": [],
		"limited-edition": [],
		rare: [],
		"coming-soon": [],
		"no-category": [],
	};

	for (const product of allProducts) {
		const category = product.metadata.category || "no-category";
		if (category in categoryCounts) {
			categoryCounts[category]++;
			categoryProducts[category]?.push(product.name);
		} else {
			categoryCounts["no-category"]++;
			categoryProducts["no-category"]?.push(product.name);
		}
	}

	console.log("=".repeat(70));
	console.log("📊 CATEGORY DISTRIBUTION");
	console.log("=".repeat(70));

	const sortedCategories = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a);

	for (const [category, count] of sortedCategories) {
		const percentage = ((count / allProducts.length) * 100).toFixed(1);
		const bar = "█".repeat(Math.floor(count / 5));
		console.log(`\n${category.padEnd(20)} ${count.toString().padStart(3)} products (${percentage}%)`);
		console.log(`${"".padEnd(20)} ${bar}`);
	}

	console.log("\n" + "=".repeat(70));
	console.log("\n✨ Verification complete!\n");

	// Show if there are any uncategorized products
	if (categoryCounts["no-category"] > 0) {
		console.log(`⚠️  Warning: ${categoryCounts["no-category"]} products have no category assigned`);
		console.log("\nUncategorized products:");
		categoryProducts["no-category"]?.slice(0, 10).forEach((name) => {
			console.log(`  - ${name}`);
		});
		if ((categoryProducts["no-category"]?.length || 0) > 10) {
			console.log(`  ... and ${(categoryProducts["no-category"]?.length || 0) - 10} more`);
		}
		console.log();
	}
}

main().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
