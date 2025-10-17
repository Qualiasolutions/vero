import Stripe from 'stripe';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env.local') });

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
	console.error('❌ STRIPE_SECRET_KEY not found in environment');
	process.exit(1);
}

console.log('🔑 Stripe Key Found:', stripeKey.substring(0, 20) + '...');

const stripe = new Stripe(stripeKey, {
	apiVersion: '2025-08-27.basil',
});

async function testStripe() {
	try {
		console.log('\n📦 Fetching products from Stripe...\n');

		const products = await stripe.products.list({
			limit: 100,
			active: true,
		});

		console.log(`✅ Total active products: ${products.data.length}`);

		if (products.data.length === 0) {
			console.log('\n⚠️  No products found in Stripe!');
			console.log('Please add products to your Stripe account.');
			return;
		}

		console.log('\n📋 Products:\n');

		for (const product of products.data.slice(0, 10)) {
			console.log(`  • ${product.name}`);
			console.log(`    ID: ${product.id}`);
			console.log(`    Slug: ${product.metadata?.slug || 'N/A'}`);
			console.log(`    Images: ${product.images?.length || 0}`);

			// Fetch price
			const prices = await stripe.prices.list({
				product: product.id,
				limit: 1,
				active: true,
			});

			if (prices.data.length > 0) {
				const price = prices.data[0];
				console.log(`    Price: ${(price.unit_amount || 0) / 100} ${price.currency.toUpperCase()}`);
			} else {
				console.log('    Price: No active price found!');
			}
			console.log('');
		}

		if (products.data.length > 10) {
			console.log(`  ... and ${products.data.length - 10} more products`);
		}

	} catch (error) {
		console.error('\n❌ Error connecting to Stripe:', error.message);
		if (error.code) {
			console.error('Error code:', error.code);
		}
	}
}

testStripe();
