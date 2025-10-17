import type { MetadataRoute } from "next";
import { publicUrl } from "@/env.mjs";
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
		console.warn("Could not load products for sitemap:", error);
		// Continue with empty product URLs
	}

	const categoryUrls = StoreConfig.categories.map(
		(category) =>
			({
				url: `${publicUrl}/category/${category.slug}`,
				lastModified: new Date(),
				changeFrequency: "daily",
				priority: 0.5,
			}) satisfies Item,
	);

	return [
		{
			url: publicUrl,
			lastModified: new Date(),
			changeFrequency: "always",
			priority: 1,
		},
		...productUrls,
		...categoryUrls,
	];
}
