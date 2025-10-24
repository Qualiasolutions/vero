#!/usr/bin/env tsx
/**
 * Remove Products Without Images
 *
 * Archives products that don't have images
 */

import Stripe from "stripe";
import "dotenv/config";

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

	// Find products without images
	const productsWithoutImages = allProducts.filter(
		(product) => !product.images || product.images.length === 0,
	);

	console.log(`❌ Found ${productsWithoutImages.length} products without images\n`);

	if (productsWithoutImages.length === 0) {
		console.log("✅ All products have images!\n");
		return;
	}

	console.log("🗑️  Products to remove:");
	productsWithoutImages.forEach((product, index) => {
		console.log(`${(index + 1).toString().padStart(2)}. ${product.name}`);
		console.log(`    ID: ${product.id}`);
	});

	console.log(`\n⚠️  This will archive ${productsWithoutImages.length} products without images`);
	console.log("⚠️  They will be set to inactive (not permanently deleted)");
	console.log("⚠️  Press Ctrl+C to cancel or wait 5 seconds to continue...\n");
	await new Promise((resolve) => setTimeout(resolve, 5000));

	console.log("🚀 Archiving products...\n");

	let successCount = 0;
	let errorCount = 0;

	for (const product of productsWithoutImages) {
		try {
			await stripe.products.update(product.id, {
				active: false,
			});

			console.log(`✅ Archived: ${product.name.substring(0, 60)}`);
			successCount++;

			// Small delay to avoid rate limiting
			await new Promise((resolve) => setTimeout(resolve, 100));
		} catch (error) {
			console.error(`❌ Failed: ${product.name}:`, error);
			errorCount++;
		}
	}

	console.log("\n" + "=".repeat(80));
	console.log("📈 SUMMARY");
	console.log("=".repeat(80));
	console.log(`✅ Successfully archived: ${successCount} products`);
	console.log(`❌ Failed: ${errorCount} products`);
	console.log(`📦 Total processed: ${productsWithoutImages.length} products`);
	console.log(`\n🎉 Active products remaining: ${allProducts.length - successCount}`);
	console.log("\n✨ Cleanup complete!\n");
}

main().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
