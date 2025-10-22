#!/usr/bin/env node

/**
 * Update Specific Products with Images
 *
 * This script updates a few key products with images to get the homepage working quickly
 */

import fs from "fs";

// Key products to update for homepage display
const priorityProducts = [
	{
		title: "GT Spirit Toyota Supra Fuji Edition White",
		productId: "prod_TFX0bZcx7mWoZW", // Replace with actual product ID
		imageUrl:
			"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760108044506-92Z462UX0YCT05QNWIUP/gt341-toyota-supra-gr-fuji-speedway-edition-01-2.jpg",
		slug: "gt-spirit-toyota-supra-fuji-edition-white",
	},
	{
		title: "KYOSHO Lamborghini Countach LP400 Red 1974",
		productId: "prod_TFX0mWeMnvpwzr", // Replace with actual product ID
		imageUrl:
			"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760107986378-G99ECY8DIPS0GIPKO964/Untitled%2Bdesign%2B%252817%2529.png",
		slug: "kyosho-lamborghini-countach-lp400-red-1974",
	},
	{
		title: "Premium Classixxs Volvo FH16 XL Red",
		productId: "prod_TFX0bZcx7mWoZW", // Replace with actual product ID
		imageUrl:
			"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760108046234-J37EDF2CASYKYU5HIMYY/Volvo%252BFH25%252BEvolution%252B500%252BHP%252BCab.png",
		slug: "premium-classixxs-volvo-fh16-xl-red",
	},
	{
		title: "AutoArt ALFA ROMEO 4C GLOSS BLACK",
		imageUrl:
			"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760107949807-9V46D2QFE9DE9PCBJN4H/Untitled%2Bdesign%2B%252822%2529.png",
		slug: "autoart-alfa-romeo-4c-gloss-black",
	},
	{
		title: "SOLIDO ASTON MARTIN DB5",
		imageUrl:
			"https://images.squarespace-cdn.com/content/v1/68d6a6c7ad50e42eaaa2008c/1760107955163-BL52Z0X7FW3Y70342O7O/aston-martin-db5-silver-birch-1964-01.jpg",
		slug: "solido-aston-martin-db5",
	},
];

console.log("\n🚀 Updating priority products with images...");

console.log("\n📋 Manual Update Instructions:");
console.log("=".repeat(50));

priorityProducts.forEach((product, index) => {
	console.log(`\n${index + 1}. ${product.title}`);
	console.log(`   Image: ${product.imageUrl}`);
	console.log(`   Slug: ${product.slug}`);

	if (product.productId) {
		console.log(`   Stripe Command:`);
		console.log(`   curl -X POST "https://api.stripe.com/v1/products/${product.productId}" \\`);
		console.log(`     -u "sk_test_YourStripeKey:" \\`);
		console.log(`     -d "images[0]=${product.imageUrl}"`);
	} else {
		console.log(`   ⚠️  Find product ID first, then update`);
	}
});

console.log("\n" + "=".repeat(50));
console.log("💡 Quick Instructions:");
console.log("1. Go to Stripe Dashboard → Products");
console.log("2. Search for each product by title");
console.log("3. Click Edit → Add image URL");
console.log("4. Save changes");
console.log("");
console.log("Alternative: Use the curl commands above with your Stripe secret key");

// Save priority products to file
fs.writeFileSync("/tmp/priority_products.json", JSON.stringify(priorityProducts, null, 2));
console.log("\n📁 Priority products saved to: /tmp/priority_products.json");
