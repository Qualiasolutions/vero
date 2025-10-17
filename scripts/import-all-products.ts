#!/usr/bin/env tsx

/**
 * Veromodels Complete Product Migration Script
 * Migrates ALL products from CSV to Stripe with smart category distribution
 */

import { config } from "dotenv";
import * as fs from "fs";
import Papa from "papaparse";
import * as path from "path";
import Stripe from "stripe";

// Load environment variables
config({ path: path.join(process.cwd(), ".env.local") });

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
	console.error("❌ Error: STRIPE_SECRET_KEY environment variable is not set!");
	process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2025-08-27.basil",
});

// Categories for distribution (excluding pre-order which is automatic)
const CATEGORIES = ["new-arrivals", "on-sale", "limited-edition", "rare", "coming-soon"];

interface CSVRow {
	"Product ID [Non Editable]": string;
	"Product Page": string;
	"Product URL": string;
	Title: string;
	Description: string;
	SKU: string;
	Price: string;
	"Sale Price": string;
	"On Sale": string;
	Tags: string;
	"Hosted Image URLs": string;
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
		"BRABUS",
		"RWB",
		"LB-WORKS",
	];

	for (const brand of brands) {
		if (title.toUpperCase().includes(brand.toUpperCase())) {
			return brand;
		}
	}

	return title.split(" ")[0] || "Unknown";
}

// Determine category based on product page and tags
function determineCategory(productPage: string, tags: string, index: number): string {
	// Pre-order products go to pre-order category
	if (productPage.includes("pre-order") || tags.toLowerCase().includes("preorder")) {
		return "pre-order";
	}

	// Distribute other products randomly across the 5 remaining categories
	return CATEGORIES[index % CATEGORIES.length];
}

async function importProducts() {
	console.log("🚀 Starting Complete Veromodels Product Import...\n");

	const csvPath = path.join(process.cwd(), "products_latest.csv");

	if (!fs.existsSync(csvPath)) {
		console.error("❌ Error: products_latest.csv not found!");
		process.exit(1);
	}

	const csvContent = fs.readFileSync(csvPath, "utf-8");

	// Parse CSV with Papa Parse (handles quoted multiline fields)
	const parsed = Papa.parse<CSVRow>(csvContent, {
		header: true,
		skipEmptyLines: true,
	});

	const products = parsed.data;
	console.log(`📊 Found ${products.length} products to import\n`);

	let successCount = 0;
	let errorCount = 0;
	let preorderCount = 0;
	let regularCount = 0;
	const errors: Array<{ sku: string; error: string }> = [];

	for (const [index, product] of products.entries()) {
		const {
			Title: title,
			Description: rawDescription,
			SKU: sku,
			Price: price,
			"Sale Price": salePrice,
			"On Sale": onSale,
			Tags: tags,
			"Hosted Image URLs": imageUrl,
			"Product Page": productPage,
			"Product URL": productUrl,
		} = product;

		if (!title || !sku || !price) {
			console.log(`⏭️  Skipping incomplete product (row ${index + 2})`);
			continue;
		}

		try {
			console.log(`[${index + 1}/${products.length}] Processing: ${title.substring(0, 60)}...`);

			const description = cleanDescription(rawDescription);
			const brand = extractBrand(title);
			const category = determineCategory(productPage, tags, regularCount);
			const isPreorder = category === "pre-order";

			if (isPreorder) {
				preorderCount++;
			} else {
				regularCount++;
			}

			const actualPrice = onSale === "Yes" && salePrice ? parseFloat(salePrice) : parseFloat(price);

			// Create Stripe Product
			const stripeProduct = await stripe.products.create({
				name: title,
				description: description.substring(0, 5000),
				images: imageUrl ? [imageUrl] : [],
				metadata: {
					slug: productUrl || sku.toLowerCase(),
					sku: sku,
					brand: brand,
					category: category,
					productPage: productPage,
					preorder: isPreorder ? "true" : "false",
					onSale: onSale === "Yes" ? "true" : "false",
					originalPrice: price,
				},
				active: true,
				shippable: true,
			});

			// Create Stripe Price in EUR
			await stripe.prices.create({
				product: stripeProduct.id,
				currency: "eur",
				unit_amount: Math.round(actualPrice * 100),
				metadata: {
					originalPrice: price,
					salePrice: salePrice || "",
				},
			});

			console.log(`✅ Created [${category}]: ${sku} - €${actualPrice.toFixed(2)}`);
			successCount++;

			// Rate limiting
			await new Promise((resolve) => setTimeout(resolve, 100));
		} catch (error: any) {
			console.error(`❌ Error creating product ${sku}:`, error.message);
			errorCount++;
			errors.push({ sku, error: error.message });
		}
	}

	// Summary
	console.log("\n" + "=".repeat(70));
	console.log("📈 IMPORT SUMMARY");
	console.log("=".repeat(70));
	console.log(`✅ Successfully imported: ${successCount} products`);
	console.log(`   📦 Pre-order products: ${preorderCount}`);
	console.log(`   🏎️  Regular products: ${regularCount} (distributed across 5 categories)`);
	console.log(`❌ Errors: ${errorCount} products`);
	console.log("=".repeat(70));

	if (errors.length > 0) {
		console.log("\n⚠️  ERRORS:");
		errors.forEach(({ sku, error }) => {
			console.log(`  - ${sku}: ${error}`);
		});
	}

	console.log("\n🎉 Import complete!");
	console.log("\n📝 Next steps:");
	console.log("1. Check Stripe Dashboard: https://dashboard.stripe.com/products");
	console.log("2. Redeploy site: vercel --prod");
	console.log("3. View live site with all products!");
}

// Run import
importProducts().catch((error) => {
	console.error("💥 Fatal error during import:", error);
	process.exit(1);
});
