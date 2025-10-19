import Stripe from "stripe";

// Note: In Next.js runtime, STRIPE_SECRET_KEY should be available from environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

export interface Product {
	id: string;
	name: string;
	slug: string;
	price: number;
	images: string[];
	metadata: Record<string, string>;
	description?: string;
	active: boolean;
	currency: string;
}

export interface ProductBrowseResult {
	data: Product[];
	hasMore: boolean;
	endCursor?: string;
}

export async function getProducts(limit = 24): Promise<ProductBrowseResult> {
	try {
		const products = await stripe.products.list({
			limit,
			active: true,
		});

		const enrichedProducts: Product[] = [];

		for (const product of products.data) {
			// Get the price for this product
			const prices = await stripe.prices.list({
				product: product.id,
				limit: 1,
				active: true,
			});

			const price = prices.data[0];
			if (price) {
				enrichedProducts.push({
					id: product.id,
					name: product.name,
					slug: product.metadata.slug || product.id,
					price: price.unit_amount || 0, // Keep in cents for consistency
					images: product.images || [],
					metadata: product.metadata || {},
					description: product.description || undefined,
					active: product.active ?? true,
					currency: price.currency.toLowerCase(),
				});
			}
		}

		return {
			data: enrichedProducts,
			hasMore: products.has_more,
			endCursor: products.data[products.data.length - 1]?.id,
		};
	} catch (error) {
		console.error("Error fetching products:", error);
		return { data: [], hasMore: false };
	}
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
	try {
		// First, try to find by slug metadata
		const products = await stripe.products.list({
			limit: 100, // Search through more products
			active: true,
		});

		for (const product of products.data) {
			if (product.metadata.slug === slug) {
				const prices = await stripe.prices.list({
					product: product.id,
					limit: 1,
					active: true,
				});

				const price = prices.data[0];
				if (price) {
					return {
						id: product.id,
						name: product.name,
						slug: product.metadata.slug || product.id,
						price: price.unit_amount || 0, // Keep in cents for consistency
						images: product.images || [],
						metadata: product.metadata || {},
						description: product.description || undefined,
						active: product.active ?? true,
						currency: price.currency.toLowerCase(),
					};
				}
			}
		}

		// If not found by slug, try by ID
		const product = await stripe.products.retrieve(slug);
		const prices = await stripe.prices.list({
			product: product.id,
			limit: 1,
			active: true,
		});

		const price = prices.data[0];
		if (price) {
			return {
				id: product.id,
				name: product.name,
				slug: product.metadata.slug || product.id,
				price: Math.round((price.unit_amount || 0) / 100),
				images: product.images || [],
				metadata: product.metadata || {},
				description: product.description || undefined,
				active: product.active ?? true,
				currency: price.currency.toLowerCase(),
			};
		}

		return null;
	} catch (error) {
		console.error("Error fetching product:", error);
		return null;
	}
}

export async function searchProducts(query: string): Promise<Product[]> {
	try {
		const allProducts = await getProducts(100);
		const searchTerm = query.toLowerCase();

		return allProducts.data.filter(
			(product) =>
				product.name.toLowerCase().includes(searchTerm) ||
				product.description?.toLowerCase().includes(searchTerm) ||
				product.metadata.brand?.toLowerCase().includes(searchTerm) ||
				product.metadata.category?.toLowerCase().includes(searchTerm),
		);
	} catch (error) {
		console.error("Error searching products:", error);
		return [];
	}
}

export async function getProductsByCategory(categorySlug: string, limit = 3): Promise<Product[]> {
	try {
		const products = await stripe.products.list({
			limit: 100,
			active: true,
		});

		const filteredProducts: Product[] = [];

		for (const product of products.data) {
			// Check if product's category metadata matches the category slug
			if (product.metadata.category?.toLowerCase() === categorySlug.toLowerCase()) {
				const prices = await stripe.prices.list({
					product: product.id,
					limit: 1,
					active: true,
				});

				const price = prices.data[0];
				if (price) {
					filteredProducts.push({
						id: product.id,
						name: product.name,
						slug: product.metadata.slug || product.id,
						price: price.unit_amount || 0, // Keep in cents for consistency
						images: product.images || [],
						metadata: product.metadata || {},
						description: product.description || undefined,
						active: product.active ?? true,
						currency: price.currency.toLowerCase(),
					});
				}
			}

			// Stop once we have enough products
			if (filteredProducts.length >= limit) break;
		}

		return filteredProducts;
	} catch (error) {
		console.error(`Error fetching products for category ${categorySlug}:`, error);
		return [];
	}
}
