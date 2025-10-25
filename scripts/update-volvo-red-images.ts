import { config } from "dotenv";
import { resolve } from "path";
import Stripe from "stripe";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

async function updateVolvoRedImages() {
	console.log("🔍 Searching for Premium Classixxs Volvo FH16 XL Red...\n");

	try {
		// Fetch all products to find the Volvo
		const products = await stripe.products.list({
			limit: 100,
			active: true,
		});

		// Find the Volvo product
		const volvoProduct = products.data.find(
			(p) =>
				p.name.toUpperCase().includes("VOLVO FH16 XL RED") ||
				(p.name.toUpperCase().includes("VOLVO") &&
					p.name.toUpperCase().includes("FH16") &&
					p.name.toUpperCase().includes("RED")),
		);

		if (!volvoProduct) {
			console.log("❌ Premium Classixxs Volvo FH16 XL Red not found");
			console.log("Available Volvo products:");
			const volvoProducts = products.data.filter((p) => p.name.toUpperCase().includes("VOLVO"));
			volvoProducts.forEach((p) => console.log(`   - ${p.name}`));
			return;
		}

		console.log(`✅ Found: ${volvoProduct.name}`);
		console.log(`   Product ID: ${volvoProduct.id}`);
		console.log(`   Current Images: ${volvoProduct.images.length} image(s)`);
		if (volvoProduct.images.length > 0) {
			volvoProduct.images.forEach((img, index) => {
				console.log(`     ${index + 1}. ${img}`);
			});
		}

		// New images array with main and second image
		const newImages = [
			"https://i.ibb.co/CGWYYWY/Generated-Image-October-26-2025-2-01-AM.png", // Main image
			"https://i.ibb.co/tp6GrpC5/Generated-Image-October-26-2025-2-06-AM.png", // Second image
		];

		console.log(`\n📸 Updating with new images:`);
		newImages.forEach((img, index) => {
			console.log(`   ${index + 1}. ${img}`);
		});

		// Update the product with new images
		await stripe.products.update(volvoProduct.id, {
			images: newImages,
		});

		console.log(`\n✅ Successfully updated Premium Classixxs Volvo FH16 XL Red images!`);
		console.log(`   Main image: ${newImages[0]}`);
		console.log(`   Second image: ${newImages[1]}`);
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

updateVolvoRedImages();
