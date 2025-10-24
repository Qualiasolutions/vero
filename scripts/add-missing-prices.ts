#!/usr/bin/env tsx
/**
 * Add Missing Prices to Products
 *
 * This script adds default prices to all products that don't have one.
 * Uses category-based pricing for better organization.
 */

import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

// Pricing structure by category (in EUR cents)
const CATEGORY_PRICES: Record<string, number> = {
	"pre-order": 15000, // €150 - Pre-order items
	"new-arrivals": 18000, // €180 - New arrivals
	"on-sale": 12000, // €120 - Special price items
	"limited-edition": 22000, // €220 - Limited editions (premium)
	rare: 25000, // €250 - Rare models (highest price)
	"coming-soon": 16000, // €160 - Coming soon
	default: 15000, // €150 - Default fallback
};

function formatPrice(cents: number): string {
	return `€${(cents / 100).toFixed(2)}`;
}

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
			...(startingAfter && { starting_after: startingAfter }),
		});

		allProducts.push(...response.data);
		hasMore = response.has_more;
		if (response.data.length > 0) {
			startingAfter = response.data[response.data.length - 1]?.id;
		}
	}

	console.log(`✅ Found ${allProducts.length} total active products\n`);

	// Find products without prices
	const productsWithoutPrice = allProducts.filter((product) => !product.default_price);

	console.log(`💰 Found ${productsWithoutPrice.length} products without prices\n`);

	if (productsWithoutPrice.length === 0) {
		console.log("✅ All products already have prices!");
		return;
	}

	// Group by category
	const byCategory: Record<string, Stripe.Product[]> = {};

	for (const product of productsWithoutPrice) {
		const category = product.metadata.category || "default";
		if (!byCategory[category]) {
			byCategory[category] = [];
		}
		byCategory[category]?.push(product);
	}

	console.log("📊 Products without prices by category:");
	for (const [category, products] of Object.entries(byCategory)) {
		const price = CATEGORY_PRICES[category] || CATEGORY_PRICES.default;
		console.log(`  ${category}: ${products.length} products → ${formatPrice(price!)} each`);
	}

	console.log("\n⚠️  This will create prices for", productsWithoutPrice.length, "products");
	console.log("⚠️  Press Ctrl+C to cancel or wait 5 seconds to continue...\n");
	await new Promise((resolve) => setTimeout(resolve, 5000));

	console.log("🚀 Creating prices and updating products...\n");

	let successCount = 0;
	let errorCount = 0;

	for (const product of productsWithoutPrice) {
		try {
			const category = product.metadata.category || "default";
			const priceAmount = CATEGORY_PRICES[category] || CATEGORY_PRICES.default!;

			// Create price
			const price = await stripe.prices.create({
				product: product.id,
				currency: "eur",
				unit_amount: priceAmount,
				active: true,
			});

			// Update product to set this as default price
			await stripe.products.update(product.id, {
				default_price: price.id,
			});

			console.log(`✅ ${product.name} → ${formatPrice(priceAmount)} (${category})`);
			successCount++;

			// Rate limiting - small delay between requests
			await new Promise((resolve) => setTimeout(resolve, 100));
		} catch (error) {
			console.error(`❌ Failed to add price to ${product.name}:`, error);
			errorCount++;
		}
	}

	console.log("\n" + "=".repeat(70));
	console.log("📈 Summary:");
	console.log("=".repeat(70));
	console.log(`✅ Successfully added prices: ${successCount} products`);
	console.log(`❌ Failed: ${errorCount} products`);
	console.log(`💰 Total processed: ${productsWithoutPrice.length} products`);

	// Calculate total value added
	const totalValue = Object.entries(byCategory).reduce((sum, [category, products]) => {
		const price = CATEGORY_PRICES[category] || CATEGORY_PRICES.default!;
		return sum + price * products.length;
	}, 0);

	console.log(`\n💵 Total inventory value added: ${formatPrice(totalValue)}`);
	console.log("\n🎉 Price addition complete!\n");
	console.log("⚠️  Note: These are default prices. Update them in Stripe dashboard as needed.\n");
}

main().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
