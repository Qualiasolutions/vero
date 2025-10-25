import { config } from "dotenv";
import { resolve } from "path";
import Stripe from "stripe";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

async function updateSupraImage() {
	console.log("🔍 Searching for Ottomobile Toyota Supra 3000 GT TRD Red...\n");

	try {
		// Fetch all products to find the Supra
		const products = await stripe.products.list({
			limit: 100,
			active: true,
		});

		// Find the Supra product
		const supraProduct = products.data.find(
			(p) =>
				(p.name.toUpperCase().includes("TOYOTA SUPRA") && p.name.toUpperCase().includes("3000 GT TRD")) ||
				(p.name.toUpperCase().includes("SUPRA") &&
					p.name.toUpperCase().includes("TRD") &&
					p.name.toUpperCase().includes("RED")),
		);

		if (!supraProduct) {
			console.log("❌ Ottomobile Toyota Supra 3000 GT TRD Red not found");
			console.log("Available Supra products:");
			const supraProducts = products.data.filter((p) => p.name.toUpperCase().includes("SUPRA"));
			supraProducts.forEach((p) => console.log(`   - ${p.name}`));
			return;
		}

		console.log(`✅ Found: ${supraProduct.name}`);
		console.log(`   Product ID: ${supraProduct.id}`);
		console.log(`   Current Image: ${supraProduct.images[0] || "None"}`);

		const newImageUrl = "https://i.ibb.co/rf4mWMtY/Generated-Image-October-26-2025-2-09-AM-2.png";

		console.log(`\n📸 Updating with new image:`);
		console.log(`   ${newImageUrl}`);

		// Update the product with new image
		await stripe.products.update(supraProduct.id, {
			images: [newImageUrl],
		});

		console.log(`\n✅ Successfully updated Ottomobile Toyota Supra 3000 GT TRD Red!`);
		console.log(`   New image: ${newImageUrl}`);
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

updateSupraImage();
