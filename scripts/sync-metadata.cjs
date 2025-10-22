#!/usr/bin/env node

/**
 * Sync Metadata Script
 * Updates Stripe products with slug and category metadata from CSV
 */

const Stripe = require("stripe");
const fs = require("fs");
const csv = require("csv-parser");

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
	console.error("❌ Error: STRIPE_SECRET_KEY environment variable not set");
	process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);
const CSV_FILE = "./products_cleaned.csv";

console.log("======================================================================");
console.log("🚀 SYNCING STRIPE PRODUCT METADATA");
console.log("======================================================================\n");

// Read CSV and create mapping
const csvProducts = [];
fs.createReadStream(CSV_FILE)
	.pipe(csv())
	.on("data", (row) => {
		const sku = row.SKU?.trim();
		const slug = row["Product URL"]?.trim();
		const category = row["Product Page"]?.trim();
		const title = row.Title?.trim();

		if (sku && slug && title) {
			csvProducts.push({ sku, slug, category, title });
		}
	})
	.on("end", async () => {
		console.log(`📋 Loaded ${csvProducts.length} products from CSV\n`);

		// Fetch all Stripe products
		console.log("📥 Fetching products from Stripe...");
		const stripeProducts = [];
		for await (const product of stripe.products.list({ limit: 100 })) {
			stripeProducts.push(product);
		}
		console.log(`✅ Found ${stripeProducts.length} products in Stripe\n`);

		let updated = 0;
		let skipped = 0;
		let failed = 0;

		// Match and update products
		for (const csvProduct of csvProducts) {
			const { sku, slug, category, title } = csvProduct;

			console.log(`🔄 Processing: ${title}`);
			console.log(`   SKU: ${sku}`);
			console.log(`   Slug: ${slug}`);
			console.log(`   Category: ${category}`);

			// Find matching Stripe product by SKU in description or name
			const stripeProduct = stripeProducts.find(
				(p) =>
					p.description?.includes(sku) ||
					p.name?.includes(sku) ||
					p.description?.includes(`Car Model Code: ${sku}`),
			);

			if (!stripeProduct) {
				console.log(`   ⚠️  No matching Stripe product found\n`);
				skipped++;
				continue;
			}

			console.log(`   Found: ${stripeProduct.id}`);

			try {
				// Update metadata
				await stripe.products.update(stripeProduct.id, {
					metadata: {
						sku,
						slug,
						category,
					},
				});

				console.log(`   ✅ Updated metadata successfully\n`);
				updated++;

				// Rate limiting
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (error) {
				console.log(`   ❌ Failed: ${error.message}\n`);
				failed++;
			}
		}

		console.log("======================================================================");
		console.log("📊 UPDATE SUMMARY");
		console.log("======================================================================");
		console.log(`✅ Updated:  ${updated} products`);
		console.log(`❌ Failed:   ${failed} products`);
		console.log(`⏭️  Skipped:  ${skipped} products`);
		console.log("======================================================================\n");
		console.log("✨ Metadata sync complete!");
	});
