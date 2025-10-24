#!/usr/bin/env node

/**
 * Sync Images from CSV to Stripe Products
 * Properly parses CSV and adds missing images to Stripe products
 */

import fs from "fs";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2025-08-27.basil",
});

const CSV_FILE = "./products_Oct-10_05-30-12PM.csv";

function parseCSVLine(line) {
	const result = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		const nextChar = line[i + 1];

		if (char === '"') {
			if (inQuotes && nextChar === '"') {
				current += '"';
				i++; // Skip next quote
			} else {
				inQuotes = !inQuotes;
			}
		} else if (char === "," && !inQuotes) {
			result.push(current);
			current = "";
		} else {
			current += char;
		}
	}
	result.push(current);
	return result;
}

function parseCSV() {
	const fileContent = fs.readFileSync(CSV_FILE, "utf-8");
	const lines = fileContent.split("\n");

	const productsWithImages = [];

	// Skip header (line 0)
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i];
		if (!line || line.trim() === "") continue;

		const columns = parseCSVLine(line);

		if (columns.length < 7) continue;

		const name = columns[3]?.trim() || "";
		const sku = columns[5]?.trim() || "";
		const imageUrl = columns[6]?.trim() || "";

		if (imageUrl?.startsWith("http")) {
			productsWithImages.push({
				name,
				sku,
				imageUrl,
			});
		}
	}

	return productsWithImages;
}

function cleanName(name) {
	return name
		.toLowerCase()
		.replace(/[^\w\s]/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

async function main() {
	console.log("🔍 Parsing CSV file...\n");
	const csvProducts = parseCSV();
	console.log(`✅ Found ${csvProducts.length} products with images in CSV\n`);

	if (csvProducts.length === 0) {
		console.log("⚠️  No products with images found in CSV\n");
		return;
	}

	console.log("🔍 Fetching all active products from Stripe...\n");

	// Fetch all active Stripe products
	const stripeProducts = [];
	let hasMore = true;
	let startingAfter;

	while (hasMore) {
		const response = await stripe.products.list({
			limit: 100,
			active: true,
			...(startingAfter && { starting_after: startingAfter }),
		});

		stripeProducts.push(...response.data);
		hasMore = response.has_more;
		if (response.data.length > 0) {
			startingAfter = response.data[response.data.length - 1].id;
		}
	}

	console.log(`✅ Found ${stripeProducts.length} active products in Stripe\n`);

	// Create name lookup dictionary for Stripe products
	const stripeLookup = new Map();
	for (const product of stripeProducts) {
		const cleaned = cleanName(product.name);
		stripeLookup.set(cleaned, product);
	}

	// Match CSV products with Stripe products
	const updates = [];

	for (const csvProduct of csvProducts) {
		const csvNameClean = cleanName(csvProduct.name);

		// Try exact match first
		let stripeProduct = stripeLookup.get(csvNameClean);

		if (!stripeProduct) {
			// Try partial match (first 40 chars)
			const csvNamePartial = csvNameClean.substring(0, 40);
			for (const [stripeNameClean, product] of stripeLookup.entries()) {
				if (
					csvNamePartial &&
					(stripeNameClean.includes(csvNamePartial) ||
						csvNameClean.includes(stripeNameClean.substring(0, 40)))
				) {
					stripeProduct = product;
					break;
				}
			}
		}

		if (stripeProduct) {
			const hasImage = stripeProduct.images && stripeProduct.images.length > 0;
			const hasCorrectImage = hasImage && stripeProduct.images.includes(csvProduct.imageUrl);

			if (!hasCorrectImage) {
				updates.push({
					product: stripeProduct,
					imageUrl: csvProduct.imageUrl,
					hasCurrentImage: hasImage,
				});
			}
		}
	}

	console.log("=".repeat(80));
	console.log("📊 IMAGE UPDATE PLAN");
	console.log("=".repeat(80));
	console.log(`\n📷 Products to update: ${updates.length}`);
	console.log(`✅ Already correct: ${csvProducts.length - updates.length}`);

	if (updates.length === 0) {
		console.log("\n✅ All products already have correct images!\n");
		return;
	}

	console.log("\n" + "=".repeat(80));
	console.log(`📷 PRODUCTS TO UPDATE (showing first 20):`);
	console.log("=".repeat(80));

	updates.slice(0, 20).forEach((item, i) => {
		const status = item.hasCurrentImage ? "🔄 REPLACE" : "➕ ADD NEW";
		console.log(`\n${(i + 1).toString().padStart(2)}. ${status}`);
		console.log(`    ${item.product.name.substring(0, 70)}`);
		console.log(`    ID: ${item.product.id}`);
		console.log(`    Image: ${item.imageUrl.substring(0, 70)}...`);
	});

	if (updates.length > 20) {
		console.log(`\n... and ${updates.length - 20} more products`);
	}

	console.log(`\n⚠️  This will update ${updates.length} products with images from CSV`);
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
			console.error(`❌ Failed: ${item.product.name}: ${error.message}`);
			errorCount++;
		}
	}

	console.log("\n" + "=".repeat(80));
	console.log("📈 SUMMARY");
	console.log("=".repeat(80));
	console.log(`✅ Successfully updated: ${successCount} products`);
	console.log(`❌ Failed: ${errorCount} products`);
	console.log(`📦 Total processed: ${updates.length} products`);
	console.log(`\n🎉 ${csvProducts.length} CSV products synced with Stripe!`);
	console.log("\n✨ Image sync complete!\n");
}

main().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
