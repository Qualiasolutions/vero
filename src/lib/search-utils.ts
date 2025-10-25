import type { Product } from "commerce-kit";

export interface SearchFilters {
	query: string;
	category: string;
	brand: string;
	priceRange: { min: number; max: number } | null;
	inStock: boolean;
	sortBy: "name-asc" | "name-desc" | "price-asc" | "price-desc" | "rating" | "newest";
}

export interface SearchResult {
	products: Product[];
	facets: {
		categories: { name: string; count: number }[];
		brands: { name: string; count: number }[];
		priceRanges: { range: string; count: number }[];
	};
	total: number;
	suggestions?: string[];
}

type ProductMetadata = Record<string, unknown> & {
	brand?: string;
	category?: string;
};

const getMetadata = (product: Product): ProductMetadata => {
	const metadata = (product as { metadata?: ProductMetadata }).metadata;
	if (metadata && typeof metadata === "object") {
		return metadata;
	}
	return {};
};

// Advanced search with typo tolerance and relevance scoring
export function advancedSearch(products: Product[], filters: SearchFilters): SearchResult {
	let filteredProducts = [...products];

	// Text search with fuzzy matching
	if (filters.query.trim()) {
		const query = filters.query.toLowerCase().trim();
		const searchTerms = query.split(" ").filter((term) => term.length > 0);

		filteredProducts = filteredProducts
			.map((product) => {
				let relevanceScore = 0;
				const name = product.name.toLowerCase();
				const description =
					"description" in product && typeof (product as { description?: string }).description === "string"
						? ((product as { description?: string }).description as string).toLowerCase()
						: "";
				const metadata = getMetadata(product);
				const brand = typeof metadata.brand === "string" ? metadata.brand.toLowerCase() : "";
				const category = typeof metadata.category === "string" ? metadata.category.toLowerCase() : "";

				// Exact matches get higher scores
				if (name === query) relevanceScore += 100;
				if (brand === query) relevanceScore += 80;
				if (category === query) relevanceScore += 60;

				// Partial matches
				searchTerms.forEach((term) => {
					if (name.includes(term)) relevanceScore += 20;
					if (brand.includes(term)) relevanceScore += 15;
					if (category.includes(term)) relevanceScore += 10;
					if (description.includes(term)) relevanceScore += 5;

					// Fuzzy matching (character difference tolerance)
					if (fuzzyMatch(name, term)) relevanceScore += 10;
					if (fuzzyMatch(brand, term)) relevanceScore += 8;
				});

				return { product, relevanceScore };
			})
			.filter(({ relevanceScore }) => relevanceScore > 0)
			.sort((a, b) => b.relevanceScore - a.relevanceScore)
			.map(({ product }) => product);
	}

	// Apply other filters
	filteredProducts = filteredProducts.filter((product) => {
		const metadata = getMetadata(product);

		// Category filter
		if (filters.category && metadata.category !== filters.category) {
			return false;
		}

		// Brand filter
		if (filters.brand && metadata.brand !== filters.brand) {
			return false;
		}

		// Price range filter
		if (filters.priceRange) {
			if (
				product.price &&
				(product.price < filters.priceRange.min || product.price > filters.priceRange.max)
			) {
				return false;
			}
		}

		return true;
	});

	// Sort results
	filteredProducts = sortProducts(filteredProducts, filters.sortBy);

	// Generate facets
	const facets = generateFacets(products);

	// Generate search suggestions
	const suggestions = generateSuggestions(products, filters.query);

	return {
		products: filteredProducts,
		facets,
		total: filteredProducts.length,
		suggestions,
	};
}

// Simple fuzzy matching implementation
function fuzzyMatch(str: string, pattern: string): boolean {
	if (str.length === 0 || pattern.length === 0) return false;

	let patternIdx = 0;
	let strIdx = 0;
	let patternLength = pattern.length;
	let strLength = str.length;

	while (patternIdx < patternLength && strIdx < strLength) {
		if (str[strIdx] === pattern[patternIdx]) {
			patternIdx++;
		}
		strIdx++;
	}

	return patternIdx === patternLength;
}

// Sort products based on various criteria
const getCreatedTimestamp = (product: Product): number => {
	if ("created" in product) {
		const created = (product as { created?: string | number | Date }).created;
		if (created instanceof Date) {
			return created.getTime();
		}
		if (typeof created === "string" || typeof created === "number") {
			const date = new Date(created);
			if (!Number.isNaN(date.getTime())) {
				return date.getTime();
			}
		}
	}
	return 0;
};

function sortProducts(products: Product[], sortBy: SearchFilters["sortBy"]): Product[] {
	return [...products].sort((a, b) => {
		switch (sortBy) {
			case "name-asc":
				return a.name.localeCompare(b.name);
			case "name-desc":
				return b.name.localeCompare(a.name);
			case "price-asc":
				return (a.price || 0) - (b.price || 0);
			case "price-desc":
				return (b.price || 0) - (a.price || 0);
			case "rating":
				return getCreatedTimestamp(b) - getCreatedTimestamp(a);
			case "newest":
				return getCreatedTimestamp(b) - getCreatedTimestamp(a);
			default:
				return 0;
		}
	});
}

// Generate search facets for filtering
function generateFacets(allProducts: Product[]) {
	const categories = new Map<string, number>();
	const brands = new Map<string, number>();
	const priceRanges = new Map<string, number>();

	allProducts.forEach((product) => {
		const metadata = getMetadata(product);
		// Count categories
		const category = metadata.category || "Uncategorized";
		categories.set(category, (categories.get(category) || 0) + 1);

		// Count brands
		const brand = metadata.brand || "Unknown";
		brands.set(brand, (brands.get(brand) || 0) + 1);

		// Count price ranges
		const price = product.price || 0;
		let priceRange = "Under €100";
		if (price >= 500) priceRange = "€500+";
		else if (price >= 300) priceRange = "€300-€500";
		else if (price >= 200) priceRange = "€200-€300";
		else if (price >= 100) priceRange = "€100-€200";

		priceRanges.set(priceRange, (priceRanges.get(priceRange) || 0) + 1);
	});

	return {
		categories: Array.from(categories.entries())
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count),
		brands: Array.from(brands.entries())
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count),
		priceRanges: Array.from(priceRanges.entries())
			.map(([range, count]) => ({ range, count }))
			.sort((a, b) => b.count - a.count),
	};
}

// Generate search suggestions
function generateSuggestions(products: Product[], query: string): string[] {
	if (query.length < 2) return [];

	const suggestions = new Set<string>();
	const queryLower = query.toLowerCase();

	products.forEach((product) => {
		const metadata = getMetadata(product);
		// Product name suggestions
		if (product.name.toLowerCase().includes(queryLower)) {
			suggestions.add(product.name);
		}

		// Brand suggestions
		const brand = metadata.brand;
		if (brand?.toLowerCase().includes(queryLower)) {
			suggestions.add(brand);
		}

		// Category suggestions
		const category = metadata.category;
		if (category?.toLowerCase().includes(queryLower)) {
			suggestions.add(category);
		}
	});

	return Array.from(suggestions).slice(0, 5); // Limit to 5 suggestions
}

// Highlight search terms in text
export function highlightSearchTerms(text: string, query: string): string {
	if (!query.trim()) return text;

	const searchTerms = query
		.trim()
		.split(" ")
		.filter((term) => term.length > 0);
	let highlightedText = text;

	searchTerms.forEach((term) => {
		const regex = new RegExp(`(${escapeRegExp(term)})`, "gi");
		highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 text-yellow-900">$1</mark>');
	});

	return highlightedText;
}

// Escape special regex characters
function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Debounce function for search input
export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;

	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}
