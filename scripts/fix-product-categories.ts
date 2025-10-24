#!/usr/bin/env tsx
/**
 * Fix Product Categories Script
 *
 * This script redistributes the 22 "collection" products randomly across
 * the 5 non-preorder categories: new-arrivals, on-sale, limited-edition,
 * rare, and coming-soon.
 */

import Stripe from "stripe";
import "dotenv/config";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

// Categories to distribute products to (excluding pre-order)
const CATEGORIES = ["new-arrivals", "on-sale", "limited-edition", "rare", "coming-soon"] as const;

// Function to randomly select a category
function getRandomCategory(): string {
	return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

// Function to get category distribution
function getCategoryDistribution(categories: string[]): Record<string, number> {
	const distribution: Record<string, number> = {};
	categories.forEach((cat) => {
		distribution[cat] = (distribution[cat] || 0) + 1;
	});
	return distribution;
}

async function main() {
	console.log("🔍 Fetching all products from Stripe...\n");

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

	console.log(`✅ Found ${allProducts.length} total products\n`);

	// Find products that need categorization
	const needsCategorization = allProducts.filter((product) => {
		const category = product.metadata.category;
		// Products with no category or category="collection" need to be categorized
		return !category || category === "collection" || category === "";
	});

	console.log(`📦 Found ${needsCategorization.length} products needing categorization:\n`);

	// Filter out pre-order products (they should keep their category)
	const productsToUpdate = needsCategorization.filter((product) => {
		// Check if product slug or metadata indicates it's a pre-order
		const isPreOrder =
			product.metadata.slug?.includes("pre-order") ||
			product.name.toLowerCase().includes("pre-order") ||
			product.description?.toLowerCase().includes("pre-order");
		return !isPreOrder;
	});

	console.log(`🎯 ${productsToUpdate.length} products will be randomly categorized\n`);

	if (productsToUpdate.length === 0) {
		console.log("✅ No products to update. All products are properly categorized!");
		return;
	}

	// Show products to be updated
	productsToUpdate.forEach((product, index) => {
		console.log(`${index + 1}. ${product.name} (${product.id})`);
	});

	console.log("\n⚠️  Press Ctrl+C to cancel or wait 5 seconds to continue...\n");
	await new Promise((resolve) => setTimeout(resolve, 5000));

	// Assign random categories
	const assignments: Array<{ product: Stripe.Product; category: string }> = [];

	for (const product of productsToUpdate) {
		const category = getRandomCategory();
		assignments.push({ product, category });
	}

	console.log("\n📊 Category distribution:");
	const distribution = getCategoryDistribution(assignments.map((a) => a.category));
	Object.entries(distribution)
		.sort(([, a], [, b]) => b - a)
		.forEach(([category, count]) => {
			console.log(`  ${category}: ${count} products`);
		});

	console.log("\n🚀 Updating products in Stripe...\n");

	let successCount = 0;
	let errorCount = 0;

	for (const { product, category } of assignments) {
		try {
			await stripe.products.update(product.id, {
				metadata: {
					...product.metadata,
					category,
				},
			});
			console.log(`✅ Updated: ${product.name} → ${category}`);
			successCount++;
		} catch (error) {
			console.error(`❌ Failed to update ${product.name}:`, error);
			errorCount++;
		}
	}

	console.log("\n" + "=".repeat(60));
	console.log("📈 Summary:");
	console.log("=".repeat(60));
	console.log(`✅ Successfully updated: ${successCount} products`);
	console.log(`❌ Failed: ${errorCount} products`);
	console.log(`📦 Total processed: ${assignments.length} products`);
	console.log("\n🎉 Category redistribution complete!\n");

	// Show final distribution including pre-orders
	console.log("📊 Final category counts (including existing products):");
	const categoryCounts: Record<string, number> = {
		"pre-order": 0,
		"new-arrivals": 0,
		"on-sale": 0,
		"limited-edition": 0,
		rare: 0,
		"coming-soon": 0,
	};

	for (const product of allProducts) {
		const category = product.metadata.category;
		if (category && category in categoryCounts) {
			categoryCounts[category]++;
		}
	}

	Object.entries(categoryCounts)
		.sort(([, a], [, b]) => b - a)
		.forEach(([category, count]) => {
			console.log(`  ${category}: ${count} products`);
		});

	console.log("\n✨ Done! Products are now properly distributed across all categories.\n");
}

main().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
