import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { getProducts } from "../src/lib/product-service";

async function debugProducts() {
	console.log("🔍 Debugging product loading...");

	try {
		const result = await getProducts(10);
		console.log(`✅ Found ${result.data.length} products`);

		if (result.data.length > 0) {
			console.log("\n📋 First 3 products:");
			result.data.slice(0, 3).forEach((product, idx) => {
				console.log(`\n${idx + 1}. ${product.name}`);
				console.log(`   - Price: €${product.price}`);
				console.log(`   - Images: ${product.images.length}`);
				console.log(`   - Slug: ${product.slug}`);
				console.log(`   - Metadata keys: ${Object.keys(product.metadata)}`);
				if (product.metadata.category) {
					console.log(`   - Category: ${product.metadata.category}`);
				}
				if (product.metadata.onSale) {
					console.log(`   - On Sale: ${product.metadata.onSale}`);
				}
			});
		}

		// Test category filtering
		console.log("\n🏷️  Testing category filters:");
		const onSale = result.data.filter(p => p.metadata.onSale === "true" || p.metadata.originalPrice);
		console.log(`- On Sale: ${onSale.length} products`);

		const limited = result.data.filter(p =>
			p.metadata.category?.includes("limited") ||
			p.name.toLowerCase().includes("limited")
		);
		console.log(`- Limited Edition: ${limited.length} products`);

		const rare = result.data.filter(p =>
			p.metadata.category?.includes("rare") ||
			p.name.toLowerCase().includes("rare")
		);
		console.log(`- Rare Models: ${rare.length} products`);

	} catch (error) {
		console.error("❌ Error:", error);
	}
}

debugProducts();