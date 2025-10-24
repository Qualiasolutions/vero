#!/usr/bin/env tsx
/**
 * Check Stripe Products with Prices
 *
 * Verifies how many products have prices and are fully configured
 */

import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

async function main() {
	console.log("🔍 Fetching all products from Stripe...\n");

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

	// Check products with prices
	let withPrice = 0;
	let withoutPrice = 0;
	let withImages = 0;
	let withoutImages = 0;
	let fullyConfigured = 0;

	const productsWithoutPrice: string[] = [];
	const productsWithoutImages: string[] = [];

	for (const product of allProducts) {
		const hasDefaultPrice = !!product.default_price;
		const hasImages = product.images && product.images.length > 0;

		if (hasDefaultPrice) {
			withPrice++;
		} else {
			withoutPrice++;
			productsWithoutPrice.push(product.name);
		}

		if (hasImages) {
			withImages++;
		} else {
			withoutImages++;
			productsWithoutImages.push(product.name);
		}

		if (hasDefaultPrice && hasImages) {
			fullyConfigured++;
		}
	}

	console.log("=".repeat(70));
	console.log("📊 PRODUCT CONFIGURATION STATUS");
	console.log("=".repeat(70));
	console.log(`\n✅ Products with prices:        ${withPrice} / ${allProducts.length}`);
	console.log(`❌ Products without prices:    ${withoutPrice} / ${allProducts.length}`);
	console.log(`\n✅ Products with images:        ${withImages} / ${allProducts.length}`);
	console.log(`❌ Products without images:    ${withoutImages} / ${allProducts.length}`);
	console.log(`\n🎯 Fully configured products:  ${fullyConfigured} / ${allProducts.length}`);
	console.log(`   (with both price and images)`);

	if (productsWithoutPrice.length > 0) {
		console.log("\n" + "=".repeat(70));
		console.log("❌ PRODUCTS WITHOUT PRICES:");
		console.log("=".repeat(70));
		productsWithoutPrice.slice(0, 10).forEach((name, i) => {
			console.log(`${(i + 1).toString().padStart(2)}. ${name}`);
		});
		if (productsWithoutPrice.length > 10) {
			console.log(`... and ${productsWithoutPrice.length - 10} more`);
		}
	}

	if (productsWithoutImages.length > 0) {
		console.log("\n" + "=".repeat(70));
		console.log("❌ PRODUCTS WITHOUT IMAGES:");
		console.log("=".repeat(70));
		productsWithoutImages.slice(0, 10).forEach((name, i) => {
			console.log(`${(i + 1).toString().padStart(2)}. ${name}`);
		});
		if (productsWithoutImages.length > 10) {
			console.log(`... and ${productsWithoutImages.length - 10} more`);
		}
	}

	console.log("\n" + "=".repeat(70));
	console.log("\n⚠️  Note: Products without prices won't show on the website!");
	console.log("   Use the Stripe dashboard to add prices to missing products.\n");
}

main().catch((error) => {
	console.error("❌ Fatal error:", error);
	process.exit(1);
});
