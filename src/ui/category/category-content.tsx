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
					<div className="mb-8 vero-glass-card rounded-lg p-5 border border-[#D4AF37]/20">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="h-10 w-1 bg-gradient-to-b from-[#D4AF37] to-[#B8941F] rounded-full" />
								<div>
									<p className="text-sm font-medium text-[#6C757D] uppercase tracking-wide">Results</p>
									<p className="text-lg font-semibold text-[#212529]">
										Showing <span className="text-[#D4AF37]">{sortedProducts.length}</span> of{" "}
										<span className="text-[#D4AF37]">{products.length}</span> models
									</p>
								</div>
							</div>
							{sortedProducts.length !== products.length && (
								<div className="text-xs text-[#6C757D] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full">
									Filtered
								</div>
							)}
						</div>
					</div>

					{sortedProducts.length > 0 ? (
						<ProductList products={sortedProducts} />
					) : (
						<div className="vero-card rounded-2xl p-12 text-center border border-[#D4AF37]/20">
							<div className="text-[#D4AF37]/40 text-6xl mb-6">🔍</div>
							<h3 className="text-2xl font-light text-[#212529] mb-4 uppercase tracking-wide">
								No Models Found
							</h3>
							<p className="text-[#6C757D] max-w-2xl mx-auto mb-8 leading-relaxed">
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
								className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#D4AF37]/30 uppercase tracking-wide text-sm"
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
