#!/usr/bin/env tsx

/**
 * Veromodels Product Migration Script
 * Migrates products from CSV to Stripe Product Catalog
 *
 * Usage: npx tsx scripts/migrate-products-to-stripe.ts
 */

import { config } from "dotenv";
import * as fs from "fs";
import Papa from "papaparse";
import * as path from "path";
import Stripe from "stripe";

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), ".env.local") });

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
	console.error("❌ Error: STRIPE_SECRET_KEY environment variable is not set!");
	console.log("\nPlease make sure .env.local contains your Stripe secret key.");
	process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2025-08-27.basil",
});

interface ProductRow {
	"Product URL": string;
	Title: string;
	Price: string;
	"Product Page": string;
	"Hosted Image URLs": string;
}

// Parse CSV using papaparse (handles multi-line fields properly)
function parseCSV(content: string): ProductRow[] {
	const result = Papa.parse<ProductRow>(content, {
		header: true,
		skipEmptyLines: true,
		transformHeader: (header: string) => header.trim(),
	});

	if (result.errors.length > 0) {
		console.warn("⚠️  CSV parsing warnings:", result.errors.slice(0, 5));
	}

	return result.data;
}

// Extract brand from title
function extractBrand(title: string): string {
	const brands = [
		"AutoArt",
		"ALPINA",
		"SOLIDO",
		"GT Spirit",
		"OttO mobile",
		"Norev",
		"IXO",
		"PARAGON",
		"KK Scale",
		"MCG",
		"Almost Real",
		"Ottomobile",
		"KYOSHO",
		"Premium ClassiXXs",
		"Minichamps",
	];

	for (const brand of brands) {
		if (title.toUpperCase().includes(brand.toUpperCase())) {
			return brand;
		}
	}

	// Try to extract first word as brand
	const firstWord = title.split(" ")[0];
	return firstWord || "Unknown";
}

// Extract scale from description
function extractScale(description: string): string {
	const scaleMatch = description.match(/Scale:\s*(\d+:\d+)/i);
	return scaleMatch ? scaleMatch[1] : "1:18";
}

// Extract material from description
function extractMaterial(description: string): string {
	if (description.includes("Resin")) return "Resin";
	if (description.includes("Die-cast")) return "Die-cast";
	return "Mixed";
}

// Extract release date from tags
function extractReleaseDate(tags: string): string | undefined {
	const match = tags.match(/Release:\s*(\w+\s+\d{4})/i);
	return match ? match[1] : undefined;
}

// Clean HTML from description
function cleanDescription(desc: string): string {
	return desc
		.replace(/<pre><code>/g, "")
		.replace(/<\/code><\/pre>/g, "")
		.replace(/<br>/g, "\n")
		.replace(/&nbsp;/g, " ")
		.trim();
}

// Create slug from title
function createSlug(title: string, sku: string): string {
	return (title + "-" + sku)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

async function migrateProducts() {
	console.log("🚀 Starting Veromodels Product Migration to Stripe...\n");

	// Read CSV file
	const csvPath = path.join(process.cwd(), "products_cleaned.csv");

	if (!fs.existsSync(csvPath)) {
		console.error("❌ Error: products_cleaned.csv not found!");
		console.log("Please make sure products_cleaned.csv is in the root directory.");
		process.exit(1);
	}

	const csvContent = fs.readFileSync(csvPath, "utf-8");
	const products = parseCSV(csvContent);

	console.log(`📊 Found ${products.length} products to migrate\n`);

	let successCount = 0;
	let errorCount = 0;
	const errors: Array<{ sku: string; error: string }> = [];

	for (const [index, product] of products.entries()) {
		const {
			"Product URL": productUrl,
			Title: title,
			Price: price,
			"Product Page": productPage,
			"Hosted Image URLs": imageUrl,
		} = product;

		// Skip if missing essential fields
		if (!title || !productUrl || !price) {
			console.log(`⏭️  Skipping incomplete product (row ${index + 2}): missing title, URL, or price`);
			continue;
		}

		try {
			console.log(`[${index + 1}/${products.length}] Processing: ${title.substring(0, 60)}...`);

			const slug = productUrl || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
			const actualPrice = parseFloat(price);

			if (isNaN(actualPrice) || actualPrice <= 0) {
				console.log(`⏭️  Skipping product with invalid price: ${title}`);
				continue;
			}

			// Extract brand from title (first word or manufacturer name)
			const brand = extractBrand(title);

			// Determine if it's a pre-order based on product page
			const isPreorder = productPage?.toLowerCase().includes("pre-order") || false;

			// Create Stripe Product
			const stripeProduct = await stripe.products.create({
				name: title,
				description: `Premium diecast model: ${title}`,
				images: imageUrl ? [imageUrl.trim()] : [],
				metadata: {
					slug: slug,
					brand: brand,
					productPage: productPage || "collection",
					preorder: isPreorder ? "true" : "false",
				},
				active: true,
				shippable: true,
			});

			// Create Stripe Price in EUR
			await stripe.prices.create({
				product: stripeProduct.id,
				currency: "eur",
				unit_amount: Math.round(actualPrice * 100), // Convert to cents
			});

			console.log(`✅ Created: ${slug} - €${actualPrice.toFixed(2)}`);
			successCount++;

			// Rate limiting: wait a bit between requests
			await new Promise((resolve) => setTimeout(resolve, 150));
		} catch (error: any) {
			console.error(`❌ Error creating product "${title}":`, error.message);
			errorCount++;
			errors.push({ sku: productUrl || title, error: error.message });
		}
	}

	// Summary
	console.log("\n" + "=".repeat(60));
	console.log("📈 MIGRATION SUMMARY");
	console.log("=".repeat(60));
	console.log(`✅ Successfully migrated: ${successCount} products`);
	console.log(`❌ Errors: ${errorCount} products`);
	console.log("=".repeat(60));

	if (errors.length > 0) {
		console.log("\n⚠️  ERRORS:");
		errors.forEach(({ sku, error }) => {
			console.log(`  - ${sku}: ${error}`);
		});
	}

	console.log("\n🎉 Migration complete!");
	console.log("\n📝 Next steps:");
	console.log("1. Verify products in Stripe Dashboard: https://dashboard.stripe.com/products");
	console.log("2. Run the development server: npm run dev");
	console.log("3. Check your store at http://localhost:3000");
}

// Run migration
migrateProducts().catch((error) => {
	console.error("💥 Fatal error during migration:", error);
	process.exit(1);
});
