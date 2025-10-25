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
	process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);
const CSV_FILE = "./products_cleaned.csv";

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
			csvProducts.push({ sku, slug, category });
		}
	})
	.on("end", async () => {
		const stripeProducts = [];
		for await (const product of stripe.products.list({ limit: 100 })) {
			stripeProducts.push(product);
		}

		let _updated = 0;
		let _skipped = 0;
		let _failed = 0;

		// Match and update products
		for (const csvProduct of csvProducts) {
			const { sku, slug, category } = csvProduct;

			// Find matching Stripe product by SKU in description or name
			const stripeProduct = stripeProducts.find(
				(p) =>
					p.description?.includes(sku) ||
					p.name?.includes(sku) ||
					p.description?.includes(`Car Model Code: ${sku}`),
			);

			if (!stripeProduct) {
				_skipped++;
				continue;
			}

			try {
				// Update metadata
				await stripe.products.update(stripeProduct.id, {
					metadata: {
						sku,
						slug,
						category,
					},
				});
				_updated++;

				// Rate limiting
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (_error) {
				_failed++;
			}
		}
	});
