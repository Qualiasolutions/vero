#!/usr/bin/env node

/**
 * CSV to JSON Converter Script
 *
 * Converts product CSV to JSON format for Stripe sync script
 * Usage: node scripts/csv-to-json.js <input-csv> <output-json>
 */

import fs from "fs";
import path from "path";

// Parse command line arguments
const args = process.argv.slice(2);
const csvPath = args[0] || "/home/qualiasolutions/Downloads/products_Oct-20_06-12-17PM.csv";
const jsonPath = args[1] || "/tmp/products_to_sync.json";

console.log("\n📂 Converting CSV to JSON...");
console.log(`Input:  ${csvPath}`);
console.log(`Output: ${jsonPath}`);

if (!fs.existsSync(csvPath)) {
	console.error(`❌ Error: CSV file not found: ${csvPath}`);
	process.exit(1);
}

// Read CSV file
const csvContent = fs.readFileSync(csvPath, "utf8");
const lines = csvContent.split("\n").filter((line) => line.trim());

// Parse CSV
const products = [];
const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

for (let i = 1; i < lines.length; i++) {
	const line = lines[i].trim();
	if (!line) continue;

	// Parse CSV line (handling quoted commas)
	const values = [];
	let current = "";
	let inQuotes = false;

	for (const char of line) {
		if (char === '"') {
			inQuotes = !inQuotes;
		} else if (char === "," && !inQuotes) {
			values.push(current.trim());
			current = "";
		} else {
			current += char;
		}
	}
	values.push(current.trim());

	const row = {};
	headers.forEach((header, index) => {
		row[header] = values[index] || "";
	});

	// Skip if no title
	if (!row.Title) continue;

	// Generate product data
	const product = {
		sku: `VM-${String(i).padStart(4, "0")}`, // Generate SKU
		title: row.Title.replace(/"/g, "").trim(),
		category: row["Product Page"] === "new-products" ? "collection" : "pre-order",
		slug: generateSlug(row.Title.replace(/"/g, "").trim()),
		description: row.Title.replace(/"/g, "").trim(), // Use title as description
		imageUrl: row["Hosted Image URLs"]?.trim() || null,
	};

	products.push(product);
}

console.log(`✅ Converted ${products.length} products`);

// Write JSON file
fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));
console.log(`✅ Saved to ${jsonPath}`);

function generateSlug(title) {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.substring(0, 50);
}
