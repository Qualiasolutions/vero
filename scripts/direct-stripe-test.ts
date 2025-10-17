import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2024-11-20.acacia",
});

async function directStripeTest() {
	console.log("🔍 Testing direct Stripe API...");

	try {
		const products = await stripe.products.list({ limit: 5, active: true });
		console.log(`✅ Found ${products.data.length} products`);

		if (products.data.length > 0) {
			console.log("\n📋 Sample product:");
			const product = products.data[0];
			console.log(`- ID: ${product.id}`);
			console.log(`- Name: ${product.name}`);
			console.log(`- Active: ${product.active}`);

			// Get price for this product
			const prices = await stripe.prices.list({
				product: product.id,
				limit: 1,
				active: true,
			});

			if (prices.data.length > 0) {
				const price = prices.data[0];
				console.log(`- Price: €${(price.unit_amount || 0) / 100}`);
			}
		}
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

directStripeTest();