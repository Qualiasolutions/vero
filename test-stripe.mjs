import { config } from "dotenv";
import { dirname, join } from "path";
import Stripe from "stripe";
import { fileURLToPath } from "url";

const log = (...messages) => {
	process.stdout.write(`${messages.join(" ")}\n`);
};

const logError = (...messages) => {
	process.stderr.write(`${messages.join(" ")}\n`);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, ".env.local") });

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
	logError("❌ STRIPE_SECRET_KEY not found in environment");
	process.exit(1);
}

log("🔑 Stripe Key Found:", stripeKey.substring(0, 20) + "...");

const stripe = new Stripe(stripeKey);

async function testStripe() {
	try {
		log("\n📦 Fetching products from Stripe...\n");

		const products = await stripe.products.list({
			limit: 100,
			active: true,
		});

		log(`✅ Total active products: ${products.data.length}`);

		if (products.data.length === 0) {
			log("\n⚠️  No products found in Stripe!");
			log("Please add products to your Stripe account.");
			return;
		}

		log("\n📋 Products:\n");

		for (const product of products.data.slice(0, 10)) {
			log(`  • ${product.name}`);
			log(`    ID: ${product.id}`);
			log(`    Slug: ${product.metadata?.slug || "N/A"}`);
			log(`    Images: ${product.images?.length || 0}`);

			// Fetch price
			const prices = await stripe.prices.list({
				product: product.id,
				limit: 1,
				active: true,
			});

			if (prices.data.length > 0) {
				const price = prices.data[0];
				log(`    Price: ${(price.unit_amount || 0) / 100} ${price.currency.toUpperCase()}`);
			} else {
				log("    Price: No active price found!");
			}
			log("");
		}

		if (products.data.length > 10) {
			log(`  ... and ${products.data.length - 10} more products`);
		}
	} catch (error) {
		logError("\n❌ Error connecting to Stripe:", error.message);
		if (error.code) {
			logError("Error code:", error.code);
		}
	}
}

testStripe();
