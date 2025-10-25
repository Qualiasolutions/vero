import type { MetadataRoute } from "next";
import { publicUrl } from "@/env.mjs";
import { logger } from "@/lib/logger";
import { getProducts } from "@/lib/product-service";
import StoreConfig from "@/store.config";

type Item = MetadataRoute.Sitemap[number];
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Handle case where no products exist yet (before migration)
	let productUrls: Item[] = [];

	try {
		const result = await getProducts(100);
		if (result.data && Array.isArray(result.data)) {
			productUrls = result.data.map(
				(product) =>
					({
						url: `${publicUrl}/product/${product.slug || product.id}`,
						lastModified: new Date(),
						changeFrequency: "daily",
						priority: 0.8,
					}) satisfies Item,
			);
		}
	} catch (error) {
		logger.warn("Could not load products for sitemap", { error });
		// Continue with empty product URLs
	}

	const categoryUrls = StoreConfig.categories.map(
		(category) =>
			({
				url: `${publicUrl}/category/${category.slug}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: 0.8,
			}) satisfies Item,
	);

	// Static pages with proper priorities
	const staticPages = [
		{ url: "/products", priority: 0.9, changeFreq: "daily" as const },
		{ url: "/search", priority: 0.7, changeFreq: "weekly" as const },
		{ url: "/contact", priority: 0.6, changeFreq: "monthly" as const },
		{ url: "/about", priority: 0.6, changeFreq: "monthly" as const },
		{ url: "/faq", priority: 0.6, changeFreq: "monthly" as const },
		{ url: "/shipping-returns", priority: 0.5, changeFreq: "monthly" as const },
		{ url: "/privacy-policy", priority: 0.3, changeFreq: "yearly" as const },
		{ url: "/terms-of-service", priority: 0.3, changeFreq: "yearly" as const },
		{ url: "/newsletter", priority: 0.5, changeFreq: "monthly" as const },
		{ url: "/favorites", priority: 0.7, changeFreq: "weekly" as const },
		{ url: "/cart", priority: 0.4, changeFreq: "daily" as const },
	];

	const staticUrls = staticPages.map(
		(page) =>
			({
				url: `${publicUrl}${page.url}`,
				lastModified: new Date(),
				changeFrequency: page.changeFreq,
				priority: page.priority,
			}) satisfies Item,
	);

	return [
		{
			url: publicUrl,
			lastModified: new Date(),
			changeFrequency: "always",
			priority: 1,
		},
		...staticUrls,
		...categoryUrls,
		...productUrls,
	];
}
