import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { getProducts } from "../src/lib/product-service";

async function testProductService() {
	console.log("🧪 Testing custom product service...");

	try {
		const result = await getProducts(5);
		console.log(`✅ Success! Found ${result.data.length} products`);

		if (result.data.length > 0) {
			console.log("\n📋 Sample product:");
			const product = result.data[0];
			console.log(`- ID: ${product.id}`);
			console.log(`- Name: ${product.name}`);
			console.log(`- Price: €${product.price}`);
			console.log(`- Images: ${product.images.length}`);
			console.log(`- Metadata:`, product.metadata);
		}
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

testProductService();