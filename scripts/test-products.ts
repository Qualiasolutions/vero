import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { Commerce } from "commerce-kit/stripe";

async function testProducts() {
	console.log("🧪 Testing commerce-kit product loading...");

	try {
		const commerce = new Commerce();
		const result = await commerce.product.browse({ first: 5 });

		console.log(`✅ Success! Found ${result?.data?.length || 0} products`);

		if (result?.data && result.data.length > 0) {
			console.log("\n📋 Sample product:");
			const product = result.data[0];
			console.log(`- ID: ${product.id}`);
			console.log(`- Name: ${product.name}`);
			console.log(`- Price: €${product.price}`);
			console.log(`- Images: ${product.images?.length || 0}`);
			console.log(`- Metadata:`, product.metadata);
		}
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

testProducts();
