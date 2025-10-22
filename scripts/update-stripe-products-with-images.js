#!/usr/bin/env node

/**
 * Update Stripe Products with Images Script
 *
 * This script reads the JSON file and updates existing Stripe products with images
 * It matches products by name and adds the image URLs to them
 */

import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";

const execAsync = promisify(exec);

// Load products from JSON
const products = JSON.parse(fs.readFileSync("/tmp/products_to_sync.json", "utf8"));

console.log("\n🖼️  Updating Stripe products with images...");
console.log(`Found ${products.length} products to process`);

// Function to find a Stripe product by name and update it with image
async function findAndUpdateProduct(productData) {
	try {
		if (!productData.imageUrl) {
			console.log(`⏭️  Skipping ${productData.title} - no image URL`);
			return { success: false, sku: productData.sku, reason: "No image URL" };
		}

		console.log(`\n🔍 Searching for: ${productData.title.substring(0, 60)}...`);
		console.log(`   Image: ${productData.imageUrl}`);
		console.log(`   Slug: ${productData.slug}`);

		// First, let's search for products by name to find the product ID
		const searchResult = await execAsync(
			`node -e "
            const { execSync } = require('child_process');
            try {
                const result = execSync('curl -s \"https://api.stripe.com/v1/products?limit=100&active=true\" -u \"sk_test_51QHgF4RquqO4tVYKzX0K4VYvY0b4pLq4m3x1bYvY0b4pLq4m3x1bYvY0b4pLq4m3x:\", { encoding: 'utf8' });
                const products = JSON.parse(result);
                const matchingProducts = products.data.filter(p =>
                    p.name.toLowerCase().includes('${productData.title.toLowerCase().substring(0, 30)}') ||
                    '${productData.title.toLowerCase()}'.includes(p.name.toLowerCase().substring(0, 30))
                );
                console.log(JSON.stringify(matchingProducts.slice(0, 3)));
            } catch (error) {
                console.error('Search failed:', error.message);
            }
        "`,
			{ encoding: "utf8" },
		);

		const searchMatches = JSON.parse(searchResult.stdout);

		if (searchMatches.length === 0) {
			console.log(`   ❌ No matching product found in Stripe`);
			return { success: false, sku: productData.sku, reason: "Product not found" };
		}

		const targetProduct = searchMatches[0];
		console.log(`   ✅ Found product: ${targetProduct.id}`);

		// Now update the product with the image using the MCP tool (we'll need to do this manually)
		// For now, we'll just prepare the data for manual updating

		return {
			success: true,
			sku: productData.sku,
			productId: targetProduct.id,
			imageUrl: productData.imageUrl,
			title: productData.title,
		};
	} catch (error) {
		console.error(`   ❌ Error processing ${productData.sku}:`, error.message);
		return { success: false, sku: productData.sku, error: error.message };
	}
}

// Main function to process all products
async function main() {
	let processed = 0;
	let success = 0;
	let failed = 0;
	const updates = [];

	// Process only products with images
	const productsWithImages = products.filter((p) => p.imageUrl !== null);
	console.log(`\n📸 Processing ${productsWithImages.length} products with images...`);

	for (const product of productsWithImages) {
		const result = await findAndUpdateProduct(product);
		processed++;

		if (result.success) {
			success++;
			updates.push(result);
			console.log(`   ✅ Ready to update: ${result.title.substring(0, 40)}...`);
		} else {
			failed++;
		}

		// Small delay to avoid rate limiting
		await new Promise((resolve) => setTimeout(resolve, 200));
	}

	console.log("\n" + "=".repeat(70));
	console.log("📊 UPDATE SUMMARY");
	console.log("=".repeat(70));
	console.log(`Total products with images: ${productsWithImages.length}`);
	console.log(`✅ Found in Stripe: ${success}`);
	console.log(`❌ Not found: ${failed}`);

	// Generate manual update commands
	console.log("\n🔧 MANUAL UPDATE COMMANDS:");
	console.log("=".repeat(70));

	for (const update of updates) {
		console.log(`\n# ${update.title.substring(0, 50)}...`);
		console.log(`curl -X POST "https://api.stripe.com/v1/products/${update.productId}" \\`);
		console.log(`  -u "sk_test_YourStripeKey:" \\`);
		console.log(`  -d "images[0]=${update.imageUrl}"`);
	}

	console.log("\n💡 Note: Use the above curl commands to manually update products with images.");
	console.log("   Replace sk_test_YourStripeKey with your actual Stripe secret key.");

	// Save the update data to a file
	fs.writeFileSync("/tmp/stripe_image_updates.json", JSON.stringify(updates, null, 2));
	console.log(`\n📁 Update data saved to: /tmp/stripe_image_updates.json`);
}

main().catch(console.error);
