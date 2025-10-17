import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2024-11-20.acacia",
});

async function updateCategoryImages() {
	console.log("🎨 Fetching product images from Stripe...\n");

	try {
		// Fetch all products
		const products = await stripe.products.list({ limit: 100, active: true });

		// Get one representative image from a product
		const getProductImage = (index: number) => {
			const product = products.data[index];
			if (product && product.images && product.images.length > 0) {
				return product.images[0];
			}
			return null;
		};

		// Map categories to product images
		const categoryImages = {
			"new-arrivals": getProductImage(0) || "",
			"on-sale": getProductImage(1) || "",
			"limited-edition": getProductImage(2) || "",
			rare: getProductImage(3) || "",
			"pre-order": getProductImage(4) || "",
			"coming-soon": getProductImage(5) || "",
		};

		console.log("📸 Category Images:\n");
		Object.entries(categoryImages).forEach(([slug, image]) => {
			console.log(`${slug}: ${image}`);
		});

		console.log("\n✅ Copy these URLs to update store.config.ts");
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

updateCategoryImages();
