import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

async function checkMetadata() {
	const products = await stripe.products.list({ limit: 10, active: true });

	console.log("Checking product metadata...\n");

	for (const product of products.data) {
		console.log("---");
		console.log("ID:", product.id);
		console.log("Name:", product.name);
		console.log("Metadata:", product.metadata);
		console.log("");
	}
}

checkMetadata();
