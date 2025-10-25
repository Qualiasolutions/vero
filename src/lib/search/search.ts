import { unstable_cache } from "next/cache";
import { commerce } from "@/lib/commerce";
import { logger } from "@/lib/logger";
import { simpleSearch } from "./simplesearch";

export const searchProducts = unstable_cache(
	async (query: string) => {
		// Only use commerce if it's available (server-side)
		if (!commerce) {
			logger.error("Commerce is not available on client side");
			return [];
		}

		const result = await commerce.product.browse({ first: 100 });
		const products = result.data;
		const searchResults = simpleSearch(products, query);
		return searchResults.map((sr) => products.find((p) => p.id === sr.id)).filter(Boolean);
	},
	["search", "products"],
	{
		tags: ["search", "products"],
	},
);
