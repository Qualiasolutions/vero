#!/usr/bin/env tsx

/**
 * Add Missing Images to Products
 *
 * Reads CSV file and adds missing images to Stripe products
 */

import fs from "fs";
import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

// CSV file path
const CSV_FILE = "./products_Oct-10_05-30-12PM.csv";

interface ProductImageMapping {
	sku: string;
	name: string;
	imageUrl: string;
}

async function parseCSV(): Promise<ProductImageMapping[]> {
	const content = fs.readFileSync(CSV_FILE, "utf-8");
	const lines = content.split("\n");

	const mappings: ProductImageMapping[] = [];

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i];
		if (!line || line.trim() === "") continue;

		// CSV columns: ,Product Page,Product URL,Title,Description,SKU,Hosted Image URLs
		const columns = line.split(",");

		if (columns.length < 7) continue;

		const title = columns[3]?.trim() || "";
		const sku = columns[5]?.trim() || "";
		const imageUrl = columns[6]?.trim() || "";

		// Only add if has image URL
		if (imageUrl?.startsWith("http")) {
			mappings.push({
				sku,
				name: title,
				imageUrl,
			});
		}
	}

	return mappings;
}

async function main() {
	console.log("🔍 Parsing CSV file...\n");

	const imageMappings = await parseCSV();
	console.log(`✅ Found ${imageMappings.length} products with images in CSV\n`);

	console.log("🔍 Fetching all active products from Stripe...\n");

	// Fetch all active products
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

	console.log(`✅ Found ${allProducts.length} active products in Stripe\n`);

	// Find products without images
	const productsWithoutImages = allProducts.filter((p) => !p.images || p.images.length === 0);

	console.log(`📷 Found ${productsWithoutImages.length} products without images\n`);

	if (productsWithoutImages.length === 0) {
		console.log("✅ All products already have images!\n");
		return;
	}

	// Match products with CSV by name similarity
	const updates: Array<{ product: Stripe.Product; imageUrl: string; matchType: string }> = [];

	for (const product of productsWithoutImages) {
		// Try to match by name (fuzzy match - remove special chars and compare)
		const productNameClean = product.name
			.toLowerCase()
			.replace(/[^\w\s]/g, "")
			.replace(/\s+/g, " ")
			.trim();

		for (const mapping of imageMappings) {
			const mappingNameClean = mapping.name
				.toLowerCase()
				.replace(/[^\w\s]/g, "")
				.replace(/\s+/g, " ")
				.trim();

			// Exact match or contains match
			if (
				productNameClean === mappingNameClean ||
				productNameClean.includes(mappingNameClean.substring(0, 30))
			) {
				updates.push({
					product,
					imageUrl: mapping.imageUrl,
					matchType: "name",
				});
				break;
			}
		}
	}

	console.log("=".repeat(80));
	console.log("📊 IMAGE UPDATE PLAN");
	console.log("=".repeat(80));
	console.log(`\n📷 Images to add: ${updates.length} products`);
	console.log(`❌ Unable to match: ${productsWithoutImages.length - updates.length} products`);

	if (updates.length === 0) {
		console.log("\n⚠️  Could not match any products with images from CSV.\n");
		return;
	}

	console.log("\n" + "=".repeat(80));
	console.log("📷 PRODUCTS TO UPDATE (first 15):");
	console.log("=".repeat(80));

	updates.slice(0, 15).forEach((item, index) => {
		console.log(`${(index + 1).toString().padStart(2)}. ${item.product.name.substring(0, 60)}...`);
		console.log(`    Image: ${item.imageUrl}`);
	});

	if (updates.length > 15) {
		console.log(`... and ${updates.length - 15} more products`);
	}

	console.log("\n⚠️  Press Ctrl+C to cancel or wait 5 seconds to continue...\n");
	await new Promise((resolve) => setTimeout(resolve, 5000));

	console.log("🚀 Adding images to products...\n");

	let successCount = 0;
	let errorCount = 0;

	for (const item of updates) {
		try {
			await stripe.products.update(item.product.id, {
				images: [item.imageUrl],
			});

			console.log(`✅ Added image: ${item.product.name.substring(0, 50)}`);
			successCount++;

			// Small delay to avoid rate limiting
			await new Promise((resolve) => setTimeout(resolve, 100));
		} catch (error) {
			console.error(`❌ Failed to add image to ${item.product.name}:`, error);
			errorCount++;
		}
	}

	console.log("\n" + "=".repeat(80));
	console.log("📈 SUMMARY");
	console.log("=".repeat(80));
	console.log(`✅ Successfully added images: ${successCount} products`);
	console.log(`❌ Failed: ${errorCount} products`);
	console.log(`📦 Total processed: ${updates.length} products`);
	console.log(
		`\n🎉 Products with images: ${allProducts.length - productsWithoutImages.length + successCount} / ${allProducts.length}`,
	);
	console.log("\n✨ Image addition complete!\n");
}

main().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
