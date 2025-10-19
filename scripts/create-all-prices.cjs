#!/usr/bin/env node

/**
 * Create Prices Script
 * Creates EUR prices for all Stripe products based on CSV data
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
console.log("🚀 CREATING STRIPE PRODUCT PRICES");
console.log("======================================================================\n");

// Read CSV and create price mapping
const csvProducts = [];
fs.createReadStream(CSV_FILE)
	.pipe(csv())
	.on("data", (row) => {
		const sku = row["SKU"]?.trim();
		const price = row["Price"]?.trim();
		const title = row["Title"]?.trim();

		if (sku && price && title) {
			// Convert price to cents (EUR)
			const priceInCents = Math.round(parseFloat(price) * 100);
			csvProducts.push({ sku, price: priceInCents, title });
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

		let created = 0;
		let updated = 0;
		let skipped = 0;
		let failed = 0;

		// Match and create/update prices
		for (const csvProduct of csvProducts) {
			const { sku, price, title } = csvProduct;

			console.log(`🔄 Processing: ${title}`);
			console.log(`   SKU: ${sku}`);
			console.log(`   Price: €${(price / 100).toFixed(2)}`);

			// Find matching Stripe product by SKU in description or metadata
			const stripeProduct = stripeProducts.find(
				(p) =>
					p.description?.includes(sku) ||
					p.name?.includes(sku) ||
					p.description?.includes(`Car Model Code: ${sku}`) ||
					p.metadata?.sku === sku,
			);

			if (!stripeProduct) {
				console.log(`   ⚠️  No matching Stripe product found\n`);
				skipped++;
				continue;
			}

			console.log(`   Found: ${stripeProduct.id}`);

			try {
				// Check if product already has a price
				if (stripeProduct.default_price) {
					console.log(`   ℹ️  Product already has price: ${stripeProduct.default_price}`);

					// Update the existing price if needed
					const existingPrice = await stripe.prices.retrieve(stripeProduct.default_price);
					if (existingPrice.unit_amount !== price) {
						// Create new price and set as default
						const newPrice = await stripe.prices.create({
							product: stripeProduct.id,
							unit_amount: price,
							currency: "eur",
						});

						await stripe.products.update(stripeProduct.id, {
							default_price: newPrice.id,
						});

						console.log(`   ✅ Updated with new price: ${newPrice.id}\n`);
						updated++;
					} else {
						console.log(`   ✅ Price already correct\n`);
						skipped++;
					}
				} else {
					// Create new price
					const newPrice = await stripe.prices.create({
						product: stripeProduct.id,
						unit_amount: price,
						currency: "eur",
					});

					// Set as default price
					await stripe.products.update(stripeProduct.id, {
						default_price: newPrice.id,
					});

					console.log(`   ✅ Created new price: ${newPrice.id}\n`);
					created++;
				}

				// Rate limiting
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (error) {
				console.log(`   ❌ Failed: ${error.message}\n`);
				failed++;
			}
		}

		console.log("======================================================================");
		console.log("📊 PRICE CREATION SUMMARY");
		console.log("======================================================================");
		console.log(`✅ Created:  ${created} prices`);
		console.log(`🔄 Updated:  ${updated} prices`);
		console.log(`⏭️  Skipped:  ${skipped} products`);
		console.log(`❌ Failed:   ${failed} products`);
		console.log("======================================================================\n");
		console.log("✨ Price creation complete!");
	});
