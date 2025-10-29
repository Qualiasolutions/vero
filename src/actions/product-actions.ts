"use server";

import type Stripe from "stripe";
import { logger } from "@/lib/logger";
import { getStripeClient } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import type { ExtendedComingSoonProduct } from "@/types/products";

// Helper to check if a product is coming soon based on metadata or name
function isComingSoonProduct(product: Stripe.Product): boolean {
	const name = product.name.toLowerCase();
	const description = product.description?.toLowerCase() || "";
	const metadata = product.metadata || [];

	// Check various indicators of coming soon products
	const comingSoonIndicators = [
		"coming soon",
		"pre-order",
		"preorder",
		"expected release",
		"january 2026",
		"february 2026",
		"march 2026",
		"april 2026",
		"may 2026",
		"june 2026",
		"2026",
		"announcement",
		"tba",
		"to be announced",
	];

	// Check name and description
	const hasComingSoonIndicator = comingSoonIndicators.some(
		(indicator) => name.includes(indicator) || description.includes(indicator),
	);

	// Check metadata for coming soon flags
	const hasComingSoonMetadata =
		metadata.coming_soon === "true" ||
		metadata.pre_order === "true" ||
		metadata.status === "coming-soon" ||
		metadata.availability === "pre-order";

	return hasComingSoonIndicator || hasComingSoonMetadata;
}

// Helper to extract product details from Stripe product
function extractProductDetails(product: Stripe.Product): Partial<ExtendedComingSoonProduct> {
	const name = product.name;

	// Try to extract brand, model, year from name/description
	const brandMatch = name.match(
		/^(BMW|Mercedes|Audi|Ferrari|Porsche|Lamborghini|McLaren|Bugatti|Aston Martin|Jaguar|Bentley|Rolls Royce|Alfa Romeo|Maserati|Lotus|Tesla|Toyota|Honda|Nissan|Mazda|Subaru|Mitsubishi|Suzuki|Mini|Renault|Peugeot|Citroën|Volkswagen|Opel|Ford|Chevrolet|Dodge|Chrysler|Jeep|Hummer|Lincoln|Cadillac|Buick|GMC|Kia|Hyundai|Genesis|Infiniti|Acura|Lexus|Volvo|Saab|Smart|Dacia|SEAT|Škoda|Land Rover|MINI|OttO mobile|AutoArt|GT Spirit|Solido|Norev|IXO|PARAGON|KK Scale|MCG|Almost Real|KYOSHO|Premium ClassiXXs)/i,
	);
	const yearMatch = name.match(/\b(19|20)\d{2}\b/);
	const scaleMatch = name.match(/1:([0-9]+)/);

	return {
		id: product.id,
		name: product.name,
		description: product.description || undefined,
		image: product.images[0],
		brand: brandMatch?.[1] || undefined,
		year: yearMatch ? parseInt(yearMatch[0]) : undefined,
		scale: scaleMatch ? `1:${scaleMatch[1]}` : "1:18",
		metadata: (product.metadata as Record<string, string>) || {},
	};
}

export async function getComingSoonProducts(): Promise<ExtendedComingSoonProduct[]> {
	try {
		const stripe = getStripeClient();
		const supabase = await createClient();

		// Fetch preorder products from Supabase
		const { data: supabasePreorders, error: supabaseError } = await supabase
			.from("preorder_products")
			.select("*")
			.eq("is_preorder", true)
			.limit(20);

		if (supabaseError) {
			logger.error("Error fetching preorder products from Supabase", supabaseError);
		}

		// Fetch products from Stripe that might be coming soon
		const stripeProducts = await stripe.products.list({
			active: true,
			limit: 50,
		});

		// Filter for coming soon products
		const comingSoonStripeProducts = stripeProducts.data.filter(isComingSoonProduct);

		// Get prices for all products
		const allProductIds = [
			...comingSoonStripeProducts.map((p) => p.id),
			...(supabasePreorders?.map((p) => p.stripe_product_id) || []),
		];

		// Fetch prices in batches since Stripe API doesn't support array filters
		const allPrices: Stripe.Price[] = [];
		for (const productId of allProductIds) {
			try {
				const priceList = await stripe.prices.list({
					product: productId,
					active: true,
					limit: 10,
				});
				allPrices.push(...priceList.data);
			} catch (error) {
				logger.error(`Error fetching prices for product ${productId}`, error);
			}
		}

		// Create price lookup map
		const priceMap = new Map<string, Stripe.Price>();
		allPrices.forEach((price) => {
			if (typeof price.product === "string") {
				priceMap.set(price.product, price);
			}
		});

		// Process products and combine data
		const extendedProducts: ExtendedComingSoonProduct[] = [];

		// Process Supabase preorder products
		if (supabasePreorders) {
			for (const preorder of supabasePreorders) {
				try {
					const stripeProduct = await stripe.products.retrieve(preorder.stripe_product_id);
					const stripePrice = priceMap.get(preorder.stripe_product_id);

					if (stripeProduct && stripePrice) {
						const productDetails = extractProductDetails(stripeProduct);
						extendedProducts.push({
							...productDetails,
							stripeProductId: preorder.stripe_product_id,
							supabaseRecord: preorder,
							stripeProduct,
							stripePrice,
							expectedAvailabilityDate: preorder.expected_availability_date
								? new Date(preorder.expected_availability_date)
								: undefined,
							availabilityStatus:
								preorder.availability_status as ExtendedComingSoonProduct["availabilityStatus"],
							preOrderLimit: preorder.pre_order_limit || undefined,
							currentPreOrders: preorder.current_pre_orders,
							depositRequired: preorder.deposit_required,
							depositPercentage: preorder.deposit_percentage
								? parseFloat(preorder.deposit_percentage)
								: undefined,
							preOrderDescription: preorder.pre_order_description || undefined,
							price: stripePrice.unit_amount || undefined,
							currency: stripePrice.currency?.toUpperCase(),
						} as ExtendedComingSoonProduct);
					}
				} catch (error) {
					logger.error(`Error fetching Stripe product ${preorder.stripe_product_id}`, error);
				}
			}
		}

		// Process additional Stripe products that are coming soon but not in Supabase
		for (const stripeProduct of comingSoonStripeProducts) {
			const stripePrice = priceMap.get(stripeProduct.id);

			// Skip if already processed from Supabase
			if (extendedProducts.some((p) => p.stripeProductId === stripeProduct.id)) {
				continue;
			}

			if (stripePrice) {
				const productDetails = extractProductDetails(stripeProduct);
				extendedProducts.push({
					...productDetails,
					stripeProductId: stripeProduct.id,
					stripeProduct,
					stripePrice,
					expectedAvailabilityDate: new Date("2026-01-31"), // Default to end of next month
					availabilityStatus: "coming-soon",
					depositRequired: false,
					currentPreOrders: 0,
					price: stripePrice.unit_amount || undefined,
					currency: stripePrice.currency?.toUpperCase(),
				} as ExtendedComingSoonProduct);
			}
		}

		// Sort by expected availability date (earliest first) and then by name
		extendedProducts.sort((a, b) => {
			const dateA = a.expectedAvailabilityDate?.getTime() || 0;
			const dateB = b.expectedAvailabilityDate?.getTime() || 0;
			if (dateA !== dateB) {
				return dateA - dateB;
			}
			return a.name.localeCompare(b.name);
		});

		return extendedProducts;
	} catch (error) {
		logger.error("Error fetching coming soon products", error);
		return [];
	}
}
