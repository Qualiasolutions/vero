#!/usr/bin/env tsx
/**
 * Find Duplicate Products
 *
 * Identifies duplicate products in Stripe and recommends which to keep
 */

import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

interface DuplicateGroup {
	name: string;
	products: Array<{
		id: string;
		name: string;
		hasPrice: boolean;
		hasImage: boolean;
		category: string;
		created: number;
		slug?: string;
	}>;
}

async function main() {
	console.log("🔍 Fetching all products from Stripe...\n");

	// Fetch all products with expanded default_price
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

	// Group products by name (exact match)
	const productsByName = new Map<string, Stripe.Product[]>();

	for (const product of allProducts) {
		const name = product.name.trim();
		if (!productsByName.has(name)) {
			productsByName.set(name, []);
		}
		productsByName.get(name)?.push(product);
	}

	// Find duplicates (products with same name)
	const duplicates: DuplicateGroup[] = [];

	for (const [name, products] of productsByName.entries()) {
		if (products.length > 1) {
			duplicates.push({
				name,
				products: products.map((p) => ({
					id: p.id,
					name: p.name,
					hasPrice: !!p.default_price,
					hasImage: (p.images?.length || 0) > 0,
					category: p.metadata.category || "none",
					created: p.created,
					slug: p.metadata.slug,
				})),
			});
		}
	}

	console.log("=".repeat(80));
	console.log("📊 DUPLICATE ANALYSIS");
	console.log("=".repeat(80));
	console.log(`\n🔍 Found ${duplicates.length} product names with duplicates`);
	console.log(`📦 Total duplicate products: ${duplicates.reduce((sum, d) => sum + d.products.length, 0)}`);
	console.log(`💾 Products to keep: ${duplicates.length}`);
	console.log(`🗑️  Products to delete: ${duplicates.reduce((sum, d) => sum + d.products.length - 1, 0)}`);

	if (duplicates.length === 0) {
		console.log("\n✅ No duplicates found! All products are unique.\n");
		return;
	}

	console.log("\n" + "=".repeat(80));
	console.log("🔍 DUPLICATE GROUPS (showing first 20):");
	console.log("=".repeat(80));

	for (let i = 0; i < Math.min(20, duplicates.length); i++) {
		const dup = duplicates[i];
		if (!dup) continue;

		console.log(`\n${i + 1}. "${dup.name}" (${dup.products.length} copies)`);

		// Sort: prefer products with both price and image, then older products
		const sorted = [...dup.products].sort((a, b) => {
			// First priority: has both price and image
			const aComplete = (a.hasPrice ? 1 : 0) + (a.hasImage ? 1 : 0);
			const bComplete = (b.hasPrice ? 1 : 0) + (b.hasImage ? 1 : 0);
			if (aComplete !== bComplete) return bComplete - aComplete;

			// Second priority: older (lower created timestamp)
			return a.created - b.created;
		});

		sorted.forEach((p, idx) => {
			const badge = idx === 0 ? "✅ KEEP" : "❌ DELETE";
			const price = p.hasPrice ? "💰" : "  ";
			const image = p.hasImage ? "🖼️ " : "  ";
			const age = new Date(p.created * 1000).toISOString().split("T")[0];
			console.log(`   ${badge} ${price}${image} [${p.category.padEnd(15)}] ${p.id} (${age})`);
		});
	}

	if (duplicates.length > 20) {
		console.log(`\n... and ${duplicates.length - 20} more duplicate groups`);
	}

	// Summary by category
	console.log("\n" + "=".repeat(80));
	console.log("📊 DUPLICATES BY CATEGORY:");
	console.log("=".repeat(80));

	const categoryDuplicates = new Map<string, number>();
	for (const dup of duplicates) {
		for (const prod of dup.products) {
			const cat = prod.category || "none";
			categoryDuplicates.set(cat, (categoryDuplicates.get(cat) || 0) + 1);
		}
	}

	Array.from(categoryDuplicates.entries())
		.sort(([, a], [, b]) => b - a)
		.forEach(([category, count]) => {
			console.log(`  ${category.padEnd(20)} ${count} duplicate products`);
		});

	console.log("\n" + "=".repeat(80));
	console.log("\n💡 Recommendation:");
	console.log("   - Keep: Products with price + image (preferably older ones)");
	console.log("   - Delete: Duplicates without complete data");
	console.log("\n⚠️  Use 'remove-duplicates.ts' to safely clean up duplicates\n");

	// Export duplicate list for removal script
	const duplicateIds = duplicates.flatMap((dup) => {
		// Sort to keep best product
		const sorted = [...dup.products].sort((a, b) => {
			const aComplete = (a.hasPrice ? 1 : 0) + (a.hasImage ? 1 : 0);
			const bComplete = (b.hasPrice ? 1 : 0) + (b.hasImage ? 1 : 0);
			if (aComplete !== bComplete) return bComplete - aComplete;
			return a.created - b.created;
		});

		// Return IDs to delete (all except first)
		return sorted.slice(1).map((p) => p.id);
	});

	console.log(`\n📝 Total products to delete: ${duplicateIds.length}`);
	console.log(`📝 Total unique products after cleanup: ${allProducts.length - duplicateIds.length}\n`);
}

main().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
