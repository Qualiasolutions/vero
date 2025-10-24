#!/usr/bin/env tsx
/**
 * Remove Duplicate Products
 *
 * Safely removes duplicate products while keeping the best version of each
 * Strategy: Keep products with price + image, preferably older ones
 */

import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

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
			expand: ["data.default_price"],
			...(startingAfter && { starting_after: startingAfter }),
		});

		allProducts.push(...response.data);
		hasMore = response.has_more;
		if (response.data.length > 0) {
			startingAfter = response.data[response.data.length - 1]?.id;
		}
	}

	console.log(`✅ Found ${allProducts.length} total active products\n`);

	// Group products by name
	const productsByName = new Map<string, Stripe.Product[]>();

	for (const product of allProducts) {
		const name = product.name.trim();
		if (!productsByName.has(name)) {
			productsByName.set(name, []);
		}
		productsByName.get(name)?.push(product);
	}

	// Find duplicates and determine what to delete
	const toDelete: Array<{ id: string; name: string; reason: string }> = [];
	const toKeep: Array<{ id: string; name: string }> = [];

	for (const [name, products] of productsByName.entries()) {
		if (products.length > 1) {
			// Sort to find best product to keep
			const sorted = [...products].sort((a, b) => {
				// Priority 1: Has both price and image
				const aComplete = (a.default_price ? 1 : 0) + ((a.images?.length || 0) > 0 ? 1 : 0);
				const bComplete = (b.default_price ? 1 : 0) + ((b.images?.length || 0) > 0 ? 1 : 0);
				if (aComplete !== bComplete) return bComplete - aComplete;

				// Priority 2: Older product (lower created timestamp)
				return a.created - b.created;
			});

			// Keep first, delete rest
			const keep = sorted[0];
			const deleteList = sorted.slice(1);

			if (keep) {
				toKeep.push({ id: keep.id, name: keep.name });
			}

			deleteList.forEach((p) => {
				toDelete.push({
					id: p.id,
					name: p.name,
					reason: `Duplicate of ${keep?.id}`,
				});
			});
		} else {
			// Only one product with this name, keep it
			const product = products[0];
			if (product) {
				toKeep.push({ id: product.id, name: product.name });
			}
		}
	}

	console.log("=".repeat(80));
	console.log("📊 DEDUPLICATION PLAN");
	console.log("=".repeat(80));
	console.log(`\n✅ Products to keep:   ${toKeep.length}`);
	console.log(`🗑️  Products to delete: ${toDelete.length}`);
	console.log(`📦 Total products:     ${allProducts.length}`);
	console.log(`\n💡 After cleanup:      ${toKeep.length} unique products`);

	if (toDelete.length === 0) {
		console.log("\n✅ No duplicates to remove!\n");
		return;
	}

	console.log("\n" + "=".repeat(80));
	console.log("🗑️  PRODUCTS TO DELETE (first 20):");
	console.log("=".repeat(80));

	toDelete.slice(0, 20).forEach((item, index) => {
		console.log(`${(index + 1).toString().padStart(2)}. ${item.id} - ${item.name.substring(0, 60)}...`);
	});

	if (toDelete.length > 20) {
		console.log(`... and ${toDelete.length - 20} more products`);
	}

	console.log("\n⚠️  WARNING: This will permanently archive " + toDelete.length + " products!");
	console.log("⚠️  They will be set to inactive (archived), not deleted permanently.");
	console.log("⚠️  You can reactivate them later in Stripe dashboard if needed.");
	console.log("\n⚠️  Press Ctrl+C to cancel or wait 10 seconds to continue...\n");

	await new Promise((resolve) => setTimeout(resolve, 10000));

	console.log("🚀 Archiving duplicate products...\n");

	let successCount = 0;
	let errorCount = 0;

	for (const item of toDelete) {
		try {
			// Archive product (set active to false) instead of deleting
			await stripe.products.update(item.id, {
				active: false,
			});

			console.log(`✅ Archived: ${item.id} - ${item.name.substring(0, 50)}`);
			successCount++;

			// Small delay to avoid rate limiting
			await new Promise((resolve) => setTimeout(resolve, 100));
		} catch (error) {
			console.error(`❌ Failed to archive ${item.id}:`, error);
			errorCount++;
		}
	}

	console.log("\n" + "=".repeat(80));
	console.log("📈 SUMMARY");
	console.log("=".repeat(80));
	console.log(`✅ Successfully archived: ${successCount} products`);
	console.log(`❌ Failed: ${errorCount} products`);
	console.log(`📦 Total processed: ${toDelete.length} products`);
	console.log(`\n🎉 Active products remaining: ${toKeep.length}`);
	console.log(`📦 Archived products: ${successCount} (can be reactivated if needed)`);
	console.log("\n✨ Deduplication complete!\n");
	console.log("💡 Tip: Check your website to verify products display correctly.\n");
}

main().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
