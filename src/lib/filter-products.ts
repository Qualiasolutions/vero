import type { Product } from "@/lib/product-service";
import type { FilterState } from "@/ui/category/category-filters";

export function filterProducts(products: Product[], filters: FilterState): Product[] {
	let filtered = [...products];

	// Apply price range filter
	if (filters.priceRange !== "all") {
		filtered = filtered.filter((product) => {
			const price = product.price;
			switch (filters.priceRange) {
				case "0-75":
					return price < 75;
				case "75-150":
					return price >= 75 && price < 150;
				case "150-250":
					return price >= 150 && price < 250;
				case "250-500":
					return price >= 250 && price < 500;
				case "500+":
					return price >= 500;
				default:
					return true;
			}
		});
	}

	// Apply brand filter
	if (filters.brands.length > 0) {
		filtered = filtered.filter((product) => {
			const productBrand = product.metadata.brand || product.name;
			return filters.brands.some((brand) => productBrand.toLowerCase().includes(brand.toLowerCase()));
		});
	}

	// Apply scale filter
	if (filters.scales.length > 0) {
		filtered = filtered.filter((product) => {
			const productScale =
				product.metadata.scale || product.name.match(/1:\d+/)?.[0] || product.description?.match(/1:\d+/)?.[0];
			return filters.scales.some((scale) => {
				if (scale === "Other") {
					return !productScale || !["1:18", "1:43", "1:64", "1:12", "1:24"].includes(productScale);
				}
				return productScale?.includes(scale);
			});
		});
	}

	// Apply year range filter
	if (filters.yearRange !== "all") {
		filtered = filtered.filter((product) => {
			const yearStr = product.metadata.year || product.name.match(/\b(19|20)\d{2}\b/)?.[0];
			if (!yearStr) return false;
			const year = parseInt(yearStr, 10);

			switch (filters.yearRange) {
				case "2024-2025":
					return year >= 2024 && year <= 2025;
				case "2020-2023":
					return year >= 2020 && year <= 2023;
				case "2010-2019":
					return year >= 2010 && year <= 2019;
				case "2000-2009":
					return year >= 2000 && year <= 2009;
				case "pre-2000":
					return year < 2000;
				default:
					return true;
			}
		});
	}

	// Apply availability filter
	if (filters.availability.length > 0) {
		filtered = filtered.filter((product) => {
			const availability = product.metadata.availability || "in-stock";
			return filters.availability.some((filter) => {
				if (filter === "in-stock") return availability === "in-stock" || !product.metadata.availability;
				if (filter === "pre-order") return availability === "pre-order" || product.name.toLowerCase().includes("pre-order");
				if (filter === "limited")
					return (
						availability === "limited" ||
						product.name.toLowerCase().includes("limited") ||
						product.name.toLowerCase().includes("edition")
					);
				return false;
			});
		});
	}

	return filtered;
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
	const sorted = [...products];

	switch (sortBy) {
		case "price-low":
			return sorted.sort((a, b) => a.price - b.price);
		case "price-high":
			return sorted.sort((a, b) => b.price - a.price);
		case "name":
			return sorted.sort((a, b) => a.name.localeCompare(b.name));
		case "newest":
			// Sort by metadata.order or creation date if available
			return sorted.sort((a, b) => {
				const orderA = parseInt(a.metadata.order || "999", 10);
				const orderB = parseInt(b.metadata.order || "999", 10);
				return orderA - orderB;
			});
		case "featured":
		default:
			// Sort by metadata.order field (lower numbers first)
			return sorted.sort((a, b) => {
				const orderA = parseInt(a.metadata.order || "999", 10);
				const orderB = parseInt(b.metadata.order || "999", 10);
				return orderA - orderB;
			});
	}
}
