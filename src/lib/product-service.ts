import { commerce } from "./commerce";
import { performanceMonitor } from "./performance";
import { getStripeClient } from "./stripe";

// Simple in-memory cache with 5-minute TTL
const productCache = new Map<string, { product: Product; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Export cache utilities for testing and invalidation
export const cacheUtils = {
	invalidate: (slug: string) => productCache.delete(slug),
	invalidateAll: () => productCache.clear(),
	getSize: () => productCache.size,
	getCacheStats: () => {
		const now = Date.now();
		const valid = Array.from(productCache.values()).filter((item) => now - item.timestamp < CACHE_TTL);
		const expired = productCache.size - valid.length;
		return { total: productCache.size, valid: valid.length, expired };
	},
};

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

/**
 * Cleans product descriptions by removing unwanted text patterns
 * like "Türen/Hauben nicht zu öffnen!" and similar phrases
 */
function cleanProductDescription(description?: string | null): string | undefined {
	if (!description) return undefined;

	// List of unwanted patterns to remove from descriptions
	const unwantedPatterns = [
		// German phrases (including Unicode variants)
		/Türen\/Hauben nicht zu öffnen!?/gi,
		/Türen nicht zu öffnen!?/gi,
		/Hauben nicht zu öffnen!?/gi,
		/nicht zu \u00f6ffnen!?/gi, // Unicode ö
		/nicht zu öffnen!?/gi,
		/Keine \u00f6ffnenden Teile!?/gi, // Unicode ö
		/Keine öffnenden Teile!?/gi,
		/ohne \u00f6ffnende Teile!?/gi, // Unicode ö
		/ohne öffnende Teile!?/gi,

		// English phrases
		/Doors\/Hood cannot be opened!?/gi,
		/Doors cannot be opened!?/gi,
		/Hood cannot be opened!?/gi,
		/cannot be opened!?/gi,
		/No opening parts!?/gi,
		/without opening parts!?/gi,

		// Parenthetical warnings (including Unicode)
		/\([^)]*(?:nicht zu \u00f6ffnen|nicht zu \u00f6ffnen|cannot be opened|no opening)[^)]*\)/gi,

		// Brackets warnings (including Unicode)
		/\[[^\]]*(?:nicht zu \u00f6ffnen|nicht zu \u00f6ffnen|cannot be opened|no opening)[^\]]*\]/gi,

		// General patterns that might catch the issues
		/\(Türen, Motorhaube\.\.\. nicht zu \u00f6ffnen!\)/gi,
		/\(Türen, Motorhaube\.\.\. nicht zu öffnen!\)/gi,
	];

	let cleanedDescription = description;

	// Remove all unwanted patterns
	unwantedPatterns.forEach((pattern) => {
		cleanedDescription = cleanedDescription.replace(pattern, "");
	});

	// Clean up extra whitespace and punctuation
	cleanedDescription = cleanedDescription
		.replace(/\s+/g, " ") // Replace multiple spaces with single space
		.replace(/\s*[.,;:!]\s*/g, ". ") // Clean up punctuation spacing
		.replace(/\s*\.\s*$/g, ".") // Remove trailing space before period
		.replace(/^\s+/, "") // Remove leading whitespace
		.replace(/\s+$/, "") // Remove trailing whitespace
		.replace(/\.\s*\./g, ".") // Replace double periods with single period
		.trim();

	// Return cleaned description or undefined if empty
	return cleanedDescription || undefined;
}

export interface ProductBrowseResult {
	data: Product[];
	hasMore: boolean;
	endCursor?: string;
}

export async function getProducts(limit = 24): Promise<ProductBrowseResult> {
	// Initialize Stripe client only when needed
	const stripe = getStripeClient();

	try {
		// Try commerce-kit first (much faster - gets products with prices in one call)
		try {
			// Only use commerce if it's available (server-side)
			if (!commerce) {
				throw new Error("Commerce is not available on client side");
			}

			const products = await commerce.product.browse({
				first: limit,
			});

			// Check if products.data exists and is an array
			if (!products || !products.data || !Array.isArray(products.data)) {
				throw new Error("Commerce-kit returned invalid data structure");
			}

			const enrichedProducts: Product[] = products.data.map((product) => ({
				id: product.id,
				name: product.name,
				slug: product.slug || product.id,
				price: product.price || 0,
				images: product.images || [],
				metadata: {}, // commerce-kit doesn't expose metadata
				description: cleanProductDescription(product.summary),
				active: true, // commerce-kit only returns active products
				currency: product.currency || "eur",
			}));

			return {
				data: enrichedProducts,
				hasMore: false, // commerce-kit doesn't provide pagination info
				endCursor: products.data[products.data.length - 1]?.id,
			};
		} catch (commerceError) {
			console.warn("Commerce-kit failed, falling back to direct Stripe API:", commerceError);
		}

		// Fallback: Use direct Stripe API with expanded prices
		const products = await stripe.products.list({
			limit,
			active: true,
			expand: ["data.default_price"], // Expand default_price to avoid extra API calls
		});

		const enrichedProducts: Product[] = [];

		for (const product of products.data) {
			const price = product.default_price;
			if (price && typeof price !== "string") {
				enrichedProducts.push({
					id: product.id,
					name: product.name,
					slug: product.metadata.slug || product.id,
					price: price.unit_amount ? Math.round(price.unit_amount / 100) : 0,
					images: product.images || [],
					metadata: product.metadata || {},
					description: cleanProductDescription(product.description),
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
	const endTimer = performanceMonitor.startTimer("getProductBySlug", { slug });
	// Initialize Stripe client only when needed
	const stripe = getStripeClient();

	// Check cache first
	const cached = productCache.get(slug);
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		const metric = endTimer();
		metric.metadata = { source: "cache" };
		return cached.product;
	}

	try {
		// Try commerce-kit first (much faster)
		try {
			// Only use commerce if it's available (server-side)
			if (!commerce) {
				throw new Error("Commerce is not available on client side");
			}

			const commerceProducts = await commerce.product.browse({
				first: 100,
			});

			for (const product of commerceProducts.data) {
				if (product.slug === slug) {
					const enrichedProduct: Product = {
						id: product.id,
						name: product.name,
						slug: product.slug || product.id,
						price: product.price || 0,
						images: product.images || [],
						metadata: {}, // commerce-kit doesn't expose metadata
						description: cleanProductDescription(product.summary),
						active: true, // commerce-kit only returns active products
						currency: product.currency || "eur",
					};

					// Cache the result
					productCache.set(slug, { product: enrichedProduct, timestamp: Date.now() });
					const metric = endTimer();
					metric.metadata = { source: "commerce-kit" };
					return enrichedProduct;
				}
			}
		} catch (commerceError) {
			console.warn("Commerce-kit failed, falling back to direct Stripe API:", commerceError);
		}

		// Fallback: Try direct Stripe API (only if commerce-kit fails)
		// First, try to find by slug metadata
		const products = await stripe.products.list({
			limit: 100, // Search through more products
			active: true,
			expand: ["data.default_price"], // Expand default_price to avoid extra API call
		});

		for (const product of products.data) {
			if (product.metadata.slug === slug) {
				const price = product.default_price;
				if (price && typeof price !== "string") {
					const enrichedProduct: Product = {
						id: product.id,
						name: product.name,
						slug: product.metadata.slug || product.id,
						price: price.unit_amount ? Math.round(price.unit_amount / 100) : 0,
						images: product.images || [],
						metadata: product.metadata || {},
						description: cleanProductDescription(product.description),
						active: product.active ?? true,
						currency: price.currency.toLowerCase(),
					};

					// Cache the result
					productCache.set(slug, { product: enrichedProduct, timestamp: Date.now() });
					const metric = endTimer();
					metric.metadata = { source: "stripe-api-slug-search" };
					return enrichedProduct;
				}
			}
		}

		// If not found by slug, try by ID (with expanded price)
		const product = await stripe.products.retrieve(slug, {
			expand: ["default_price"],
		});

		const price = product.default_price;
		if (price && typeof price !== "string") {
			const enrichedProduct: Product = {
				id: product.id,
				name: product.name,
				slug: product.metadata.slug || product.id,
				price: price.unit_amount ? Math.round(price.unit_amount / 100) : 0,
				images: product.images || [],
				metadata: product.metadata || {},
				description: cleanProductDescription(product.description),
				active: product.active ?? true,
				currency: price.currency.toLowerCase(),
			};

			// Cache the result
			productCache.set(slug, { product: enrichedProduct, timestamp: Date.now() });
			const metric = endTimer();
			metric.metadata = { source: "stripe-api-id-retrieve" };
			return enrichedProduct;
		}

		const metric = endTimer();
		metric.metadata = { source: "not-found" };
		return null;
	} catch (error) {
		const metric = endTimer();
		metric.metadata = { source: "error", error: error instanceof Error ? error.message : "Unknown error" };
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
	// Initialize Stripe client only when needed
	const stripe = getStripeClient();

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
						price: price.unit_amount ? Math.round(price.unit_amount / 100) : 0, // Convert from cents to euros
						images: product.images || [],
						metadata: product.metadata || {},
						description: cleanProductDescription(product.description),
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
