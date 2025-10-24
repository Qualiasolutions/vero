"use client";

import { useState } from "react";
import { filterProducts, sortProducts } from "@/lib/filter-products";
import type { Product } from "@/lib/product-service";
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
		<div className="container mx-auto px-4 pt-8 pb-16">
			<div className="flex flex-col lg:flex-row gap-8">
				{/* Sidebar Filters */}
				<div className="lg:sticky lg:top-24 lg:self-start">
					<CategoryFilters onFilterChange={handleFilterChange} />
				</div>

				{/* Products Grid */}
				<div className="flex-1">
					{/* Results Header - Enhanced */}
					<div className="mb-8 vero-glass-card rounded-lg p-5 border border-[#C4A962]/20">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="h-10 w-1 bg-gradient-to-b from-[#C4A962] to-[#A89050] rounded-full" />
								<div>
									<p className="text-sm font-medium text-[#6B7280] uppercase tracking-wide">Results</p>
									<p className="text-lg font-semibold text-[#111827]">
										Showing <span className="text-[#C4A962]">{sortedProducts.length}</span> of{" "}
										<span className="text-[#C4A962]">{products.length}</span> models
									</p>
								</div>
							</div>
							{sortedProducts.length !== products.length && (
								<div className="text-xs text-[#6B7280] bg-[#C4A962]/10 px-3 py-1.5 rounded-full">
									Filtered
								</div>
							)}
						</div>
					</div>

					{sortedProducts.length > 0 ? (
						<ProductList products={sortedProducts} />
					) : (
						<div className="vero-card rounded-2xl p-12 text-center border border-[#C4A962]/20">
							<div className="text-[#C4A962]/40 text-6xl mb-6">🔍</div>
							<h3 className="text-2xl font-light text-[#111827] mb-4 uppercase tracking-wide">
								No Models Found
							</h3>
							<p className="text-[#6B7280] max-w-2xl mx-auto mb-8 leading-relaxed">
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
								className="inline-flex items-center gap-2 bg-[#C4A962] hover:bg-[#A89050] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#C4A962]/30 uppercase tracking-wide text-sm"
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
