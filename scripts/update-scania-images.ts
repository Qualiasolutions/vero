import { config } from "dotenv";
import { resolve } from "path";
import Stripe from "stripe";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

async function updateScaniaImages() {
	console.log("🔍 Searching for Premium Classixxs Scania R500 GOLD MET...\n");

	try {
		// Fetch all products to find the Scania
		const products = await stripe.products.list({
			limit: 100,
			active: true,
		});

		// Find the Scania product
		const scaniaProduct = products.data.find((p) => p.name.toUpperCase().includes("SCANIA R500 GOLD"));

		if (!scaniaProduct) {
			console.log("❌ Premium Classixxs Scania R500 GOLD MET not found");
			return;
		}

		console.log(`✅ Found: ${scaniaProduct.name}`);
		console.log(`   Product ID: ${scaniaProduct.id}`);
		console.log(`   Current Images: ${scaniaProduct.images.length} image(s)`);
		if (scaniaProduct.images.length > 0) {
			scaniaProduct.images.forEach((img, index) => {
				console.log(`     ${index + 1}. ${img}`);
			});
		}

		// New images array with main and second image
		const newImages = [
			"https://i.ibb.co/PZsKp1BZ/Generated-Image-October-26-2025-1-51-AM.png", // Main image
			"https://i.ibb.co/chfPsw0K/Generated-Image-October-26-2025-1-50-AM-1.png", // Second image
		];

		console.log(`\n📸 Updating with new images:`);
		newImages.forEach((img, index) => {
			console.log(`   ${index + 1}. ${img}`);
		});

		// Update the product with new images
		await stripe.products.update(scaniaProduct.id, {
			images: newImages,
		});

		console.log(`\n✅ Successfully updated Premium Classixxs Scania R500 GOLD MET images!`);
		console.log(`   Main image: ${newImages[0]}`);
		console.log(`   Second image: ${newImages[1]}`);
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

updateScaniaImages();
