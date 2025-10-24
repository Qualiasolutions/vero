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
	process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);
const CSV_FILE = "./products_cleaned.csv";

// Read CSV and create price mapping
const csvProducts = [];
fs.createReadStream(CSV_FILE)
	.pipe(csv())
	.on("data", (row) => {
		const sku = row.SKU?.trim();
		const price = row.Price?.trim();
		const title = row.Title?.trim();

		if (sku && price && title) {
			// Convert price to cents (EUR)
			const priceInCents = Math.round(parseFloat(price) * 100);
			csvProducts.push({ sku, price: priceInCents, title });
		}
	})
	.on("end", async () => {
		const stripeProducts = [];
		for await (const product of stripe.products.list({ limit: 100 })) {
			stripeProducts.push(product);
		}

		let _created = 0;
		let _updated = 0;
		let _skipped = 0;
		let _failed = 0;

		// Match and create/update prices
		for (const csvProduct of csvProducts) {
			const { sku, price, title } = csvProduct;

			// Find matching Stripe product by SKU in description or metadata
			const stripeProduct = stripeProducts.find(
				(p) =>
					p.description?.includes(sku) ||
					p.name?.includes(sku) ||
					p.description?.includes(`Car Model Code: ${sku}`) ||
					p.metadata?.sku === sku,
			);

			if (!stripeProduct) {
				_skipped++;
				continue;
			}

			try {
				// Check if product already has a price
				if (stripeProduct.default_price) {
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
						_updated++;
					} else {
						_skipped++;
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
					_created++;
				}

				// Rate limiting
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (_error) {
				_failed++;
			}
		}
	});
