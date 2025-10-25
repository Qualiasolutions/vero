import { config } from "dotenv";
import { resolve } from "path";
import Stripe from "stripe";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

// Product slug to new image URL mapping
const imageUpdates: Record<string, string> = {
	"autoart-alfa-romeo-4c-gloss-black":
		"https://i.ibb.co/xqtHG8Sn/Generated-Image-October-25-2025-6-11-PM-1.png",
	"paragon-models-bmw-x4-xdrive-3-5d-f83-2014":
		"https://i.ibb.co/YFY9h6Xb/Generated-Image-October-25-2025-6-10-PM.png",
	"ixo-toyota-calica-gt-four": "https://i.ibb.co/B5bPMz0L/Generated-Image-October-25-2025-6-08-PM.png",
	"kyosho-lamborghini-countach-lp400-red-1974":
		"https://i.ibb.co/8pt0wY6/Generated-Image-October-25-2025-6-06-PM-1.png",
	"premium-classixxs-man-tgx-xxl-blue-metallic":
		"https://i.ibb.co/JRW1VSKs/Generated-Image-October-25-2025-6-03-PM.png",
};

async function updateProductImages() {
	console.log("🔍 Fetching all products from Stripe...\n");

	try {
		// Fetch all products
		const products = await stripe.products.list({
			limit: 100,
			active: true,
		});

		let updatedCount = 0;
		const results: Array<{ slug: string; success: boolean; error?: string }> = [];

		for (const product of products.data) {
			const slug = product.metadata?.slug;

			if (!slug || !imageUpdates[slug]) {
				continue;
			}

			console.log(`📦 Updating: ${product.name}`);
			console.log(`   Slug: ${slug}`);
			console.log(`   Product ID: ${product.id}`);

			try {
				// Update product with new image
				await stripe.products.update(product.id, {
					images: [imageUpdates[slug]],
				});

				console.log(`   ✅ Successfully updated image\n`);
				updatedCount++;
				results.push({ slug, success: true });
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				console.error(`   ❌ Failed to update: ${errorMessage}\n`);
				results.push({ slug, success: false, error: errorMessage });
			}
		}

		console.log("=".repeat(50));
		console.log(`\n📊 Summary:`);
		console.log(`   Total products to update: ${Object.keys(imageUpdates).length}`);
		console.log(`   Successfully updated: ${updatedCount}`);
		console.log(`   Failed: ${results.filter((r) => !r.success).length}\n`);

		// Show detailed results
		if (results.length > 0) {
			console.log("Detailed Results:");
			for (const result of results) {
				if (result.success) {
					console.log(`   ✅ ${result.slug}`);
				} else {
					console.log(`   ❌ ${result.slug}: ${result.error}`);
				}
			}
		}

		// List products that weren't found
		const foundSlugs = results.map((r) => r.slug);
		const notFoundSlugs = Object.keys(imageUpdates).filter((slug) => !foundSlugs.includes(slug));

		if (notFoundSlugs.length > 0) {
			console.log(`\n⚠️  Products not found in Stripe:`);
			for (const slug of notFoundSlugs) {
				console.log(`   - ${slug}`);
			}
		}
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

updateProductImages();
