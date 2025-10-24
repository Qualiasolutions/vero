#!/usr/bin/env node

/**
 * Minimal Metadata Fix Script
 *
 * Adds only the essential metadata (slug, category, sku) to existing Stripe products
 * without creating new products or complex operations
 */

import fs from "fs";
import Stripe from "stripe";

console.log("🔧 Minimal metadata fix for existing products...");

// Initialize Stripe with minimal config
const stripe = new Stripe(
	"$STRIPE_SECRET_KEY",
);

// Read product data
const products = JSON.parse(fs.readFileSync("/tmp/all_products.json", "utf8"));

// Function to find existing product by name
async function findProductByName(name) {
	try {
		const results = await stripe.products.search({
			query: `name:"${name}"`,
			limit: 1,
		});
		return results.data.length > 0 ? results.data[0] : null;
	} catch (error) {
		console.error(`Error searching for ${name}: ${error.message}`);
		return null;
	}
}

// Function to update product metadata
async function addEssentialMetadata(product, stripeProduct) {
	try {
		// Check if metadata already exists
		if (stripeProduct.metadata?.slug && stripeProduct.metadata?.category) {
			console.log(`✅ Already has metadata: ${product.title.substring(0, 30)}...`);
			return true;
		}

		// Add essential metadata only
		await stripe.products.update(stripeProduct.id, {
			metadata: {
				sku: product.sku,
				slug: product.slug,
				category: product.category,
			},
		});

		console.log(`✅ Added metadata: ${product.title.substring(0, 30)}... -> ${product.category}`);
		return true;
	} catch (error) {
		console.error(`❌ Failed to update ${product.title}: ${error.message}`);
		return false;
	}
}

// Main function
async function main() {
	console.log(`Processing ${products.length} products...`);

	let success = 0;
	let failed = 0;

	// Process only existing products (don't create new ones)
	for (const product of products) {
		// Process all products
		console.log(`\n🔄 ${product.sku}: ${product.title.substring(0, 40)}...`);

		const existingProduct = await findProductByName(product.title);

		if (existingProduct) {
			const result = await addEssentialMetadata(product, existingProduct);
			if (result) {
				success++;
			} else {
				failed++;
			}
		} else {
			console.log(`⚠️  Not found in Stripe: ${product.title.substring(0, 30)}...`);
		}

		// Small delay to avoid rate limits
		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	console.log(`\n📊 Results (all products):`);
	console.log(`✅ Success: ${success}`);
	console.log(`❌ Failed: ${failed}`);
}

main().catch((error) => {
	console.error("\n💥 Fatal error:", error.message);
	process.exit(1);
});
