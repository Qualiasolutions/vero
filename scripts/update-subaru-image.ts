import { config } from "dotenv";
import { resolve } from "path";
import Stripe from "stripe";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

async function updateSubaruImage() {
	console.log("🔍 Searching for SOLIDO SUBARU IMPREZA 22B SONIC BLUE 1998...\n");

	try {
		// Fetch all products to find the Subaru
		const products = await stripe.products.list({
			limit: 100,
			active: true,
		});

		// Find the Subaru product
		const subaruProduct = products.data.find(
			(p) =>
				p.name.toUpperCase().includes("SUBARU IMPREZA 22B") && p.name.toUpperCase().includes("SONIC BLUE"),
		);

		if (!subaruProduct) {
			console.log("❌ SOLIDO SUBARU IMPREZA 22B SONIC BLUE 1998 not found");
			return;
		}

		console.log(`✅ Found: ${subaruProduct.name}`);
		console.log(`   Product ID: ${subaruProduct.id}`);
		console.log(`   Current Image: ${subaruProduct.images[0] || "None"}`);

		const newImageUrl = "https://i.ibb.co/23KhMkFY/Generated-Image-October-26-2025-2-00-AM.png";

		console.log(`\n📸 Updating with new image:`);
		console.log(`   ${newImageUrl}`);

		// Update the product with new image
		await stripe.products.update(subaruProduct.id, {
			images: [newImageUrl],
		});

		console.log(`\n✅ Successfully updated SOLIDO SUBARU IMPREZA 22B SONIC BLUE 1998!`);
		console.log(`   New image: ${newImageUrl}`);
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

updateSubaruImage();
