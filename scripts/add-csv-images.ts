#!/usr/bin/env tsx

/**
 * Add Images from CSV to Stripe Products
 *
 * Checks the 22 products that have image URLs in CSV and adds them to Stripe
 */

import fs from "fs";
import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

const CSV_FILE = "./products_Oct-10_05-30-12PM.csv";

interface ProductWithImage {
	name: string;
	sku: string;
	imageUrl: string;
}

function parseCSV(): ProductWithImage[] {
	const content = fs.readFileSync(CSV_FILE, "utf-8");
	const lines = content.split("\n");

	const productsWithImages: ProductWithImage[] = [];

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i];
		if (!line || line.trim() === "") continue;

		// Split by comma, but be careful with commas in quoted fields
		const match = line.match(/,([^,]+),([^,]+),"([^"]+)","[^"]+",([^,]+),(.+)/);

		if (!match) continue;

		const _productUrl = match[2];
		const name = match[3];
		const sku = match[4];
		const imageUrl = match[5]?.trim();

		// Only add if has valid image URL
		if (imageUrl?.startsWith("http")) {
			productsWithImages.push({
				name: name?.trim() || "",
				sku: sku?.trim() || "",
				imageUrl,
			});
		}
	}

	return productsWithImages;
}

async function main() {
	console.log("🔍 Parsing CSV file for products with images...\n");

	const csvProducts = parseCSV();
	console.log(`✅ Found ${csvProducts.length} products with images in CSV\n`);

	if (csvProducts.length === 0) {
		console.log("⚠️  No products with images found in CSV\n");
		return;
	}

	console.log("📷 Products with images in CSV:");
	csvProducts.forEach((p, i) => {
		console.log(`${(i + 1).toString().padStart(2)}. ${p.name.substring(0, 60)}`);
	});

	console.log("\n🔍 Fetching all active products from Stripe...\n");

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

	// Match CSV products with Stripe products
	const updates: Array<{ product: Stripe.Product; imageUrl: string; hasCurrentImage: boolean }> = [];

	for (const csvProduct of csvProducts) {
		// Clean names for comparison
		const csvNameClean = csvProduct.name
			.toLowerCase()
			.replace(/[^\w\s]/g, "")
			.replace(/\s+/g, " ")
			.trim();

		// Try to find matching Stripe product
		for (const stripeProduct of allProducts) {
			const stripeNameClean = stripeProduct.name
				.toLowerCase()
				.replace(/[^\w\s]/g, "")
				.replace(/\s+/g, " ")
				.trim();

			// Check for name match (exact or very close)
			if (
				stripeNameClean === csvNameClean ||
				stripeNameClean.includes(csvNameClean.substring(0, 40)) ||
				csvNameClean.includes(stripeNameClean.substring(0, 40))
			) {
				const hasImage = stripeProduct.images && stripeProduct.images.length > 0;
				const imageUrlsMatch = hasImage && stripeProduct.images.includes(csvProduct.imageUrl);

				// Only add if doesn't have the correct image
				if (!imageUrlsMatch) {
					updates.push({
						product: stripeProduct,
						imageUrl: csvProduct.imageUrl,
						hasCurrentImage: hasImage,
					});
				}
				break;
			}
		}
	}

	console.log("=".repeat(80));
	console.log("📊 IMAGE UPDATE PLAN");
	console.log("=".repeat(80));
	console.log(`\n📷 Products to update: ${updates.length}`);
	console.log(`✅ Products already correct: ${csvProducts.length - updates.length}`);

	if (updates.length === 0) {
		console.log("\n✅ All products already have correct images!\n");
		return;
	}

	console.log("\n" + "=".repeat(80));
	console.log("📷 PRODUCTS TO UPDATE:");
	console.log("=".repeat(80));

	updates.forEach((item, index) => {
		const status = item.hasCurrentImage ? "🔄 REPLACE" : "➕ ADD NEW";
		console.log(`\n${(index + 1).toString().padStart(2)}. ${status}`);
		console.log(`    Product: ${item.product.name}`);
		console.log(`    ID: ${item.product.id}`);
		console.log(`    New Image: ${item.imageUrl}`);
		if (item.hasCurrentImage) {
			console.log(`    Current: ${item.product.images?.[0]?.substring(0, 60)}...`);
		}
	});

	console.log("\n⚠️  This will update " + updates.length + " products with images from CSV");
	console.log("⚠️  Press Ctrl+C to cancel or wait 5 seconds to continue...\n");
	await new Promise((resolve) => setTimeout(resolve, 5000));

	console.log("🚀 Adding/updating images...\n");

	let successCount = 0;
	let errorCount = 0;

	for (const item of updates) {
		try {
			await stripe.products.update(item.product.id, {
				images: [item.imageUrl],
			});

			const action = item.hasCurrentImage ? "Updated" : "Added";
			console.log(`✅ ${action} image: ${item.product.name.substring(0, 50)}`);
			successCount++;

			// Small delay to avoid rate limiting
			await new Promise((resolve) => setTimeout(resolve, 100));
		} catch (error) {
			console.error(`❌ Failed: ${item.product.name}:`, error);
			errorCount++;
		}
	}

	console.log("\n" + "=".repeat(80));
	console.log("📈 SUMMARY");
	console.log("=".repeat(80));
	console.log(`✅ Successfully updated: ${successCount} products`);
	console.log(`❌ Failed: ${errorCount} products`);
	console.log(`📦 Total processed: ${updates.length} products`);
	console.log(`\n🎉 All ${csvProducts.length} CSV products now have images in Stripe!`);
	console.log("\n✨ Image sync complete!\n");
}

main().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
