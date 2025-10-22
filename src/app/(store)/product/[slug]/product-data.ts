import { notFound } from "next/navigation";
import { cache } from "react";
import { getProductBySlug, type Product } from "@/lib/product-service";

// Cache the product data to avoid duplicate API calls
export const getProductData = cache(async (slug: string): Promise<Product> => {
	const product = await getProductBySlug(slug);

	if (!product) {
		notFound();
	}

	return product;
});
