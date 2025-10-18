"use client";

import { useState } from "react";
import type { Product } from "@/lib/product-service";
import { filterProducts, sortProducts } from "@/lib/filter-products";
import { CategoryFilters, type FilterState } from "@/ui/category/category-filters";
import { ProductList } from "@/ui/products/product-list";

interface CategoryContentProps {
	products: Product[];
}

export function CategoryContent({ products }: CategoryContentProps) {
	const [filters, setFilters] = useState<FilterState>({
		priceRange: "all",
		availability: [],
		brands: [],
		scales: [],
		yearRange: "all",
		sortBy: "featured",
	});

	// Apply filters and sorting
	const filteredProducts = filterProducts(products, filters);
	const sortedProducts = sortProducts(filteredProducts, filters.sortBy);

	const handleFilterChange = (newFilters: FilterState) => {
		setFilters(newFilters);
	};

	return (
		<div className="container mx-auto px-4 py-16">
			<div className="flex flex-col lg:flex-row gap-8">
				{/* Sidebar Filters */}
				<div className="lg:sticky lg:top-24 lg:self-start">
					<CategoryFilters onFilterChange={handleFilterChange} />
				</div>

				{/* Products Grid */}
				<div className="flex-1">
					{/* Results Count */}
					<div className="mb-6 flex items-center justify-between">
						<p className="text-sm text-gray-600">
							Showing <span className="font-semibold text-gray-900">{sortedProducts.length}</span> of{" "}
							<span className="font-semibold text-gray-900">{products.length}</span> models
						</p>
					</div>

					{sortedProducts.length > 0 ? (
						<ProductList products={sortedProducts} />
					) : (
						<div className="text-center py-16">
							<div className="text-[#D4AF37]/40 text-6xl mb-6">🔍</div>
							<h3 className="text-2xl font-light text-[#212529] mb-4 uppercase tracking-wide">
								No Models Found
							</h3>
							<p className="text-[#6C757D] max-w-2xl mx-auto mb-8">
								No models match your current filters. Try adjusting your filter criteria to see more results.
							</p>
							<button
								onClick={() =>
									setFilters({
										priceRange: "all",
										availability: [],
										brands: [],
										scales: [],
										yearRange: "all",
										sortBy: "featured",
									})
								}
								className="inline-flex items-center text-[#D4AF37] hover:text-[#B8941F] font-medium tracking-wide transition-colors"
							>
								Clear All Filters →
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
