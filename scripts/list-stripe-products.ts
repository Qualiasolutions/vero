import { config } from "dotenv";
import { resolve } from "path";
import Stripe from "stripe";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

async function listProducts() {
	console.log("🔍 Fetching products from Stripe...\n");

	try {
		const products = await stripe.products.list({
			limit: 10,
			active: true,
		});

		console.log(`Found ${products.data.length} products\n`);

		for (const product of products.data) {
			console.log("=".repeat(60));
			console.log(`Product: ${product.name}`);
			console.log(`ID: ${product.id}`);
			console.log(`Metadata:`, JSON.stringify(product.metadata, null, 2));
			console.log(`Current Images:`, product.images);
			console.log();
		}
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

listProducts();
