import { config } from "dotenv";
import { resolve } from "path";
import Stripe from "stripe";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

// Product search terms and their new image URLs
const productUpdates: Array<{ search: string; imageUrl: string; description: string }> = [
	{
		search: "ALFA ROMEO 4C",
		imageUrl: "https://i.ibb.co/xqtHG8Sn/Generated-Image-October-25-2025-6-11-PM-1.png",
		description: "AutoArt ALFA ROMEO 4C GLOSS BLACK",
	},
	{
		search: "BMW X4 XDRIVE",
		imageUrl: "https://i.ibb.co/YFY9h6Xb/Generated-Image-October-25-2025-6-10-PM.png",
		description: "PARAGON MODELS BMW X4 XDRIVE 3.5d F83 2014",
	},
	{
		search: "TOYOTA CALICA",
		imageUrl: "https://i.ibb.co/B5bPMz0L/Generated-Image-October-25-2025-6-08-PM.png",
		description: "IXO TOYOTA CALICA GT-FOUR",
	},
	{
		search: "LAMBORGHINI COUNTACH LP400",
		imageUrl: "https://i.ibb.co/8pt0wY6/Generated-Image-October-25-2025-6-06-PM-1.png",
		description: "KYOSHO Lamborghini Countach LP400 Red 1974",
	},
	{
		search: "MAN TGX XXL",
		imageUrl: "https://i.ibb.co/JRW1VSKs/Generated-Image-October-25-2025-6-03-PM.png",
		description: "Premium Classixxs MAN TGX XXL Blue Metallic",
	},
];

async function searchAndUpdateProducts() {
	console.log("🔍 Searching for products in Stripe...\n");

	try {
		// Fetch all products
		const products = await stripe.products.list({
			limit: 100,
			active: true,
		});

		let updatedCount = 0;
		const results: Array<{ description: string; success: boolean; productName?: string; error?: string }> =
			[];

		for (const update of productUpdates) {
			console.log(`🔎 Searching for: ${update.description}`);

			// Find product by searching in name
			const matchedProduct = products.data.find((p) =>
				p.name.toUpperCase().includes(update.search.toUpperCase()),
			);

			if (!matchedProduct) {
				console.log(`   ⚠️  Product not found\n`);
				results.push({
					description: update.description,
					success: false,
					error: "Product not found",
				});
				continue;
			}

			console.log(`   ✓ Found: ${matchedProduct.name}`);
			console.log(`   Product ID: ${matchedProduct.id}`);
			console.log(`   Current Image: ${matchedProduct.images[0] || "None"}`);

			try {
				// Update product with new image
				await stripe.products.update(matchedProduct.id, {
					images: [update.imageUrl],
				});

				console.log(`   ✅ Successfully updated image`);
				console.log(`   New Image: ${update.imageUrl}\n`);
				updatedCount++;
				results.push({
					description: update.description,
					success: true,
					productName: matchedProduct.name,
				});
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				console.error(`   ❌ Failed to update: ${errorMessage}\n`);
				results.push({
					description: update.description,
					success: false,
					productName: matchedProduct.name,
					error: errorMessage,
				});
			}
		}

		console.log("=".repeat(70));
		console.log(`\n📊 Summary:`);
		console.log(`   Total products to update: ${productUpdates.length}`);
		console.log(`   Successfully updated: ${updatedCount}`);
		console.log(`   Failed: ${results.filter((r) => !r.success).length}\n`);

		// Show detailed results
		console.log("Detailed Results:");
		for (const result of results) {
			if (result.success) {
				console.log(`   ✅ ${result.description}`);
				console.log(`      → ${result.productName}`);
			} else {
				console.log(`   ❌ ${result.description}: ${result.error}`);
			}
		}
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

searchAndUpdateProducts();
