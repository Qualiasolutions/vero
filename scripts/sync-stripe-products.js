#!/usr/bin/env node

/**
 * Stripe Product Sync Script
 *
 * This script syncs products from your CSV to Stripe with proper metadata.
 * It ensures all products have the required slug, category, and SKU metadata
 * that your Next.js website needs to display them.
 *
 * Usage:
 *   node scripts/sync-stripe-products.js [options]
 *
 * Options:
 *   --dry-run    Preview changes without making them
 *   --sku=<sku>  Sync only specific product by SKU
 *   --csv=<path> Use custom CSV file (default: products_Oct-10_05-30-12PM.csv)
 */

import fs from "fs";
import path from "path";
import Stripe from "stripe";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const specificSku = args.find((arg) => arg.startsWith("--sku="))?.split("=")[1];
const jsonPath = args.find((arg) => arg.startsWith("--json="))?.split("=")[1] || "/tmp/products_to_sync.json";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
	console.error("❌ Error: STRIPE_SECRET_KEY environment variable not set");
	console.error("   Please set it in your .env file or run with:");
	console.error("   STRIPE_SECRET_KEY=sk_test_... node scripts/sync-stripe-products.js");
	process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const STRIPE_CURRENCY = process.env.STRIPE_CURRENCY || "eur";

/**
 * Load products from JSON file
 */
function loadProducts(filePath) {
	console.log(`\n📂 Reading products: ${filePath}`);

	if (!fs.existsSync(filePath)) {
		throw new Error(`Products file not found: ${filePath}`);
	}

	const products = JSON.parse(fs.readFileSync(filePath, "utf8"));

	console.log(`✅ Loaded ${products.length} unique products`);
	return products;
}

/**
 * Find existing product in Stripe by SKU
 */
async function findProductBySku(sku) {
	try {
		const results = await stripe.products.search({
			query: `metadata['sku']:'${sku}'`,
			limit: 1,
		});

		return results.data.length > 0 ? results.data[0] : null;
	} catch (error) {
		console.error(`   Error searching for SKU ${sku}:`, error.message);
		return null;
	}
}

/**
 * Update product metadata
 */
async function updateProductMetadata(productId, metadata, productName) {
	if (isDryRun) {
		console.log(`   [DRY RUN] Would update metadata for ${productName}`);
		return;
	}

	await stripe.products.update(productId, { metadata });
	console.log(`   ✅ Updated metadata`);
}

/**
 * Create new product in Stripe
 */
async function createProduct(product) {
	if (isDryRun) {
		console.log(`   [DRY RUN] Would create product: ${product.title.substring(0, 50)}...`);
		return null;
	}

	const images = product.imageUrl ? [product.imageUrl] : [];

	const newProduct = await stripe.products.create({
		name: product.title,
		description: product.description,
		images: images,
		metadata: {
			sku: product.sku,
			slug: product.slug,
			category: product.category,
		},
	});

	console.log(`   ✅ Created product: ${newProduct.id}`);
	return newProduct;
}

/**
 * Create default price for product
 */
async function createDefaultPrice(productId, sku) {
	if (isDryRun) {
		console.log(`   [DRY RUN] Would create default price`);
		return null;
	}

	// Default price based on category
	const defaultAmount = 9999; // €99.99

	const price = await stripe.prices.create({
		product: productId,
		unit_amount: defaultAmount,
		currency: STRIPE_CURRENCY,
		metadata: {
			sku: sku,
		},
	});

	console.log(`   ✅ Created price: €${(defaultAmount / 100).toFixed(2)}`);
	return price;
}

/**
 * Sync a single product
 */
async function syncProduct(product) {
	console.log(`\n🔄 Processing: ${product.sku} - ${product.title.substring(0, 50)}...`);

	// Check if product exists
	const existing = await findProductBySku(product.sku);

	if (existing) {
		console.log(`   ℹ️  Found existing product: ${existing.id}`);

		// Check if metadata needs updating
		const needsUpdate =
			!existing.metadata.slug ||
			!existing.metadata.category ||
			existing.metadata.slug !== product.slug ||
			existing.metadata.category !== product.category;

		if (needsUpdate) {
			console.log(`   📝 Updating metadata...`);
			await updateProductMetadata(
				existing.id,
				{
					sku: product.sku,
					slug: product.slug,
					category: product.category,
				},
				product.title,
			);
		} else {
			console.log(`   ✅ Metadata already correct`);
		}

		// Check if it has a price
		const prices = await stripe.prices.list({ product: existing.id, limit: 1 });
		if (prices.data.length === 0) {
			console.log(`   💰 No price found, creating default...`);
			await createDefaultPrice(existing.id, product.sku);
		}

		return { status: "updated", productId: existing.id };
	} else {
		// Product doesn't exist, create it
		console.log(`   🆕 Product not found in Stripe, creating...`);

		if (!product.imageUrl && product.category === "pre-order") {
			console.log(`   ⚠️  Warning: No image URL for preorder product`);
		}

		const newProduct = await createProduct(product);

		if (newProduct) {
			await createDefaultPrice(newProduct.id, product.sku);
		}

		return { status: "created", productId: newProduct?.id };
	}
}

/**
 * Main sync function
 */
async function main() {
	console.log("\n" + "=".repeat(70));
	console.log("🚀 STRIPE PRODUCT SYNC");
	console.log("=".repeat(70));

	if (isDryRun) {
		console.log("⚠️  DRY RUN MODE - No changes will be made");
	}

	if (specificSku) {
		console.log(`🎯 Syncing only SKU: ${specificSku}`);
	}

	// Load products
	let products = loadProducts(jsonPath);

	// Filter by specific SKU if requested
	if (specificSku) {
		products = products.filter((p) => p.sku === specificSku);
		if (products.length === 0) {
			console.error(`❌ SKU ${specificSku} not found in CSV`);
			process.exit(1);
		}
	}

	// Track statistics
	const stats = {
		total: products.length,
		updated: 0,
		created: 0,
		failed: 0,
		skipped: 0,
	};

	// Sync each product
	for (const product of products) {
		try {
			const result = await syncProduct(product);

			if (result.status === "updated") {
				stats.updated++;
			} else if (result.status === "created") {
				stats.created++;
			}
		} catch (error) {
			console.error(`   ❌ Failed: ${error.message}`);
			stats.failed++;
		}

		// Rate limiting: wait 100ms between requests
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	// Print summary
	console.log("\n" + "=".repeat(70));
	console.log("📊 SYNC SUMMARY");
	console.log("=".repeat(70));
	console.log(`Total products:    ${stats.total}`);
	console.log(`✅ Updated:        ${stats.updated}`);
	console.log(`🆕 Created:        ${stats.created}`);
	console.log(`❌ Failed:         ${stats.failed}`);
	console.log(`⏭️  Skipped:        ${stats.skipped}`);
	console.log("=".repeat(70));

	if (isDryRun) {
		console.log("\n💡 This was a dry run. Run without --dry-run to apply changes.");
	} else {
		console.log("\n✨ Sync complete! Your products should now appear on the website.");
		console.log("   If they don't appear immediately, try:");
		console.log("   1. Clearing your browser cache");
		console.log("   2. Restarting your Next.js dev server");
		console.log("   3. Checking the Stripe Dashboard to verify metadata");
	}

	console.log("\n");
}

// Run the script
main().catch((error) => {
	console.error("\n❌ Fatal error:", error.message);
	process.exit(1);
});
